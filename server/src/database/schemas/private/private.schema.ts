import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Schema as MongooseSchema } from 'mongoose';
import { PrivateRecordType } from '@schemas/private/private-record-type.enum';

export type PrivateDocument = HydratedDocument<Private> & TStaticMethods;
export type PrivateModel = Model<PrivateDocument> & TStaticMethods;

export const PRIVATE_COLLECTION_NAME = 'privates';

@Schema({ timestamps: true, collection: PRIVATE_COLLECTION_NAME })
export class Private {
  @Prop({ type: String, required: true })
  value: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(PrivateRecordType),
  })
  type: PrivateRecordType;

  @Prop({ type: Number, required: true, default: 0 })
  encryptionVersion: number;
}

export const PrivateSchema = SchemaFactory.createForClass(Private) as unknown as MongooseSchema<
  Type<Private>,
  PrivateModel
>;

// INDEXES

// CUSTOM TYPES
type TStaticMethods = {
  getRawValue: (this: PrivateModel, record: PrivateDocument) => string;
  getSeedPhrase: (this: PrivateModel, record: PrivateDocument) => string[];
};

// STATIC METHODS IMPLEMENTATION
PrivateSchema.statics.getRawValue = function (record) {
  return record.value;
} as TStaticMethods['getRawValue'];

PrivateSchema.statics.getSeedPhrase = function (record) {
  return JSON.parse(record.value) as string[];
} as TStaticMethods['getSeedPhrase'];