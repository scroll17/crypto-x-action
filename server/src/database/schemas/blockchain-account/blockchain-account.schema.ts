import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model, Schema as MongooseSchema, SchemaTypes } from 'mongoose';
import { USER_COLLECTION_NAME, UserDocument } from '../user';
import { BlockchainNetworks } from '@common/blockchain/enums';
import { COMMENT_COLLECTION_NAME, CommentDocument } from '@schemas/comment';

export type BlockChainAccountDocument = HydratedDocument<BlockChainAccount> & TStaticMethods;
export type BlockChainAccountModel = Model<BlockChainAccountDocument> & TStaticMethods;

export const BLOCKCHAIN_ACCOUNT_COLLECTION_NAME = 'blockchainAccounts';

@Schema({ timestamps: true, collection: BLOCKCHAIN_ACCOUNT_COLLECTION_NAME })
export class BlockChainAccount {
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(BlockchainNetworks),
  })
  network: BlockchainNetworks;

  @Prop({ type: [String], required: true, default: [] })
  labels: string[];

  @Prop({ type: [SchemaTypes.ObjectId], ref: COMMENT_COLLECTION_NAME, required: true, default: [] })
  comments: CommentDocument[];

  @Prop({ type: SchemaTypes.ObjectId, ref: USER_COLLECTION_NAME, required: true })
  createdBy: UserDocument;
}

export const BlockchainAccountSchema = SchemaFactory.createForClass(
  BlockChainAccount,
) as unknown as MongooseSchema<Type<BlockChainAccount>, BlockChainAccountModel>;

// INDEXES
BlockchainAccountSchema.index({
  createdBy: 1,
});

// CUSTOM TYPES
type TStaticMethods = {
  findByWithRelationships: (
    this: BlockChainAccountModel,
    options: FilterQuery<BlockChainAccountDocument>,
  ) => Promise<BlockChainAccountDocument[]>;
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
