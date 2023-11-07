import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModel } from '@schemas/comment';

@Injectable()
export class CommentService {
  private readonly logger = new Logger(this.constructor.name);

  constructor(
    private readonly configService: ConfigService,
    @InjectModel(Comment.name) private commentModel: CommentModel,
  ) {}
}
