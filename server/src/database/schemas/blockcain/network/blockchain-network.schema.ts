import _ from 'lodash';
import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model, Schema as MongooseSchema } from 'mongoose';
import {
  BlockchainNetworkFamily,
  BlockchainNetworkName,
  BlockchainNetworkPrototypeLevel,
} from '@common/blockchain/enums';
import { PaginateResultEntity } from '@common/entities';
import { FindBlockchainNetworkDto } from '../../../../modules/dbl/blockchain/network/dto';
import { BlockchainNetworkEntity } from './blockchain-network.entity';
import {
  BlockchainNetworkConnect,
  BlockchainNetworkConnectSchema,
} from '@schemas/blockcain/network/connect/blockchain-network-connect.schema';

export type BlockchainNetworkDocument = HydratedDocument<BlockchainNetwork> & TStaticMethods;
export type BlockchainNetworkModel = Model<BlockchainNetworkDocument> & TStaticMethods;

export const BLOCKCHAIN_NETWORK_COLLECTION_NAME = 'blockchainNetworks';

@Schema({ timestamps: true, collection: BLOCKCHAIN_NETWORK_COLLECTION_NAME })
export class BlockchainNetwork {
  @Prop({ type: String, required: true, unique: true })
  innerKey: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(BlockchainNetworkFamily),
  })
  family: BlockchainNetworkFamily;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(BlockchainNetworkName),
  })
  name: BlockchainNetworkName;

  @Prop({ type: String, required: true })
  localName: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(BlockchainNetworkPrototypeLevel),
  })
  prototypeLevel: BlockchainNetworkPrototypeLevel;

  @Prop({ type: String, required: true })
  currencySymbol: string;

  @Prop({ type: Number, required: false, default: null })
  networkId: number | null;

  @Prop({ type: String, required: false, default: null })
  scan: string | null;

  @Prop({ type: BlockchainNetworkConnectSchema, required: true })
  httpConnect: BlockchainNetworkConnect;

  @Prop({ type: BlockchainNetworkConnectSchema, required: false, default: null })
  socketConnect: BlockchainNetworkConnect | null;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Boolean, required: true })
  available: boolean;

  @Prop({ type: Date, required: false, default: null })
  removedAt: Date | null; // time when this Network was removed
}

export const BlockchainNetworkSchema = SchemaFactory.createForClass(
  BlockchainNetwork,
) as unknown as MongooseSchema<Type<BlockchainNetwork>, BlockchainNetworkModel>;

// INDEXES
BlockchainNetworkSchema.index(
  {
    family: 1,
    name: 1,
    localName: 1,
    'httpConnect.url': 1,
  },
  { unique: true },
);

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
