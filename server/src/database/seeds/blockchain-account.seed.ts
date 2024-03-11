import _ from 'lodash';
import { Command } from 'nestjs-command';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ConfigService } from '@nestjs/config';
import { BlockchainNetwork, BlockchainNetworkModel } from 'src/database/schemas/blockcain/network';
import { IBlockchainAccountEnvConfig } from '@common/blockchain/types/env-config';
import { BlockchainAccount, BlockchainAccountModel } from '@schemas/blockcain/account';
import { User, UserModel } from '@schemas/user';

@Injectable()
export class BlockchainAccountSeed {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private configService: ConfigService,
    @InjectModel(BlockchainAccount.name) private blockchainAccountModel: BlockchainAccountModel,
    @InjectModel(BlockchainNetwork.name) private blockchainNetworkModel: BlockchainNetworkModel,
    @InjectModel(User.name) private userModel: UserModel,
  ) {}

  @Command({ command: 'create:blockchain-accounts', describe: 'create blockchain accounts' })
  async createBulk() {
    const accounts = this.configService.getOrThrow<IBlockchainAccountEnvConfig[]>('blockchainAccounts');
    const accountsKeys = accounts.map((v) => v.name);

    this.logger.debug('Generating bulk of Blockchain accounts', {
      accounts: accountsKeys,
    });

    const admin = await this.userModel.findOne({ isAdmin: true }).exec();
    if (!admin) {
      throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
    }

    for (const account of accounts) {
      let dbAccount = await this.blockchainAccountModel
        .findOne({
          name: account.name,
        })
        .exec();
      if (dbAccount) {
        this.logger.verbose('Blockchain account already exists', {
          id: dbAccount._id,
          name: dbAccount.name,
        });

        continue;
      }

      const network = await this.blockchainNetworkModel
        .findOne({
          innerKey: account.network,
        })
        .exec();
      if (!network) {
        throw new HttpException(`Network "${account.network}" not found`, HttpStatus.NOT_FOUND);
      }

      this.logger.debug('Creating Blockchain account with data', {
        name: account.name,
      });

      dbAccount = await this.blockchainAccountModel.create({
        name: account.name,
        labels: account.labels,
        address: account.address,
        network: network._id,
        comments: account.comments,
        createdBy: admin._id,
        _private: undefined, // TODO
        removedAt: null,
      });

      this.logger.verbose('Created Blockchain account', {
        id: dbAccount._id,
        name: dbAccount.name,
      });
    }

    await this.markAsRemoved(accountsKeys);
  }

  async markAsRemoved(accountsKeys: string[]) {
    const allAccountsInDB = await this.blockchainAccountModel.find().exec();
    const allAccountsInDBMap = new Map(allAccountsInDB.map((account) => [account.name, account]));

    const removedAccountKeys = _.difference([...allAccountsInDBMap.keys()], accountsKeys);
    this.logger.debug('Mark as deleted Blockchain accounts', {
      removedAccounts: removedAccountKeys,
    });

    await Promise.all(
      removedAccountKeys.map(async (removedKey) => {
        this.logger.verbose('Mark as removed Blockchain account', {
          name: removedKey,
        });

        await this.blockchainAccountModel.updateOne(
          {
            name: removedKey,
          },
          {
            $set: {
              removedAt: new Date(),
            },
          },
        );
      }),
    );
  }
}
