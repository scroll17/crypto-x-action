import * as Web3Utils from 'web3-utils';
import { IntegrationDocument } from '@schemas/integration';
import { HttpException, HttpStatus, Logger, OnModuleInit } from '@nestjs/common';
import { IBlockchainExplorerAddressReport, ITransactionsStat } from '@common/integrations/common';

export abstract class AbstractBlockchainExplorerIntegration implements OnModuleInit {
  protected readonly INTEGRATION_KEY: string;
  protected readonly logger: Logger;

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

  // public abstract getAddressReport(addressHash: string, ethPrice: number): Promise<IBlockchainAddressReport>;
  /**
   *  1. load balance
   *  2. get tokens (we omit it)
   *  3. build transactions report
   *  4. total:
   *   - balance + ethBalance
   *   - fee + usdFee
   *   - gas + usdGas
   *
   *  Output:
   *    1. wallet
   *    2. eth (+usd)
   *    3. tx count
   *    4. volume (+usd)
   *    4. gas used
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

  // PUBLIC
  public getIntegrationRecord() {
    return this.integration;
  }

  public convertAddressBalance(weiBalance: string, unit: Web3Utils.EtherUnits) {
    return Web3Utils.fromWei(weiBalance, unit);
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
}
