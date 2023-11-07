import _ from 'lodash';
import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model, Schema as MongooseSchema, SchemaTypes } from 'mongoose';
import { FindUserDto } from '../../../modules/user/dto';
import { PaginateResultEntity } from '@common/entities';
import { UserEntity } from '@schemas/user/user.entity';
import { USER_COLLECTION_NAME, UserDocument } from '../user';

export type CommentDocument = HydratedDocument<Comment> & TStaticMethods;
export type CommentModel = Model<CommentDocument> & TStaticMethods;

export const COMMENT_COLLECTION_NAME = 'comments';

@Schema({ timestamps: true, collection: COMMENT_COLLECTION_NAME })
export class Comment {
  @Prop({ type: String, required: true })
  text: string;

  @Prop({ type: SchemaTypes.ObjectId, ref: USER_COLLECTION_NAME, required: true })
  createdBy: UserDocument;
}

export const CommentSchema = SchemaFactory.createForClass(Comment) as unknown as MongooseSchema<
  Type<Comment>,
  CommentModel
>;

// INDEXES
CommentSchema.index({
  createdBy: 1,
});

// CUSTOM TYPES
type TStaticMethods = {
  findByWithRelationships: (
    this: CommentModel,
    options: FilterQuery<CommentDocument>,
  ) => Promise<CommentDocument[]>;
  paginate: (this: CommentModel, findOptions: FindUserDto) => Promise<PaginateResultEntity<UserEntity>>;
};


