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
  TZkSyncBlockExplorerAccountTransactionsResponse,
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

  private getRouteFromParams(module: string, action: string) {
    return `(module=${module} -> action=${action})`;
  }

  private convertParams(params: Record<string, string | number>) {
    return Object.entries(params)
      .map(([key, value]) => `${key}=${value}`)
      .join('&');
  }

  private handleErrorResponse(
    route: string,
    params: Record<string, string | number>,
    error: Error | AxiosError,
  ) {
    const message = `Error during execution "${route}" of Integration - "${this.INTEGRATION_KEY}"`;

    if (error instanceof AxiosError) {
      const { response } = error;

      if (!response) {
        this.logger.error(message, { error, params });
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

    this.logger.error(message, { error, params });
    return error;
  }

  private validateResponse(
    route: string,
    params: Record<string, string | number>,
    data: IZkSyncBlockExplorerGenericResponse<unknown>,
  ) {
    /**
     *  {
     *   "message": "Invalid address hash",
     *   "result": null,
     *   "status": "0"
     * }
     * */

    if ('status' in data && data.status === '0') {
      const message = `Error during execution "${route}" of Integration - "${this.INTEGRATION_KEY}" with massage "${data.message}"`;

      this.logger.error(message, { response: data, params: params });
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

    const module = ZkSyncBlockExplorerApiModules.Stats;
    const action = ZkSyncBlockExplorerApiActions.EthPrice;

    const params = {
      module,
      action,
    };
    const route = this.getRouteFromParams(module, action);

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        params,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TZkSyncBlockExplorerEthPriceResponse>(this.apiUrl, { params }),
      );

      return data;
    } catch (error) {
      throw this.handleErrorResponse(route, params, error);
    }
  }

  public async getAddressBalance(addressHash: string) {
    this.checkActiveStatus();

    const module = ZkSyncBlockExplorerApiModules.Account;
    const action = ZkSyncBlockExplorerApiActions.Balance;

    const params = {
      module,
      action,
      address: addressHash,
    };
    const route = this.getRouteFromParams(module, action);

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        params,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TZkSyncBlockExplorerAccountBalanceResponse>(this.apiUrl, { params }),
      );
      this.validateResponse(route, params, data);

      return {
        balance: data.result,
      };
    } catch (error) {
      throw this.handleErrorResponse(route, params, error);
    }
  }

  public async getMultiAddressBalances(addressHashes: string[]) {
    this.checkActiveStatus();

    const module = ZkSyncBlockExplorerApiModules.Account;
    const action = ZkSyncBlockExplorerApiActions.BalanceMulti;

    const params = {
      module,
      action,
      address: addressHashes.join(','),
    };
    const route = this.getRouteFromParams(module, action);

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        params,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TZkSyncBlockExplorerMultiAccountBalanceResponse>(this.apiUrl, { params }),
      );
      this.validateResponse(route, params, data);

      return data.result;
    } catch (error) {
      throw this.handleErrorResponse(route, params, error);
    }
  }

  public async getTokenBalance(addressHash: string, contractHash: string) {
    this.checkActiveStatus();

    const module = ZkSyncBlockExplorerApiModules.Account;
    const action = ZkSyncBlockExplorerApiActions.TokenBalance;

    const params = {
      module,
      action,
      address: addressHash,
      contractaddress: contractHash,
    };
    const route = this.getRouteFromParams(module, action);

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        params,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TZkSyncBlockExplorerTokenBalanceResponse>(this.apiUrl, { params }),
      );
      this.validateResponse(route, params, data);

      return {
        balance: data.result,
      };
    } catch (error) {
      throw this.handleErrorResponse(route, params, error);
    }
  }

  public async getAddressTransactions(addressHash: string) {
    this.checkActiveStatus();

    const module = ZkSyncBlockExplorerApiModules.Account;
    const action = ZkSyncBlockExplorerApiActions.TXList;

    const params = {
      module,
      action,
      address: addressHash,
      page: 1,
      offset: 1000,
      /**
       *   A nonnegative integer that represents
       *   the maximum number of records to return when paginating. 'page' must be provided in conjunction.
       * */
    };
    const route = this.getRouteFromParams(module, action);

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        params,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TZkSyncBlockExplorerAccountTransactionsResponse>(this.apiUrl, { params }),
      );
      if (data.result.length === 0) {
        return data.result;
      }

      this.validateResponse(route, params, data);

      return data.result;
    } catch (error) {
      throw this.handleErrorResponse(route, params, error);
    }
  }
}
