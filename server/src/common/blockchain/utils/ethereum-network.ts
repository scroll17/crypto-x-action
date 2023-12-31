import { Injectable, Logger } from '@nestjs/common';
import { HttpProvider, Web3 } from 'web3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EthereumNetwork {
  private readonly logger = new Logger(this.constructor.name);

  private readonly web3: Web3;

  constructor(private readonly configService: ConfigService) {
    const provider = new HttpProvider('');
    this.web3 = new Web3(provider);
  }

  public getWeb3() {
    return this.web3;
  }

  public async getLatestBlock() {}

  public async generateAccount() {
    const account = this.web3.eth.accounts.create();

    // TODO: notify in Telegram private info

    return account.address;
  }

  public async generateFromPrivateKey(key: string) {
    const account = this.web3.eth.accounts.privateKeyToAccount(key);

    // TODO: notify in Telegram private info

    return account.address;
  }

  public async deployAccount() {}
}
