import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Schema as MongooseSchema } from 'mongoose';
import { IntegrationNames } from '@common/integrations/common';

export type IntegrationDocument = HydratedDocument<Integration> & TStaticMethods;
export type IntegrationModel = Model<IntegrationDocument> & TStaticMethods;

export const INTEGRATION_COLLECTION_NAME = 'integrations';

@Schema({ timestamps: true, collection: INTEGRATION_COLLECTION_NAME })
export class Integration {
  @Prop({
    type: String,
    unique: true,
    required: true,
    enum: Object.values(IntegrationNames),
  })
  key: IntegrationNames;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  apiUrl: string;

  @Prop({ type: String, required: true })
  description: string;

  @Prop({ type: Boolean, required: true })
  active: boolean;
}

export const IntegrationSchema = SchemaFactory.createForClass(Integration) as unknown as MongooseSchema<
  Type<Integration>,
  IntegrationModel
>;

// INDEXES

// CUSTOM TYPES
type TStaticMethods = {};

// STATIC METHODS IMPLEMENTATION
