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
import { CreateBlockchainAccountDto, EditBlockchainAccountDto, FindBlockchainAccountDto } from './dto';
import { PaginateResultEntity } from '@common/entities';
import { Comment, CommentModel } from '@schemas/comment';

@Injectable()
export class BlockchainAccountService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Comment.name) private readonly commentModel: CommentModel,
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

    const accountsCount = await this.blockchainAccountModel.count({ name: dto.name });
    if (accountsCount > 0) {
      this.logger.warn('Account with passed name already exists', { name: dto.name });
      throw new HttpException('Account with passed name already exists', HttpStatus.FORBIDDEN);
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

  public async edit(
    user: UserDocument,
    id: Types.ObjectId,
    dto: EditBlockchainAccountDto,
  ): Promise<BlockchainAccountDocument> {
    this.logger.debug('Update blockchain account by id', {
      id,
      admin: _.pick(user, ['_id', 'email']),
      data: dto,
    });

    if (Object.keys(dto).filter(Boolean).length === 0) {
      throw new HttpException('No data for updating', HttpStatus.BAD_REQUEST);
    }

    const account = await this.blockchainAccountModel.findById(id).exec();
    if (!account) {
      throw new HttpException('Blockchain account not found', HttpStatus.NOT_FOUND);
    }

    if (!account.createdBy._id.equals(user._id)) {
      throw new HttpException('Cant delete foreign account', HttpStatus.FORBIDDEN);
    }

    if (dto.name) {
      const accountsCount = await this.blockchainAccountModel.count({ name: dto.name });
      if (accountsCount > 0) {
        this.logger.warn('Account with passed name already exists', { name: dto.name });
        throw new HttpException('Account with passed name already exists', HttpStatus.FORBIDDEN);
      }
    }

    // const updatedAccount = await this.blockchainAccountModel.updateRole(account, dto);
    // this.logger.debug('Blockchain account updated', {
    //   id: updatedAccount._id,
    //   name: updatedAccount.name,
    // });

    const [accountWithRefs] = await this.blockchainAccountModel.findByWithRelationships({
      _id: account._id,
    });
    return accountWithRefs;
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

    const [account] = await this.blockchainAccountModel.findByWithRelationships({ _id: id });
    if (!account) {
      throw new HttpException('Blockchain account not found', HttpStatus.NOT_FOUND);
    }

    return account;
  }

  public async getUniqueLabels(): Promise<string[]> {
    this.logger.debug('Get blockchain account unique labels', {});

    return await this.blockchainAccountModel.getUniqueLabels();
  }

  public async remove(user: UserDocument, id: Types.ObjectId): Promise<void> {
    this.logger.debug('Remove blockchain account by id', {
      id,
    });

    const account = await this.blockchainAccountModel.findById(id).exec();
    if (!account) {
      throw new HttpException('Blockchain account not found', HttpStatus.NOT_FOUND);
    }

    if (!account.createdBy._id.equals(user._id)) {
      throw new HttpException('Cant delete foreign account', HttpStatus.FORBIDDEN);
    }

    // Account
    await this.blockchainAccountModel.deleteOne({
      _id: account._id,
    });
    this.logger.debug('Blockchain account deleted', {
      id: account._id,
      name: account.name,
    });

    // Comments
    if (account.comments.length > 0) {
      const deleteResult = await this.commentModel.deleteMany({
        _id: {
          $in: account.comments,
        },
      });
      this.logger.debug('Delete blockchain comments result', { ...deleteResult });
    }
  }
}
