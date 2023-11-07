import * as _ from 'lodash';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument, CommentEntity, CommentModel } from '@schemas/comment';
import { PaginateResultEntity } from '@common/entities';
import { CreateCommentDto, FindCommentDto } from './dto';
import { Types } from 'mongoose';
import { UserDocument } from '@schemas/user';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Comment.name) private readonly commentModel: CommentModel,
  ) {}

  public async create(user: UserDocument, dto: CreateCommentDto) {
    this.logger.debug('Create new Comment', {
      admin: _.pick(user, ['_id', 'email']),
      comment: dto,
    });

    const newComment = await this.commentModel.create({
      text: dto.text,
      createdBy: user._id,
    });

    this.logger.debug('Created new Comment record', {
      ...newComment.toJSON(),
    });

    const [commentWithRefs] = await this.commentModel.findByWithRelationships({
      _id: newComment._id,
    });
    return commentWithRefs;
  }

  public async getAll(dto: FindCommentDto): Promise<PaginateResultEntity<CommentEntity>> {
    this.logger.debug('Get all comments', { ...dto });

    const comments = await this.commentModel.paginate(dto);

    this.logger.debug('Comments selection result:', {
      meta: comments.meta,
    });

    return comments;
  }

  public async getById(id: Types.ObjectId): Promise<CommentDocument> {
    this.logger.debug('Get comment by id', {
      id,
    });

    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    return comment;
  }

  public async remove(user: UserDocument, id: Types.ObjectId): Promise<void> {
    this.logger.debug('Remove comment by id', {
      id,
    });

    const comment = await this.commentModel.findById(id).exec();
    if (!comment) {
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);
    }

    if (!comment.createdBy._id.equals(user._id)) {
      throw new HttpException('Cant delete foreign comment', HttpStatus.FORBIDDEN);
    }

    await this.commentModel.deleteOne({
      _id: comment._id,
    });
    this.logger.debug('Comment deleted', {
      id: comment._id,
    });
  }
}
