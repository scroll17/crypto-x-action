import _ from 'lodash';
import { Exclude } from 'class-transformer';
import { HttpException, HttpStatus, Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model, Schema as MongooseSchema, SchemaTypes, Types } from 'mongoose';
import { USER_COLLECTION_NAME, UserDocument } from '../../user';
import { COMMENT_COLLECTION_NAME, CommentDocument } from '@schemas/comment';
import { BLOCKCHAIN_NETWORK_COLLECTION_NAME, BlockchainNetworkDocument } from '@schemas/blockcain/network';
import { PRIVATE_COLLECTION_NAME, PrivateDocument } from '@schemas/private';
import { PaginateResultEntity } from '@common/entities';
import { BlockchainAccountEntity } from '@schemas/blockcain/account/blockchain-account.entity';
import {
  BlockchainAccountNetworkInfoSchema,
  BlockchainAccountNetworkInfo,
} from './network-info/blockchain-account-network-info.schema';
import {
  EditBlockchainAccountDto,
  FindBlockchainAccountDto,
} from '../../../../modules/dbl/blockchain/account/dto';
import { EditAction } from '@common/enums';

export type BlockchainAccountDocument = HydratedDocument<BlockchainAccount> & TStaticMethods;
export type BlockchainAccountModel = Model<BlockchainAccountDocument> & TStaticMethods;

export const BLOCKCHAIN_ACCOUNT_COLLECTION_NAME = 'blockchainAccounts';

@Schema({ timestamps: true, collection: BLOCKCHAIN_ACCOUNT_COLLECTION_NAME })
export class BlockchainAccount {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: [String], required: true, default: [] })
  labels: string[];

  @Prop({ type: String, required: true, unique: true })
  address: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: BLOCKCHAIN_NETWORK_COLLECTION_NAME, required: true })
  network: BlockchainNetworkDocument;

  @Prop({ type: BlockchainAccountNetworkInfoSchema, required: true })
  networkInfo: BlockchainAccountNetworkInfo;

  @Prop({ type: [SchemaTypes.ObjectId], ref: COMMENT_COLLECTION_NAME, required: true, default: [] })
  comments: CommentDocument[];

  @Exclude({ toClassOnly: true })
  @Prop({ type: SchemaTypes.ObjectId, ref: PRIVATE_COLLECTION_NAME, required: false })
  _private?: PrivateDocument;

  @Prop({ type: SchemaTypes.ObjectId, ref: USER_COLLECTION_NAME, required: true })
  createdBy: UserDocument;
}

export const BlockchainAccountSchema = SchemaFactory.createForClass(
  BlockchainAccount,
) as unknown as MongooseSchema<Type<BlockchainAccount>, BlockchainAccountModel>;

// INDEXES
BlockchainAccountSchema.index({
  createdBy: 1,
});

// CUSTOM TYPES
type TStaticMethods = {
  getUniqueLabels: (this: BlockchainAccountModel) => Promise<string[]>;
  findByWithRelationships: (
    this: BlockchainAccountModel,
    options: FilterQuery<BlockchainAccountDocument>,
  ) => Promise<BlockchainAccountDocument[]>;
  paginate: (
    this: BlockchainAccountModel,
    findOptions: FindBlockchainAccountDto,
  ) => Promise<PaginateResultEntity<BlockchainAccountEntity>>;
  updateAccount: (
    this: BlockchainAccountModel,
    account: BlockchainAccountDocument,
    data: EditBlockchainAccountDto,
  ) => Promise<BlockchainAccountDocument>;
  addPrivate: (
    this: BlockchainAccountModel,
    account: BlockchainAccountDocument,
    _private: Types.ObjectId,
  ) => Promise<BlockchainAccountDocument>;
};

// STATIC METHODS IMPLEMENTATION
BlockchainAccountSchema.statics.getUniqueLabels = async function () {
  const [result] = await this.aggregate([
    {
      $unwind: {
        path: '$labels',
      },
    },
    {
      $group: {
        _id: 1,
        labelsMatrix: {
          $push: '$labels',
        },
      },
    },
    {
      $project: {
        labels: {
          $setUnion: '$labelsMatrix',
        },
      },
    },
  ]).exec();

  return result.labels;
} as TStaticMethods['getUniqueLabels'];

