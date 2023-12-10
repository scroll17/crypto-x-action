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
  getRawValue: (this: PrivateModel, record: PrivateDocument) => Promise<string>;
  getPrivateKey: (this: PrivateModel, record: PrivateDocument) => Promise<string>;
  getLoginPassword: (
    this: PrivateModel,
    record: PrivateDocument,
  ) => Promise<{ login: string; password: string }>;
  getSeedPhrase: (this: PrivateModel, record: PrivateDocument) => Promise<string[]>;
};

// STATIC METHODS IMPLEMENTATION
PrivateSchema.statics.getRawValue = async function (record) {
  return record.value;
} as TStaticMethods['getRawValue'];

PrivateSchema.statics.getPrivateKey = async function (record) {
  return record.value;
} as TStaticMethods['getPrivateKey'];

PrivateSchema.statics.getLoginPassword = async function (record) {
  const { login, password } = JSON.parse(record.value);
  return {
    login,
    password,
  };
} as TStaticMethods['getLoginPassword'];

PrivateSchema.statics.getSeedPhrase = async function (record) {
  return JSON.parse(record.value) as string[];
} as TStaticMethods['getSeedPhrase'];
