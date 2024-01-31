import _ from 'lodash';
import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model, Schema as MongooseSchema } from 'mongoose';
import { IntegrationNames } from '@common/integrations/common';
import { PaginateResultEntity } from '@common/entities';
import { FindIntegrationDto } from '../../../modules/dbl/integration/dto';
import { IntegrationEntity } from '@schemas/integration/integration.entity';

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
type TStaticMethods = {
  paginate: (
    this: IntegrationModel,
    findOptions: FindIntegrationDto,
  ) => Promise<PaginateResultEntity<IntegrationEntity>>;
};

// STATIC METHODS IMPLEMENTATION
IntegrationSchema.statics.paginate = async function (
  findOptions,
): Promise<PaginateResultEntity<IntegrationEntity>> {
  const { filter: rawFilter, paginate, sort } = findOptions;
  const { count, page } = paginate;

  const filter = Object.fromEntries(
    Object.entries(_.omit({ ...rawFilter }, ['id'])).filter(([, value]) => !_.isNil(value)),
  );

  const skip = (page - 1) * count;
  const where: FilterQuery<IntegrationDocument> = rawFilter?.id
    ? { _id: rawFilter.id, ...filter }
    : { ...filter };

  if ('key' in where && where.key) {
    // where.key = where.key
  }
  if ('name' in where && where.name) {
    where.name = { $regex: where.name, $options: 'i' };
  }

  const total = await this.count(where);
  const data = (await this.aggregate()
    .match(where)
    .skip(skip)
    .limit(count)
    .sort(sort ? { [sort.name]: sort.type } : { _id: 'desc' })
    .exec()) as IntegrationEntity[];

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
