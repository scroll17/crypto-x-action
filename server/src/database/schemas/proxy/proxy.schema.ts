import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Schema as MongooseSchema } from 'mongoose';
import { HttpProtocol } from '@common/enums';

export type ProxyDocument = HydratedDocument<Proxy> & TStaticMethods;
export type ProxyModel = Model<ProxyDocument> & TStaticMethods;

export const PROXY_COLLECTION_NAME = 'proxy';

@Schema({ timestamps: true, collection: PROXY_COLLECTION_NAME })
export class Proxy {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: String, required: true })
  login: string;

  @Prop({ type: String, required: true })
  password: string;

  @Prop({ type: String, required: true })
  ip: string;

  @Prop({ type: Number, required: true })
  port: number;

  @Prop({
    type: [String],
    required: true,
    enum: Object.values(HttpProtocol),
  })
  protocols: HttpProtocol;

  @Prop({ type: Date, required: true })
  expiredAt: Date;
}

export const ProxySchema = SchemaFactory.createForClass(Proxy) as unknown as MongooseSchema<
  Type<Proxy>,
  ProxyModel
>;

// INDEXES

// CUSTOM TYPES
type TStaticMethods = {};

// STATIC METHODS IMPLEMENTATION
