import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BlockchainNetworkType } from '@common/blockchain';

@Schema({
  _id: false,
  timestamps: false,
})
export class BlockchainAccountNetworkInfo {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, enum: Object.values(BlockchainNetworkType), unique: true })
  type: string;

  @Prop({ type: String, required: true })
  url: string;
}

export const BlockchainAccountNetworkInfoSchema = SchemaFactory.createForClass(BlockchainAccountNetworkInfo);
