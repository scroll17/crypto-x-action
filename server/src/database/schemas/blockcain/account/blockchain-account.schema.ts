import _ from 'lodash';
import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model, Schema as MongooseSchema, SchemaTypes } from 'mongoose';
import { USER_COLLECTION_NAME, UserDocument } from '../../user';
import { COMMENT_COLLECTION_NAME, CommentDocument } from '@schemas/comment';
import { BLOCKCHAIN_NETWORK_COLLECTION_NAME, BlockchainNetworkDocument } from '@schemas/blockcain/network';
import { PaginateResultEntity } from '@common/entities';
import { BlockchainAccountEntity } from '@schemas/blockcain/account/blockchain-account.entity';
import { FindBlockchainAccountDto } from '../../../../modules/dbl/blockchain/account/dto';

export type BlockchainAccountDocument = HydratedDocument<BlockchainAccount> & TStaticMethods;
export type BlockchainAccountModel = Model<BlockchainAccountDocument> & TStaticMethods;

export const BLOCKCHAIN_ACCOUNT_COLLECTION_NAME = 'blockchainAccounts';

@Schema({ timestamps: true, collection: BLOCKCHAIN_ACCOUNT_COLLECTION_NAME })
export class BlockchainAccount {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: [String], required: true, default: [] })
  labels: string[];

  @Prop({ type: SchemaTypes.ObjectId, ref: BLOCKCHAIN_NETWORK_COLLECTION_NAME, required: true })
  network: BlockchainNetworkDocument;

  @Prop({ type: [SchemaTypes.ObjectId], ref: COMMENT_COLLECTION_NAME, required: true, default: [] })
  comments: CommentDocument[];

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
  findByWithRelationships: (
    this: BlockchainAccountModel,
    options: FilterQuery<BlockchainAccountDocument>,
  ) => Promise<BlockchainAccountDocument[]>;
  paginate: (
    this: BlockchainAccountModel,
    findOptions: FindBlockchainAccountDto,
  ) => Promise<PaginateResultEntity<BlockchainAccountEntity>>;
};

// STATIC METHODS IMPLEMENTATION
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
