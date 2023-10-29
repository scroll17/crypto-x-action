import { Controller, Get, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { JwtAuthGuard } from '@common/guards';
import { UserDocument, UserEntity } from '@schemas/user';
import { CurrentUser } from '@common/decorators';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
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
}
