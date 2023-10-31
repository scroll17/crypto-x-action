import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@common/guards';
import { UserDocument, UserEntity } from '@schemas/user';
import { CurrentUser } from '@common/decorators';
import { UserPaginateResultEntity } from './entities/user-paginate-result.entity';
import { FindUserDto } from './dto';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
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
  @UseGuards(JwtAuthGuard)
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
}
