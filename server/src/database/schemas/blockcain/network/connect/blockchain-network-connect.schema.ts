import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes } from 'mongoose';

@Schema({
  _id: false,
  timestamps: false,
})
export class BlockchainNetworkConnect {
  @Prop({ type: String, required: true })
  url: string;

  @Prop({ type: SchemaTypes.Subdocument, required: true })
  connectOptions: Record<string, unknown>;
}

export const BlockchainNetworkConnectSchema = SchemaFactory.createForClass(BlockchainNetworkConnect);
