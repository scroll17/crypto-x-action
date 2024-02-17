import dayjs from 'dayjs';
import * as Web3Utils from 'web3-utils';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { IntegrationNames } from '@common/integrations/common';
import { Integration, IntegrationDocument, IntegrationModel } from '@schemas/integration';
import {
  ILineaExplorerAccountTransactionsData,
  ILineaExplorerGenericResponse,
  LineaExplorerApiActions,
  LineaExplorerApiModules,
  TLineaExplorerAccountBalanceResponse,
  TLineaExplorerAccountTransactionsResponse,
  TLineaExplorerCoinPriceResponse,
  TLineaExplorerMultiAccountBalanceResponse,
  TLineaExplorerTokenBalanceResponse,
  TLineaExplorerTotalFeesResponse,
} from '@common/integrations/linea-explorer';
import { ITransactionsStat } from '@common/integrations/common/types/transactions-stat.interface';

@Injectable()
export class LineaExplorerService implements OnModuleInit {
  private readonly INTEGRATION_KEY = IntegrationNames.LineaExplorer;

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

  private validateResponse(route: string, data: ILineaExplorerGenericResponse<unknown>) {
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

  public buildTransactionsStat(
    addressHash: string,
    transactions: ILineaExplorerAccountTransactionsData[],
    exchangeRate: number,
  ) {
    const successfulTransactions = transactions.filter((t) => {
      const isSendByAddress = t.from.toLowerCase() === addressHash.toLowerCase();
      const isReceipted = t.txreceipt_status === '1';
      const hastError = t.isError === '0';

      return isSendByAddress && isReceipted && hastError;
    });

    const sortedTransactions = successfulTransactions.sort((a, b) => {
      const time1 = new Date(Number.parseInt(a.timeStamp) * 1000).valueOf();
      const time2 = new Date(Number.parseInt(b.timeStamp) * 1000).valueOf();

      return time1 - time2;
    });
    const firstTransaction: ILineaExplorerAccountTransactionsData | undefined = sortedTransactions.at(0);
    const lastTransaction: ILineaExplorerAccountTransactionsData | undefined = sortedTransactions.at(-1);

    const uniqueDays = new Set<string>();
    const uniqueWeeks = new Set<string>();
    const uniqueMonths = new Set<string>();
    const uniqueContracts = new Set<string>();
    const deployedContracts = new Set<string>();

    const transactionDayMap = new Map<string, string>();

    let totalFee: bigint = BigInt(0);
    let totalUSDFee: number = 0;
    let totalVolume: bigint = BigInt(0);
    let totalUSDVolume: number = 0;
    let totalGasUsed: bigint = BigInt(0);
    let totalGasPrice: bigint = BigInt(0);
    let totalUSDGasPrice: number = 0;

    successfulTransactions.forEach((tx) => {
      // dates
      const date = new Date(Number.parseInt(tx.timeStamp) * 1000);
      uniqueDays.add(date.toDateString());
      uniqueWeeks.add(date.getFullYear() + '-' + dayjs(date).isoWeek());
      uniqueMonths.add(date.getFullYear() + '-' + date.getMonth());

      transactionDayMap.set(tx.hash, date.toUTCString());

      // recipients
      if (tx.to) {
        uniqueContracts.add(tx.to);
      }
      if (tx.contractAddress) {
        deployedContracts.add(tx.contractAddress);
      }

      // value (money)
      totalFee += BigInt(0);
      totalUSDFee += 0;

      totalVolume += BigInt(tx.value);
      totalUSDVolume += Number.parseFloat(Web3Utils.fromWei(tx.value, 'ether')) * exchangeRate;

      const transactionTotalGasPrice = BigInt(tx.gasUsed) * BigInt(tx.gasPrice);

      totalGasUsed += BigInt(tx.gasUsed);
      totalGasPrice += transactionTotalGasPrice;
      totalUSDGasPrice +=
        Number.parseFloat(Web3Utils.fromWei(transactionTotalGasPrice, 'ether')) * exchangeRate;
    });

    const stat: ITransactionsStat = {
      txCount: successfulTransactions.length,
      txDayMap: [...transactionDayMap.entries()],
      firstTxDate: firstTransaction ? new Date(Number.parseInt(firstTransaction.timeStamp) * 1000) : null,
      lastTxDate: lastTransaction ? new Date(Number.parseInt(lastTransaction.timeStamp) * 1000) : null,
      unique: {
        days: [...uniqueDays],
        weeks: [...uniqueWeeks],
        months: [...uniqueMonths],
        contracts: [...uniqueContracts],
      },
      deployedContracts: [...deployedContracts],
      total: {
        fee: totalFee.toString(),
        USDFee: totalUSDFee,
        volume: totalVolume.toString(),
        USDVolume: totalUSDVolume,
        gasUsed: totalGasUsed.toString(),
        gasPrice: totalGasPrice.toString(),
        USDGasPrice: totalUSDGasPrice,
      },
    };

    return stat;
  }

  // EXTERNAL API
  public async getCoinPrice() {
    this.checkActiveStatus();

    const params = {
      module: LineaExplorerApiModules.Stats,
      action: LineaExplorerApiActions.CoinPrice,
    };
    const route = `?${this.convertParams(params)}`;

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TLineaExplorerCoinPriceResponse>(this.apiUrl, { params }),
      );

      return data;
    } catch (error) {
      throw this.handleErrorResponse(route, error);
    }
  }

  public async getTotalFees(date: string = dayjs().format('YYYY-MM-DD')) {
    this.checkActiveStatus();

    const params = {
      module: LineaExplorerApiModules.Stats,
      action: LineaExplorerApiActions.TotalFees,
      date: date,
    };
    const route = `?${this.convertParams(params)}`;

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TLineaExplorerTotalFeesResponse>(this.apiUrl, { params }),
      );
      this.validateResponse(route, data);

      return data.result;
    } catch (error) {
      throw this.handleErrorResponse(route, error);
    }
  }

  public async getAddressBalance(addressHash: string) {
    this.checkActiveStatus();

    const params = {
      module: LineaExplorerApiModules.Account,
      action: LineaExplorerApiActions.Balance,
      address: addressHash,
    };
    const route = `?${this.convertParams(params)}`;

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TLineaExplorerAccountBalanceResponse>(this.apiUrl, { params }),
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
      module: LineaExplorerApiModules.Account,
      action: LineaExplorerApiActions.BalanceMulti,
      address: addressHashes.join(','),
    };
    const route = `?${this.convertParams(params)}`;

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TLineaExplorerMultiAccountBalanceResponse>(this.apiUrl, { params }),
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
      module: LineaExplorerApiModules.Account,
      action: LineaExplorerApiActions.TokenBalance,
      address: addressHash,
      contractaddress: contractHash,
    };
    const route = `?${this.convertParams(params)}`;

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TLineaExplorerTokenBalanceResponse>(this.apiUrl, { params }),
      );
      this.validateResponse(route, data);

      return {
        balance: data.result,
      };
    } catch (error) {
      throw this.handleErrorResponse(route, error);
    }
  }

  public async getAddressTransactions(addressHash: string) {
    this.checkActiveStatus();

    const params = {
      module: LineaExplorerApiModules.Account,
      action: LineaExplorerApiActions.TXList,
      address: addressHash,
      page: 1,
      offset: 1000,
      /**
       *   A nonnegative integer that represents
       *   the maximum number of records to return when paginating. 'page' must be provided in conjunction.
       * */
    };
    const route = `?${this.convertParams(params)}`;

    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TLineaExplorerAccountTransactionsResponse>(this.apiUrl, { params }),
      );
      if (data.result.length === 0) {
        return data.result;
      }

      this.validateResponse(route, data);

      return data.result;
    } catch (error) {
      throw this.handleErrorResponse(route, error);
    }
  }

  public async getTransactionsStat(addressHash: string, ethPrice: number) {
    const transactions = await this.getAddressTransactions(addressHash);
    return this.buildTransactionsStat(addressHash, transactions, ethPrice);
  }
}