BlockchainAccountSchema.statics.findByWithRelationships = async function (where) {
  return await this.aggregate([
    {
      $match: where,
    },
    {
      $lookup: {
        from: COMMENT_COLLECTION_NAME,
        foreignField: '_id',
        localField: 'comments',
        as: 'comments',
      },
    },
    {
      $lookup: {
        from: USER_COLLECTION_NAME,
        foreignField: '_id',
        localField: 'createdBy',
        as: 'createdBy',
      },
    },
    {
      $unwind: {
        path: '$createdBy',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $lookup: {
        from: PRIVATE_COLLECTION_NAME,
        foreignField: '_id',
        localField: '_private',
        as: '_private',
      },
    },
    {
      $unwind: {
        path: '$_private',
        preserveNullAndEmptyArrays: true,
      },
    },
  ]).exec();
} as TStaticMethods['findByWithRelationships'];

BlockchainAccountSchema.statics.paginate = async function (
  findOptions,
): Promise<PaginateResultEntity<BlockchainAccountEntity>> {
  const { filter: rawFilter, paginate, sort } = findOptions;
  const { count, page } = paginate;

  const filter = Object.fromEntries(
    Object.entries(_.omit({ ...rawFilter }, ['id'])).filter(([, value]) => !_.isNil(value)),
  );

  const skip = (page - 1) * count;
  const where: FilterQuery<BlockchainAccountDocument> = rawFilter?.id
    ? { _id: rawFilter.id, ...filter }
    : { ...filter };

  if ('name' in where && where.name) {
    where.name = { $regex: where.name, $options: 'i' };
  }
  if ('address' in where && where.address) {
    where.address = { $regex: where.address, $options: 'i' };
  }
  if ('labels' in where && where.labels) {
    where.labels = { $in: where.labels };
  }
  if ('network' in where && where.network) {
    // where.network = where.network
  }
  if ('createdBy' in where && where.createdBy) {
    // where.createdBy = where.createdBy
  }

  const total = await this.count(where);
  const data = (await this.aggregate()
    .match(where)
    .lookup({
      from: BLOCKCHAIN_NETWORK_COLLECTION_NAME,
      localField: 'network',
      foreignField: '_id',
      as: 'network',
    })
    .unwind({
      path: '$network',
      preserveNullAndEmptyArrays: true,
    })
    .lookup({
      from: COMMENT_COLLECTION_NAME,
      localField: 'comments',
      foreignField: '_id',
      as: 'comments',
    })
    .lookup({
      from: USER_COLLECTION_NAME,
      localField: 'createdBy',
      foreignField: '_id',
      as: 'createdBy',
    })
    .unwind({
      path: '$createdBy',
      preserveNullAndEmptyArrays: true,
    })
    .project({ _private: 0 })
    .skip(skip)
    .limit(count)
    .sort(sort ? { [sort.name]: sort.type } : { _id: 'desc' })
    .exec()) as BlockchainAccountEntity[];

  return {
    data: data,
    meta: {
      total,
      page,
      count,
      lastPage: Math.ceil(total / count),
    },
  };
} as TStaticMethods['paginate'];

BlockchainAccountSchema.statics.updateAccount = async function (
  account,
  data,
): Promise<BlockchainAccountDocument> {
  const updateData: Partial<BlockchainAccount> = {};

  if ('name' in data && data.name) {
    updateData.name = data.name;
  }

  if ('address' in data && data.address) {
    updateData.address = data.address;
  }

  if ('networkInfo' in data && data.networkInfo) {
    updateData.networkInfo = data.networkInfo;
  }

  if ('comments' in data && data.comments) {
    let newComments = [...account.comments] as unknown as Types.ObjectId[];

    data.comments.forEach((commentAction) => {
      const { action, value: commentConfig } = commentAction;

      switch (action) {
        case EditAction.Add: {
          if (newComments.some((commentId) => commentId.equals(commentConfig.commentId))) {
            throw new HttpException('Comment already exists in the Account', HttpStatus.FORBIDDEN);
          }

          newComments.push(commentConfig.commentId);
          break;
        }
        case EditAction.Remove: {
          newComments = newComments.filter((commentId) => !commentId.equals(commentConfig.commentId));
          break;
        }
        default: {
          break;
        }
      }
    });

    updateData.comments = newComments as unknown as CommentDocument[];
  }

  if ('labels' in data && data.labels) {
    let newLabels = [...account.labels];

    newLabels = _.without(newLabels, ...data.getLabels(EditAction.Remove).map((l) => l.label));
    newLabels = _.uniq([...newLabels, ...data.getLabels(EditAction.Add).map((l) => l.label)]);

    updateData.labels = newLabels;
  }

  const updatedAccount = await this.findOneAndUpdate(
    {
      _id: account._id,
    },
    {
      $set: updateData,
    },
    {
      returnOriginal: false,
    },
  ).exec();

  return updatedAccount!;
} as TStaticMethods['updateAccount'];

BlockchainAccountSchema.statics.addPrivate = async function (
  account,
  _private,
): Promise<BlockchainAccountDocument> {
  const updatedAccount = await this.findOneAndUpdate(
    {
      _id: account._id,
    },
    {
      $set: {
        _private,
      },
    },
    {
      returnOriginal: false,
    },
  ).exec();

  return updatedAccount!;
} as TStaticMethods['addPrivate'];
