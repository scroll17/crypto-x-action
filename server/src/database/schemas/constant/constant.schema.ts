import * as _ from 'lodash';
import * as zlib from 'node:zlib';
import * as util from 'node:util';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Schema as MongooseSchema } from 'mongoose';
import { ConstantEntities } from '@schemas/constant/constant-entities.enum';
import { Type } from '@nestjs/common';

export type ConstantDocument = HydratedDocument<Constant> & TStaticMethods;
export type ConstantModel = Model<ConstantDocument> & TStaticMethods;

export const COLLECTION_NAME = 'constants';

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class Constant {
  @Prop({
    type: String,
    unique: true,
    required: true,
    enum: Object.values(ConstantEntities),
  })
  name: ConstantEntities;

  @Prop({ type: String, required: true })
  value: string;

  @Prop({ type: Boolean, required: true, default: false })
  compressed: boolean;
}

export const ConstantSchema = SchemaFactory.createForClass(
  Constant,
) as unknown as MongooseSchema<Type<Constant>, ConstantModel>;

// INDEXES

// CUSTOM TYPES
type TStaticMethods = {
  compress(this: ConstantModel, value: string): Promise<string>;
  decompress(this: ConstantModel, value: string): Promise<string>;
  getParsedValue: <TReturn>(
    this: ConstantModel,
    value: string | ConstantDocument,
  ) => TReturn;
  getConstant: (
    this: ConstantModel,
    name: ConstantEntities,
  ) => Promise<ConstantDocument | null>;
  upsert: (
    this: ConstantModel,
    name: ConstantEntities,
    value: string,
    compress: boolean,
  ) => Promise<ConstantDocument>;
};

// STATIC METHODS IMPLEMENTATION
ConstantSchema.statics.compress = async function (value) {
  const deflatedInput = await util.promisify(zlib.deflate)(value);

  return deflatedInput.toString('base64');
} as TStaticMethods['compress'];

ConstantSchema.statics.decompress = async function (value) {
  const buffer = Buffer.from(value, 'base64');
  const inflatedOutput = await util.promisify(zlib.inflate)(buffer);

  return inflatedOutput.toString('utf8');
} as TStaticMethods['decompress'];

ConstantSchema.statics.getParsedValue = function <TReturn>(entity) {
  if (typeof entity === 'string') return JSON.parse(entity);

  return JSON.parse(entity.value) as TReturn;
} as TStaticMethods['getParsedValue'];

ConstantSchema.statics.getConstant = async function (name) {
  const constant = await this.findOne({ name }).exec();

  if (!_.isNull(constant)) {
    if (constant.compressed) {
      constant.value = await this.decompress(constant.value);
    }

    return constant;
  }

  return null;
} as TStaticMethods['getConstant'];

ConstantSchema.statics.upsert = async function (name, input, compress = false) {
  const value = compress ? await this.compress(input) : input;

  const constant = await this.findOneAndUpdate(
    {
      name,
    },
    {
      $set: {
        value,
        compressed: compress,
      },
    },
    {
      upsert: true,
      new: true,
    },
  );

  constant.value = input;

  return constant;
} as TStaticMethods['upsert'];
