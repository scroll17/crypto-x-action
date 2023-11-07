import { Types } from 'mongoose';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CommentService } from './comment.service';
import { AuthUser, CurrentUser } from '@common/decorators';
import { UserPaginateResultEntity } from '../user/entities/user-paginate-result.entity';
import { ParseObjectIdPipe } from '@common/pipes';
import { CommentEntity } from '@schemas/comment';
import { FindCommentDto } from './dto';
import { UserDocument } from '@schemas/user';

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

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get comment by id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The comment by id.',
    type: CommentEntity,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  @ApiQuery({ name: 'id', type: String, description: 'The ObjectId in the String view' })
  async getById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.commentService.getById(id);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Delete comment by id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The result of deletion.',
    type: Boolean,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  @ApiQuery({ name: 'id', type: String, description: 'The ObjectId in the String view' })
  async remove(@CurrentUser() user: UserDocument, @Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    await this.commentService.remove(user, id);
    return true;
  }
}
