import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Schema as MongooseSchema } from 'mongoose';

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

export const UserSchema = SchemaFactory.createForClass(
  User,
) as unknown as MongooseSchema<Type<User>, UserModel>;

// INDEXES
UserSchema.index({
  telegramId: 1,
});

// CUSTOM TYPES
type TStaticMethods = {
  getAllUsers: (this: UserModel) => Promise<UserDocument[]>;
  getByTelegram: (this: UserModel, telegramId: number) => Promise<UserDocument>;
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
