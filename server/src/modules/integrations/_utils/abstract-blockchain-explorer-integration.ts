import * as Web3Utils from 'web3-utils';
import { IntegrationDocument } from '@schemas/integration';
import { HttpException, HttpStatus, Logger, OnModuleInit } from '@nestjs/common';
import { ITransactionsStat } from '@common/integrations/common';

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

  // PUBLIC
  public getIntegrationRecord() {
    return this.integration;
  }

  public convertAddressBalance(weiBalance: string, unit: Web3Utils.EtherUnits) {
    return Web3Utils.fromWei(weiBalance, unit);
  }
}
