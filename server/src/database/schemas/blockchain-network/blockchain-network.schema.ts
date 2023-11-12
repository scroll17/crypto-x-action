import _ from 'lodash';
import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model, Schema as MongooseSchema } from 'mongoose';
import { BlockchainNetworks } from '@common/blockchain/enums';
import { PaginateResultEntity } from '@common/entities';
import { FindBlockchainNetworkDto } from '../../../modules/dbl/blockchain/network/dto';
import { BlockchainNetworkEntity } from './blockchain-network.entity';

export type BlockchainNetworkDocument = HydratedDocument<BlockchainNetwork> & TStaticMethods;
export type BlockchainNetworkModel = Model<BlockchainNetworkDocument> & TStaticMethods;

export const BLOCKCHAIN_NETWORK_COLLECTION_NAME = 'blockchainNetworks';

@Schema({ timestamps: true, collection: BLOCKCHAIN_NETWORK_COLLECTION_NAME })
export class BlockchainNetwork {
  @Prop({
    type: String,
    required: true,
    unique: true,
    enum: Object.values(BlockchainNetworks),
  })
  name: BlockchainNetworks;

  @Prop({ type: String, required: true })
  description: string;
}

export const BlockchainNetworkSchema = SchemaFactory.createForClass(
  BlockchainNetwork,
) as unknown as MongooseSchema<Type<BlockchainNetwork>, BlockchainNetworkModel>;

// INDEXES

// CUSTOM TYPES
type TStaticMethods = {
  paginate: (
    this: BlockchainNetworkModel,
    findOptions: FindBlockchainNetworkDto,
  ) => Promise<PaginateResultEntity<BlockchainNetworkEntity>>;
};

// STATIC METHODS IMPLEMENTATION
BlockchainNetworkSchema.statics.paginate = async function (
  findOptions,
): Promise<PaginateResultEntity<BlockchainNetworkEntity>> {
  const { filter: rawFilter, paginate, sort } = findOptions;
  const { count, page } = paginate;

  const filter = Object.fromEntries(
    Object.entries(_.omit({ ...rawFilter }, ['id'])).filter(([, value]) => !_.isNil(value)),
  );

  const skip = (page - 1) * count;
  const where: FilterQuery<BlockchainNetworkDocument> = rawFilter?.id
    ? { _id: rawFilter.id, ...filter }
    : { ...filter };

  if ('name' in where && where.name) {
    // where.name = where.name
  }

  const total = await this.count(where);
  const data = (await this.aggregate()
    .match(where)
    .skip(skip)
    .limit(count)
    .sort(sort ? { [sort.name]: sort.type } : { _id: 'desc' })
    .exec()) as BlockchainNetworkEntity[];

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
