import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import * as Web3Utils from 'web3-utils';
import { AxiosError } from 'axios';
import { firstValueFrom } from 'rxjs';
import { HttpException, HttpStatus, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectModel } from '@nestjs/mongoose';
import { IntegrationNames } from '@common/integrations/common';
import { Integration, IntegrationDocument, IntegrationModel } from '@schemas/integration';
import {
  BaseBlockScoutApiRoutes,
  IBaseBlockScoutTransaction,
  IBaseBlockScoutTransactionsPaginate,
  IBaseBlockScoutWalletAddressData,
  TBaseBlockScoutAddressResponse,
  TBaseBlockScoutStatsResponse,
  TBaseBlockScoutTokenBalancesResponse,
  TBaseBlockScoutTransactionsResponse,
} from '@common/integrations/base-block-scout';
import { ITransactionsStat } from '@common/integrations/common/types/transactions-stat.interface';

dayjs.extend(isoWeek);

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
      await this.initConnection();
    }
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

  public getAddressBalance(
    address: Pick<IBaseBlockScoutWalletAddressData, 'coin_balance'>,
    unit: Web3Utils.EtherUnits,
  ) {
    return Web3Utils.fromWei(address.coin_balance, unit);
  }

  public buildTransactionsStat(addressHash: string, transactions: IBaseBlockScoutTransaction[]) {
    const successfulTransactions = transactions.filter((t) => {
      const isSendByAddress = t.from.hash.toLowerCase() === addressHash.toLowerCase();
      const isSuccessful = t.result === 'success';

      return isSendByAddress && isSuccessful;
    });

    const sortedTransactions = successfulTransactions.sort(
      (a, b) => new Date(a.timestamp).valueOf() - new Date(b.timestamp).valueOf(),
    );
    const firstTransaction: IBaseBlockScoutTransaction | undefined = sortedTransactions.at(0);
    const lastTransaction: IBaseBlockScoutTransaction | undefined = sortedTransactions.at(-1);

    const uniqueDays = new Set<string>();
    const uniqueWeeks = new Set<string>();
    const uniqueMonths = new Set<string>();
    const uniqueContracts = new Set<string>();

    const transactionDayMap = new Map<string, string>();

    let totalFee: bigint = BigInt(0);
    let totalUSDFee: number = 0;
    let totalVolume: bigint = BigInt(0);
    let totalUSDVolume: number = 0;
    let totalGasUsed: bigint = BigInt(0);

    successfulTransactions.forEach((tx) => {
      // dates
      const date = new Date(tx.timestamp);
      uniqueDays.add(date.toDateString());
      uniqueWeeks.add(date.getFullYear() + '-' + dayjs(date).isoWeek());
      uniqueMonths.add(date.getFullYear() + '-' + date.getMonth());

      transactionDayMap.set(tx.hash, date.toUTCString());

      // recipients
      if (tx.to) {
        uniqueContracts.add(tx.to.hash);
      }

      // value (money)
      const exchangeRate = Number.parseInt(tx.exchange_rate);

      totalFee += BigInt(tx.fee.value);
      totalUSDFee += Number.parseFloat(Web3Utils.fromWei(tx.fee.value, 'ether')) * exchangeRate;

      totalVolume += BigInt(tx.value);
      totalUSDVolume += Number.parseFloat(Web3Utils.fromWei(tx.value, 'ether')) * exchangeRate;

      totalGasUsed += BigInt(tx.gas_used);
    });

    const stat: ITransactionsStat = {
      txCount: successfulTransactions.length,
      txDayMap: [...transactionDayMap.entries()],
      firstTxDate: firstTransaction ? new Date(firstTransaction.timestamp) : null,
      lastTxDate: lastTransaction ? new Date(lastTransaction.timestamp) : null,
      unique: {
        days: [...uniqueDays],
        weeks: [...uniqueWeeks],
        months: [...uniqueMonths],
        contracts: [...uniqueContracts],
      },
      total: {
        fee: totalFee.toString(),
        USDFee: totalUSDFee,
        volume: totalVolume.toString(),
        USDVolume: totalUSDVolume,
        gasUsed: totalGasUsed.toString(),
      },
    };

    return stat;
  }

  // EXTERNAL API
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
      throw this.handleErrorResponse(route, error);
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
      throw this.handleErrorResponse(route, error);
    }
  }

  public async getAddressTokenBalances(addressHash: string) {
    this.checkActiveStatus();
    const route = `${BaseBlockScoutApiRoutes.Addresses}/${addressHash}${BaseBlockScoutApiRoutes.TokenBalances}`;

    const url = `${this.apiUrl}${route}`;
    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TBaseBlockScoutTokenBalancesResponse[]>(url),
      );

      return data;
    } catch (error) {
      throw this.handleErrorResponse(route, error);
    }
  }

  public async getAddressTransactions(
    addressHash: string,
    params: IBaseBlockScoutTransactionsPaginate | null = null,
  ) {
    this.checkActiveStatus();
    const route = `${BaseBlockScoutApiRoutes.Addresses}/${addressHash}${BaseBlockScoutApiRoutes.Transactions}`;

    const url = `${this.apiUrl}${route}`;
    try {
      this.logger.debug(`Request to "${route}" endpoint`, {
        endpoint: route,
      });

      const { data } = await firstValueFrom(
        this.httpService.get<TBaseBlockScoutTransactionsResponse>(url, {
          params: params ?? {},
        }),
      );

      return data;
    } catch (error) {
      throw this.handleErrorResponse(route, error);
    }
  }

  public async getAllAddressTransactions(addressHash: string) {
    let nextParams: IBaseBlockScoutTransactionsPaginate | null = null;

    const transactions: IBaseBlockScoutTransaction[] = [];
    while (true) {
      try {
        const result = await this.getAddressTransactions(addressHash, nextParams);
        transactions.push(...result.items);

        if (result.next_page_params === null) {
          break;
        }

        nextParams = result.next_page_params as IBaseBlockScoutTransactionsPaginate;
      } catch (error: unknown) {
        this.logger.error('Error during load all transactions', { error });
        break;
      }
    }

    return transactions;
  }

  public async getTransactionsStat(addressHash: string) {
    const transactions = await this.getAllAddressTransactions(addressHash);
    return this.buildTransactionsStat(addressHash, transactions);
  }
}
