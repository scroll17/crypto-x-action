import { Types } from 'mongoose';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
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
import { CreateCommentDto, EditCommentDto, FindCommentDto } from './dto';
import { UserDocument } from '@schemas/user';

@Controller('comment')
@ApiTags('Comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  @AuthUser()
  @ApiOperation({ summary: 'Create new comment.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New Comment document.',
    type: CommentEntity,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async create(@CurrentUser() user: UserDocument, @Body() dto: CreateCommentDto) {
    return this.commentService.create(user, dto);
  }

  @Patch('/edit')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Update comment by id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated comment record.',
    type: CommentEntity,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Comment not found' })
  @ApiQuery({ name: 'id', type: String, description: 'The ObjectId in the String view' })
  async edit(@CurrentUser() user: UserDocument, @Query('id', ParseObjectIdPipe) id: Types.ObjectId, @Body() dto: EditCommentDto) {
    return this.commentService.edit(user, id, dto);
  }

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
