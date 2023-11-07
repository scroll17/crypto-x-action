import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { AuthUser } from '@common/decorators';
import { UserPaginateResultEntity } from '../user/entities/user-paginate-result.entity';
import { FindCommentDto } from './dto';

@Controller('comment')
@ApiTags('Comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/all')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get all comments.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginate of comments result.',
    type: UserPaginateResultEntity,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getAll(@Body() dto: FindCommentDto) {
    return this.commentService.getAll(dto);
  }
}
