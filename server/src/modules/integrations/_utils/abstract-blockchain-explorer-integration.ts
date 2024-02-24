import _ from 'lodash';
import * as Web3Utils from 'web3-utils';
import { IntegrationDocument } from '@schemas/integration';
import { HttpException, HttpStatus, Logger, OnModuleInit } from '@nestjs/common';
import {
  IBlockchainExplorerAddressReport,
  IBlockchainExplorerMultipleAddressesReport,
  ITransactionsStat,
} from '@common/integrations/common';

export abstract class AbstractBlockchainExplorerIntegration implements OnModuleInit {
  protected readonly INTEGRATION_KEY: string;
  protected readonly logger: Logger;

  protected readonly DEFAULT_BATCH_SIZE = 35;
  protected readonly DEFAULT_SLEEP_AFTER_BATCH_LOAD = 2500;

  protected apiUrl: string;
  protected integration: IntegrationDocument;

  // INNER
  protected checkActiveStatus() {
    if (!this.integration.active) {
      throw new HttpException(`Integration "${this.INTEGRATION_KEY}" is not active`, HttpStatus.BAD_REQUEST);
    }
  }

  // ABSTRACT
  protected abstract initConnection(): Promise<void>;

  public abstract onModuleInit(): unknown;

  public abstract buildTransactionsStat(
    addressHash: string,
    transactions: unknown[],
    ethPrice?: number,
  ): ITransactionsStat;

  public abstract getTransactionsStat(addressHash: string, ethPrice: number): Promise<ITransactionsStat>;

  public abstract getAddressReport(
    addressHash: string,
    ethPrice: number,
  ): Promise<IBlockchainExplorerAddressReport>;
  /**
   *  1. load balance
   *  2. get tokens (we omit it)
   *  3. build transactions report
   *
   *  Output:
   *    1. wallet
   *    2. eth (+usd)
   *    3. tx count
   *    4. volume (+usd)
   *    4. gasUsed
   *    5. d contracts
   *    5. u contracts
   *    6. u days
   *    7. u weeks
   *    8. u months
   *    9. first tx
   *    10. last tx
   *    11. total fee (+usd)
   *    11. total gasPrice (+usd)
   * */

  public abstract getMultipleAddressesReport(
    addressHashes: string[],
    ethPrice: number,
  ): Promise<IBlockchainExplorerMultipleAddressesReport>;
  /**
   *  1. reports[]
   *  2. total:
   *   - balance + ethBalance
   *   - fee + usdFee
   *   - gasPrice + usdGasPrice
   * */

  // PUBLIC
  public async sleep(time: number) {
    return new Promise((r) => setTimeout(r, time));
  }

  public getIntegrationRecord() {
    return this.integration;
  }

  public convertAddressBalance(weiBalance: string, unit: Web3Utils.EtherUnits) {
    return Web3Utils.fromWei(weiBalance, unit);
  }

  public async batchLoader<TData>(loaders: Array<() => Promise<TData>>, batchSize: number, sleep: number) {
    const results: TData[] = [];
    const parts = _.chunk(loaders, batchSize);

    let partIndex = 1;
    for (const part of parts) {
      const result = await Promise.allSettled(part.map((i) => i()));

      const successfulLoadedResults = result
        .filter((r) => r.status === 'fulfilled')
        .map((r) => _.get(r, 'value') as TData)
        .filter(Boolean);
      results.push(...successfulLoadedResults);

      this.logger.debug('Loaded batch', {
        partIndex: partIndex++,
        partSize: part.length,
        parts: parts.length,
        successfulLoaded: successfulLoadedResults.length,
        sleep: `${Math.floor(sleep / 1000)}s`,
      });
      await this.sleep(sleep);
    }

    return results;
  }

  public buildAddressReport({
    addressHash,
    ethPrice,
    ethBalance,
    transactionsStat,
  }: {
    addressHash: string;
    ethPrice: number;
    ethBalance: string;
    transactionsStat: ITransactionsStat;
  }): IBlockchainExplorerAddressReport {
    const { total: transactionsTotal, unique: transactionsUniques } = transactionsStat;

    return {
      address: addressHash,
      eth: [ethBalance, Number.parseFloat(ethBalance) * ethPrice],
      txCount: transactionsStat.txCount,
      volume: [this.convertAddressBalance(transactionsTotal.volume, 'ether'), transactionsTotal.USDVolume],
      gasUsed: this.convertAddressBalance(transactionsTotal.gasUsed, 'ether'),
      dContracts: transactionsStat.deployedContracts.length,
      uContracts: transactionsUniques.contracts.length,
      uDays: transactionsUniques.days.length,
      uWeeks: transactionsUniques.weeks.length,
      uMonths: transactionsUniques.months.length,
      firstTxDate: transactionsStat.firstTxDate,
      lastTxDate: transactionsStat.lastTxDate,
      totalFee: [this.convertAddressBalance(transactionsTotal.fee, 'ether'), transactionsTotal.USDFee],
      totalGasPrice: [
        this.convertAddressBalance(transactionsTotal.gasPrice, 'ether'),
        transactionsTotal.USDGasPrice,
      ],
    };
  }

  public buildMultipleAddressesReport(
    reports: IBlockchainExplorerAddressReport[],
  ): IBlockchainExplorerMultipleAddressesReport {
    const totalEth: [number, number] = [0, 0];
    const totalVolume: [number, number] = [0, 0];
    const totalFee: [number, number] = [0, 0];
    const totalGasPrice: [number, number] = [0, 0];

    reports.forEach((report) => {
      totalEth[0] += Number.parseFloat(report.eth[0]);
      totalEth[1] += report.eth[1];

      totalVolume[0] += Number.parseFloat(report.volume[0]);
      totalVolume[1] += report.volume[1];

      totalFee[0] += Number.parseFloat(report.totalFee[0]);
      totalFee[1] += report.totalFee[1];

      totalGasPrice[0] += Number.parseFloat(report.totalGasPrice[0]);
      totalGasPrice[1] += report.totalGasPrice[1];
    });

    return {
      reports,
      totalEth,
      totalVolume,
      totalFee,
      totalGasPrice,
    };
  }
}
