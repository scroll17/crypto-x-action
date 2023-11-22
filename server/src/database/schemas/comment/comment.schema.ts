import _ from 'lodash';
import { Type } from '@nestjs/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FilterQuery, HydratedDocument, Model, Schema as MongooseSchema, SchemaTypes, Types } from 'mongoose';
import { PaginateResultEntity } from '@common/entities';
import { USER_COLLECTION_NAME, UserDocument } from '../user';
import { DirectlyEditCommentDto, FindCommentDto } from '../../../modules/dbl/comment/dto';
import { CommentEntity } from '@schemas/comment/comment.entity';

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
  paginate: (this: CommentModel, findOptions: FindCommentDto) => Promise<PaginateResultEntity<CommentEntity>>;
  updateComment: (
    this: CommentModel,
    commentId: Types.ObjectId,
    data: DirectlyEditCommentDto,
  ) => Promise<CommentDocument>;
};

// STATIC METHODS IMPLEMENTATION
CommentSchema.statics.findByWithRelationships = async function (where) {
  return await this.aggregate([
    {
      $match: where,
    },
    {
      $lookup: {
        from: USER_COLLECTION_NAME,
        foreignField: '_id',
        localField: 'createdBy',
        as: 'createdBy',
      },
    },
    {
      $unwind: {
        path: '$createdBy',
        preserveNullAndEmptyArrays: true,
      },
    },
  ]).exec();
} as TStaticMethods['findByWithRelationships'];

CommentSchema.statics.paginate = async function (findOptions): Promise<PaginateResultEntity<CommentEntity>> {
  const { filter: rawFilter, paginate, sort } = findOptions;
  const { count, page } = paginate;

  const filter = Object.fromEntries(
    Object.entries(_.omit({ ...rawFilter }, ['id'])).filter(([, value]) => !_.isNil(value)),
  );

  const skip = (page - 1) * count;
  const where: FilterQuery<CommentDocument> = rawFilter?.id
    ? { _id: rawFilter.id, ...filter }
    : { ...filter };

  if ('text' in where && where.text) {
    where.text = { $regex: where.text, $options: 'i' };
  }
  if ('createdBy' in where && where.createdBy) {
    // where.createdBy = where.createdBy
  }

  const total = await this.count(where);
  const data = (await this.aggregate()
    .match(where)
    .skip(skip)
    .limit(count)
    .sort(sort ? { [sort.name]: sort.type } : { _id: 'desc' })
    .exec()) as CommentEntity[];

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

CommentSchema.statics.updateComment = async function (commentId, data): Promise<CommentDocument> {
  const updateData: Partial<Comment> = {};
  if ('text' in data && data.text) {
    updateData.text = data.text;
  }

  const comment = await this.findOneAndUpdate(
    {
      _id: commentId,
    },
    {
      $set: updateData,
    },
    {
      returnOriginal: false,
    },
  ).exec();

  return comment!;
} as TStaticMethods['updateComment'];
