import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentDocument, CommentEntity, CommentModel } from '@schemas/comment';
import { PaginateResultEntity } from '@common/entities';
import { FindCommentDto } from './dto';
import { Types } from 'mongoose';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Comment.name) private commentModel: CommentModel,
  ) {}

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
}
