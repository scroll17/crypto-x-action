import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IntegrationNames } from '@common/integrations/common';
import { Integration, IntegrationDocument, IntegrationModel } from '@schemas/integration';
import { InjectModel } from '@nestjs/mongoose';
import {
  CryptoCompareApiRoutes,
  ICryptoGetawayGenericResponse,
  TCryptoGetawayDataResponse,
  TCryptoGetawayRateLimitResponse,
} from '@common/integrations/crypto-compare';

@Injectable()
export class CryptoCompareService implements OnModuleInit {
  private readonly INTEGRATION_KEY = IntegrationNames.CryptoCompare;

  private readonly logger = new Logger(this.constructor.name);

  private apiUrl: string;
  private integration: IntegrationDocument;

  private readonly cachedPrice: Map<string, Record<string, number>> = new Map();

  constructor(
    private readonly httpService: HttpService,
    @InjectModel(Integration.name) private readonly integrationModel: IntegrationModel,
  ) {}

  public async onModuleInit() {
    this.logger.debug(`Load integration record by key: "${this.INTEGRATION_KEY}"`, {
      key: this.INTEGRATION_KEY,
    });

    const integration = await this.integrationModel.findOne({ key: this.INTEGRATION_KEY }).exec();
    if (!integration) {
      throw new HttpException(`Integration "${this.INTEGRATION_KEY}" not found`, HttpStatus.NOT_FOUND);
    }

    this.apiUrl = integration.apiUrl;
    this.integration = integration;

    this.logger.verbose(`Integration "${this.INTEGRATION_KEY}" loaded:`, {
      key: integration.key,
      active: integration.active,
      apiUrl: integration.apiUrl,
    });

    if (this.integration.active) {
      await this.initConnection();
    }
  }

  private async initConnection() {
    this.logger.debug(`Ping the "${this.INTEGRATION_KEY}" Integration server`);

    const result = await this.getRateLimit();

    this.logger.verbose(`Ping to the "${this.INTEGRATION_KEY}" Integration server result`, {
      rateLimit: result,
    });
  }

  // TOOLS
  private checkActiveStatus() {
    if (!this.integration.active) {
      throw new HttpException(`Integration "${this.INTEGRATION_KEY}" is not active`, HttpStatus.BAD_REQUEST);
    }
  }

  private validateResponse(
    route: string,
    data: ICryptoGetawayGenericResponse<unknown> | Record<string, unknown>,
  ) {
    /**
     *  {
     *   "Response": "Error",
     *   "Message": "cccagg_or_exchange market does not exist for this coin pair (ETH-BTCDDD)",
     *   "HasWarning": false,
     *   "Type": 2,
     *   "RateLimit": {},
     *   "Data": {},
     *   "Cooldown": 0
     * }
     * */

    if ('Response' in data && data.Response === 'Error') {
      const message = `Error during execution "${route}" of Integration - "${this.INTEGRATION_KEY}"`;

      this.logger.error(message, { ...data });
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }

    return;
  }

  private getCachedPrice(fromSymbol: string, toSymbol: string) {
    const cache = this.cachedPrice.get(fromSymbol);
    if (cache) {
      return cache[toSymbol] ?? null;
    }

    return null;
  }

  // INTERNAL API
  public getIntegrationRecord() {
    return this.integration;
  }

  // API
  public async getPrices(fromSymbol: string, toSymbols: string[]) {
    this.checkActiveStatus();
    const route = CryptoCompareApiRoutes.Price;

    if (toSymbols.length === 0) {
      throw new HttpException('Passed invalid "toSymbols"', HttpStatus.BAD_REQUEST);
    }

    const query = new URLSearchParams(toSymbols.map((s) => ['tsyms', s]));
    query.append('fsym', fromSymbol);

    const url = `${this.apiUrl}${route}?${query.toString()}`;
    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
        query: query.toString(),
      });

      const { data: rawData } = await firstValueFrom(
        this.httpService.get<ICryptoGetawayGenericResponse<unknown> | TCryptoGetawayDataResponse>(url),
      );
      this.validateResponse(route, rawData);

      const data = rawData as TCryptoGetawayDataResponse;

      const prevCache = this.cachedPrice.get(fromSymbol) ?? {};
      const newCache = Object.entries({ ...prevCache, ...data }).filter(([, value]) => Boolean(value));

      this.cachedPrice.set(fromSymbol, Object.fromEntries(newCache));

      return data;
    } catch (error) {
      this.logger.error(`Request to "${route}" error: `, error);
      throw error;
    }
  }

  public async getPrice(fromSymbol: string, toSymbol: string, useCache = true): Promise<number | null> {
    if (useCache) {
      const cache = this.getCachedPrice(fromSymbol, toSymbol);
      if (cache) {
        this.logger.debug(`Selected value from cache: "${fromSymbol}" -> "${toSymbol}"`, {
          cache,
          fromS: fromSymbol,
          toS: toSymbol,
        });

        return cache;
      }
    }

    const prices = await this.getPrices(fromSymbol, [toSymbol]);

    return prices[toSymbol] ?? null;
  }

  public async getRateLimit() {
    this.checkActiveStatus();
    const route = CryptoCompareApiRoutes.RateLimit;

    const url = `${this.apiUrl}${route}`;
    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(this.httpService.get<TCryptoGetawayRateLimitResponse>(url));
      this.validateResponse(route, data);

      return data.Data;
    } catch (error) {
      this.logger.error(`Request to "${route}" error: `, error);
      throw error;
    }
  }
}