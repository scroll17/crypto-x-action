import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserService } from './user.service';
import { UserDocument, UserEntity } from '@schemas/user';
import { AuthUser, CurrentUser } from '@common/decorators';
import { UserPaginateResultEntity } from './entities/user-paginate-result.entity';
import { FindUserDto } from './dto';
import { ParseObjectIdPipe } from '@common/pipes';
import { Types } from 'mongoose';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get current user.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Current user.',
    type: UserEntity,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getMe(@CurrentUser() user: UserDocument) {
    return user;
  }

  @Post('/all')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get all users.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginate of users result.',
    type: UserPaginateResultEntity,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getAll(@Body() dto: FindUserDto) {
    return this.userService.getAll(dto);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get user by id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The user by id.',
    type: UserEntity,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'User not found' })
  async getById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.userService.getById(id);
  }
}
