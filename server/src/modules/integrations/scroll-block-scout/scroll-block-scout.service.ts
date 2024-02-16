import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { IntegrationNames } from '@common/integrations/common';
import { Integration, IntegrationDocument, IntegrationModel } from '@schemas/integration';
import {
  ScrollBlockScoutApiActions,
  ScrollBlockScoutApiModules,
  TScrollBlockScoutTotalFeesResponse,
  TScrollBlockScoutCoinPriceResponse,
} from '@common/integrations/scroll-block-scout';

dayjs.extend(isoWeek);

@Injectable()
export class ScrollBlockScoutService implements OnModuleInit {
  private readonly INTEGRATION_KEY = IntegrationNames.ScrollBlockScout;

  private readonly logger = new Logger(this.constructor.name);

  private apiUrl: string;
  private integration: IntegrationDocument;

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

    const date = dayjs().format('YYYY-MM-DD');
    const result = await this.getTotalFees(date);

    this.logger.verbose(`Ping to the "${this.INTEGRATION_KEY}" Integration server result`, {
      stats: result,
    });
  }

  // TOOLS
  private checkActiveStatus() {
    if (!this.integration.active) {
      throw new HttpException(`Integration "${this.INTEGRATION_KEY}" is not active`, HttpStatus.BAD_REQUEST);
    }
  }

  private convertParams(params: Record<string, string>) {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }

  private handleErrorResponse(route: string, error: Error | AxiosError) {
    const message = `Error during execution "${route}" of Integration - "${this.INTEGRATION_KEY}"`;

    if (error instanceof AxiosError) {
      const { response } = error;

      if (!response) {
        this.logger.error(message, { error });
        return error;
      }

      this.logger.error(message, {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      });
      return new HttpException(
        message + ` ([status=${response.status}] [text=${response.statusText}])`,
        HttpStatus.BAD_REQUEST,
      );
    }

    this.logger.error(message, { error });
    return error;
  }

  // INTERNAL API
  public getIntegrationRecord() {
    return this.integration;
  }

  // EXTERNAL API
  public async getCoinPrice() {
    this.checkActiveStatus();

    const params = {
      module: ScrollBlockScoutApiModules.Stats,
      action: ScrollBlockScoutApiActions.CoinPrice,
    };
    const route = `?${this.convertParams(params)}`;

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TScrollBlockScoutCoinPriceResponse>(this.apiUrl, { params }),
      );

      return data;
    } catch (error) {
      throw this.handleErrorResponse(route, error);
    }
  }

  public async getTotalFees(date: string = dayjs().format('YYYY-MM-DD')) {
    this.checkActiveStatus();

    const params = {
      module: ScrollBlockScoutApiModules.Stats,
      action: ScrollBlockScoutApiActions.TotalFees,
      date: date,
    };
    const route = `?${this.convertParams(params)}`;

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TScrollBlockScoutTotalFeesResponse>(this.apiUrl, { params }),
      );

      return data;
    } catch (error) {
      throw this.handleErrorResponse(route, error);
    }
  }
}

/**
 *  1. balance
 *    ?module=account&action=balance&address={addressHash}
 *  2. balanceMulti
 *    ?module=account&action=balancemulti&address={addressHash1,addressHash2,addressHash3}
 *  3. transactions
 *    ?module=account&action=txlist&address={addressHash}
 *  4. token balance
 *    ?module=account&action=tokenbalance&contractaddress={contractAddressHash}&address={addressHash}
 * */