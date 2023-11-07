import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentEntity, CommentModel } from '@schemas/comment';
import { PaginateResultEntity } from '@common/entities';
import { FindCommentDto } from './dto';

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
}
