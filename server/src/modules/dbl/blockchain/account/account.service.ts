import * as _ from 'lodash';
import { Types } from 'mongoose';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UserDocument } from '@schemas/user';
import { InjectModel } from '@nestjs/mongoose';
import {
  BlockchainAccount,
  BlockchainAccountDocument,
  BlockchainAccountEntity,
  BlockchainAccountModel,
} from '@schemas/blockcain/account';
import { BlockchainNetwork, BlockchainNetworkModel } from '@schemas/blockcain/network';
import { CreateBlockchainAccountDto, FindBlockchainAccountDto } from './dto';
import { PaginateResultEntity } from '@common/entities';

@Injectable()
export class BlockchainAccountService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(BlockchainAccount.name) private readonly blockchainAccountModel: BlockchainAccountModel,
    @InjectModel(BlockchainNetwork.name) private readonly blockchainNetworkModel: BlockchainNetworkModel,
  ) {}

  public async add(user: UserDocument, dto: CreateBlockchainAccountDto) {
    this.logger.debug('Create new Blockchain Account', {
      admin: _.pick(user, ['_id', 'email']),
      account: dto,
    });

    const networksCount = await this.blockchainNetworkModel.count({ _id: dto.network });
    if (networksCount === 0) {
      throw new HttpException('Network not found', HttpStatus.NOT_FOUND);
    }

    const newAccount = await this.blockchainAccountModel.create({
      ...dto,
      comments: [],
      createdBy: user._id,
    });

    this.logger.debug('Created new Blockchain Account record', {
      name: newAccount.name,
      labels: newAccount.labels,
    });

    return newAccount;
  }

  public async getAll(dto: FindBlockchainAccountDto): Promise<PaginateResultEntity<BlockchainAccountEntity>> {
    this.logger.debug('Get all blockchain accounts', { ...dto });

    const accounts = await this.blockchainAccountModel.paginate(dto);

    this.logger.debug('Blockchain accounts selection result:', {
      meta: accounts.meta,
    });

    return accounts;
  }

  public async getById(id: Types.ObjectId): Promise<BlockchainAccountDocument> {
    this.logger.debug('Get blockchain account by id', {
      id,
    });

    const account = await this.blockchainAccountModel.findById(id).exec();
    if (!account) {
      throw new HttpException('Blockchain account not found', HttpStatus.NOT_FOUND);
    }

    return account;
  }
}
