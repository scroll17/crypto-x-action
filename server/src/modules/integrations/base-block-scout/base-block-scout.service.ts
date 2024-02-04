import { firstValueFrom } from 'rxjs';
import * as Web3Utils from 'web3-utils';
import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { IntegrationNames } from '@common/integrations/common';
import { Integration, IntegrationDocument, IntegrationModel } from '@schemas/integration';
import {
  BaseBlockScoutApiRoutes,
  IBaseBlockScoutWalletAddressData,
  TBaseBlockScoutAddressResponse,
  TBaseBlockScoutStatsResponse,
} from '@common/integrations/base-block-scout';

@Injectable()
export class BaseBlockScoutService implements OnModuleInit {
  private readonly INTEGRATION_KEY = IntegrationNames.BaseBlockScout;

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
      // await this.initConnection();
      // TODO
    }

    const hash = '0xcdad2088693213eaa880f2b221c3c8e881655f27DDDDD';
    const address = await this.getAddress(hash);
    console.log('address =>', address);
    const balance = this.getAddressBalance(address, 'ether');
    console.log('balance =>', balance);
  }

  private async initConnection() {
    this.logger.debug(`Ping the "${this.INTEGRATION_KEY}" Integration server`);

    const result = await this.getStats();

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

  public getAddressBalance(
    address: Pick<IBaseBlockScoutWalletAddressData, 'coin_balance'>,
    unit: Web3Utils.EtherUnits,
  ) {
    return Web3Utils.fromWei(address.coin_balance, unit);
  }

  // API
  public async getStats() {
    this.checkActiveStatus();
    const route = BaseBlockScoutApiRoutes.Stats;

    const url = `${this.apiUrl}${route}`;
    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(this.httpService.get<TBaseBlockScoutStatsResponse>(url));

      return data;
    } catch (error) {
      this.logger.error(`Request to "${route}" error: `, { error });
      throw error;
    }
  }

  public async getAddress(addressHash: string) {
    this.checkActiveStatus();
    const route = BaseBlockScoutApiRoutes.Addresses;

    const url = `${this.apiUrl}${route}/${addressHash}`;
    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(this.httpService.get<TBaseBlockScoutAddressResponse>(url));

      return data;
    } catch (error) {
      console.log('error =>', error);

      this.logger.error(`Request to "${route}" error: `, { error });
      throw error;
    }
  }
}
