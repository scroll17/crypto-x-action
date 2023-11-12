import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Schema as MongooseSchema } from 'mongoose';
import { BlockchainNetworks } from '@common/blockchain/enums';

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
type TStaticMethods = {};

// STATIC METHODS IMPLEMENTATION
