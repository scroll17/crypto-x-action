import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { IntegrationNames } from '@common/integrations/common';
import { Integration, IntegrationDocument, IntegrationModel } from '@schemas/integration';
import { InjectModel } from '@nestjs/mongoose';
import { CryptoCompareApiRoutes } from '@common/integrations/crypto-compare';

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
    this.logger.verbose(`Load integration record by key: "${this.INTEGRATION_KEY}"`, {
      key: this.INTEGRATION_KEY,
    });

    const integration = await this.integrationModel.findOne({ key: this.INTEGRATION_KEY }).exec();
    if (!integration) {
      throw new HttpException(`Integration "${this.INTEGRATION_KEY}" not found`, HttpStatus.NOT_FOUND);
    }

    this.apiUrl = integration.apiUrl;
    this.integration = integration;
    this.logger.debug(`Integration "${this.INTEGRATION_KEY}" loaded:`, {
      key: integration.key,
      active: integration.active,
      apiUrl: integration.apiUrl,
    });

    // await this.getPrices('ETH', ['USD', 'EUR']);
    // await this.getPrices('ETH', ['BTCDDD']);
  }

  private checkActiveStatus() {
    if (!this.integration.active) {
      throw new HttpException(`Integration "${this.INTEGRATION_KEY}" is not active`, HttpStatus.BAD_REQUEST);
    }
  }

  private handleErrorResponse(route: string, data: Record<string, unknown>) {
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

  private getCachedPrice(fromSymbol: string, toSymbols: string[]) {}

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
      const { data } = await firstValueFrom(this.httpService.get<Record<string, number>>(url));
      this.handleErrorResponse(route, data);

      const prevCache = this.cachedPrice.get(fromSymbol) ?? {};
      this.cachedPrice.set(fromSymbol, { ...prevCache, ...data });

      return data;
    } catch (error) {
      this.logger.error('Price request error: ', error);
      throw error;
    }
  }

  public async getPrice(fromSymbol: string, toSymbol: string, cache = true) {}

  public getRateLimit() {}
}
