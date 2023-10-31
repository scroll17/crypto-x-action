import _ from 'lodash';
import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model, Schema as MongooseSchema } from 'mongoose';
import { FindUserDto } from '../../../modules/user/dto';
import { PaginateResultEntity } from '@common/entities';
import { UserEntity } from '@schemas/user/user.entity';

export type UserDocument = HydratedDocument<User> & TStaticMethods;
export type UserModel = Model<UserDocument> & TStaticMethods;

export const COLLECTION_NAME = 'users';

@Schema({ timestamps: true, collection: COLLECTION_NAME })
export class User {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true, unique: true })
  email: string;

  @Prop({
    type: Number,
    required: true,
    unique: true,
  })
  telegramId: number;

  @Prop({ type: Boolean, required: true })
  hasBotAccess: boolean;

  @Prop({ type: Boolean, required: true })
  isAdmin: boolean;

  @Prop({ type: String, required: false })
  username?: string;
}

export const UserSchema = SchemaFactory.createForClass(User) as unknown as MongooseSchema<
  Type<User>,
  UserModel
>;

// INDEXES
UserSchema.index({
  telegramId: 1,
});

// CUSTOM TYPES
type TStaticMethods = {
  getAllUsers: (this: UserModel) => Promise<UserDocument[]>;
  getByTelegram: (this: UserModel, telegramId: number) => Promise<UserDocument>;
  paginate: (this: UserModel, findOptions: FindUserDto) => Promise<PaginateResultEntity<UserEntity>>;
};

// STATIC METHODS IMPLEMENTATION
UserSchema.statics.getAllUsers = async function () {
  return this.find().exec();
} as TStaticMethods['getAllUsers'];

UserSchema.statics.getByTelegram = async function (telegramId) {
  return this.findOne({
    telegramId,
  }).exec();
} as TStaticMethods['getByTelegram'];

UserSchema.statics.paginate = async function (findOptions): Promise<PaginateResultEntity<UserEntity>> {
  const { filter: rawFilter, paginate, sort } = findOptions;
  const { count, page } = paginate;

  const filter = Object.fromEntries(
    Object.entries(_.omit({ ...rawFilter }, ['id'])).filter(([, value]) => !_.isNil(value)),
  );

  const skip = (page - 1) * count;
  const where: FilterQuery<UserDocument> = rawFilter?.id ? { _id: rawFilter.id, ...filter } : { ...filter };

  if ('name' in where && where.name) {
    where.name = { $regex: where.name, $options: 'i' };
  }
  if ('email' in where && where.email) {
    where.email = { $regex: where.email, $options: 'i' };
  }
  if ('telegramId' in where && where.telegramId) {
    // where.telegramId = where.telegramId;
  }

  const total = await this.count(where);
  const data = (await this.aggregate()
    .match(where)
    .skip(skip)
    .limit(count)
    .sort(sort ? { [sort.name]: sort.type } : { _id: 'desc' })
    .exec()) as UserEntity[];

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
