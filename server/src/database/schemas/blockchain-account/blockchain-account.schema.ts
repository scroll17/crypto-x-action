import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model, Schema as MongooseSchema, SchemaTypes } from 'mongoose';
import { USER_COLLECTION_NAME, UserDocument } from '../user';
import { BlockchainNetworks } from '@common/blockchain/enums';
import { COMMENT_COLLECTION_NAME, CommentDocument } from '@schemas/comment';

export type BlockchainAccountDocument = HydratedDocument<BlockchainAccount> & TStaticMethods;
export type BlockchainAccountModel = Model<BlockchainAccountDocument> & TStaticMethods;

export const BLOCKCHAIN_ACCOUNT_COLLECTION_NAME = 'blockchainAccounts';

@Schema({ timestamps: true, collection: BLOCKCHAIN_ACCOUNT_COLLECTION_NAME })
export class BlockchainAccount {
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
