import * as Web3Utils from 'web3-utils';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { IntegrationNames } from '@common/integrations/common';
import { Integration, IntegrationDocument, IntegrationModel } from '@schemas/integration';
import {
  IZkSyncBlockExplorerGenericResponse,
  TZkSyncBlockExplorerAccountBalanceResponse,
  TZkSyncBlockExplorerEthPriceResponse,
  TZkSyncBlockExplorerMultiAccountBalanceResponse,
  TZkSyncBlockExplorerTokenBalanceResponse,
  ZkSyncBlockExplorerApiActions,
  ZkSyncBlockExplorerApiModules,
} from '@common/integrations/zk-sync-block-explorer';

@Injectable()
export class ZkSyncBlockExplorerService implements OnModuleInit {
  private readonly INTEGRATION_KEY = IntegrationNames.ZkSyncBlockExplorer;

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

    // TODO
    const address = '0xc1d0c82d463758839ab8adb6e2a976561cae3992';
    const result = await this.getTokenBalance(address, '0x80115c708e12edd42e504c1cd52aea96c547c05c');
    console.log('result =>', result);

    if (this.integration.active) {
      await this.initConnection();
    }
  }

  private async initConnection() {
    this.logger.debug(`Ping the "${this.INTEGRATION_KEY}" Integration server`);

    const result = await this.getEthPrice();

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

  private convertParams(params: Record<string, string | number>) {
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

  private validateResponse(route: string, data: IZkSyncBlockExplorerGenericResponse<unknown>) {
    /**
     *  {
     *   "message": "Invalid address hash",
     *   "result": null,
     *   "status": "0"
     * }
     * */

    if ('status' in data && data.status === '0') {
      const message = `Error during execution "${route}" of Integration - "${this.INTEGRATION_KEY}" with massage "${data.message}"`;

      this.logger.error(message, { ...data });
      throw new HttpException(message, HttpStatus.BAD_REQUEST);
    }

    return;
  }

  // INTERNAL API
  public getIntegrationRecord() {
    return this.integration;
  }

  public convertAddressBalance(weiBalance: string, unit: Web3Utils.EtherUnits) {
    return Web3Utils.fromWei(weiBalance, unit);
  }

  // EXTERNAL API
  public async getEthPrice() {
    this.checkActiveStatus();

    const params = {
      module: ZkSyncBlockExplorerApiModules.Stats,
      action: ZkSyncBlockExplorerApiActions.EthPrice,
    };
    const route = `?${this.convertParams(params)}`;

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TZkSyncBlockExplorerEthPriceResponse>(this.apiUrl, { params }),
      );

      return data;
    } catch (error) {
      throw this.handleErrorResponse(route, error);
    }
  }

  public async getAddressBalance(addressHash: string) {
    this.checkActiveStatus();

    const params = {
      module: ZkSyncBlockExplorerApiModules.Account,
      action: ZkSyncBlockExplorerApiActions.Balance,
      address: addressHash,
    };
    const route = `?${this.convertParams(params)}`;

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TZkSyncBlockExplorerAccountBalanceResponse>(this.apiUrl, { params }),
      );
      this.validateResponse(route, data);

      return {
        balance: data.result,
      };
    } catch (error) {
      throw this.handleErrorResponse(route, error);
    }
  }

  public async getMultiAddressBalances(addressHashes: string[]) {
    this.checkActiveStatus();

    const params = {
      module: ZkSyncBlockExplorerApiModules.Account,
      action: ZkSyncBlockExplorerApiActions.BalanceMulti,
      address: addressHashes.join(','),
    };
    const route = `?${this.convertParams(params)}`;

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TZkSyncBlockExplorerMultiAccountBalanceResponse>(this.apiUrl, { params }),
      );
      this.validateResponse(route, data);

      return data.result;
    } catch (error) {
      throw this.handleErrorResponse(route, error);
    }
  }

  public async getTokenBalance(addressHash: string, contractHash: string) {
    this.checkActiveStatus();

    const params = {
      module: ZkSyncBlockExplorerApiModules.Account,
      action: ZkSyncBlockExplorerApiActions.TokenBalance,
      address: addressHash,
      contractaddress: contractHash,
    };
    const route = `?${this.convertParams(params)}`;

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TZkSyncBlockExplorerTokenBalanceResponse>(this.apiUrl, { params }),
      );
      this.validateResponse(route, data);

      return {
        balance: data.result,
      };
    } catch (error) {
      throw this.handleErrorResponse(route, error);
    }
  }
}

/**
 * +1. /api?module=account&action=txlist
 * ++2. /api?module=account&action=balance
 * ++3. /api?module=account&action=balancemulti
 * +4. /api?module=account&action=tokenbalance
 * ++5. /api?module=stats&action=ethprice
 * */
