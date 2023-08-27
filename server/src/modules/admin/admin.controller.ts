import { Controller, Get, HttpCode } from '@nestjs/common';
import { AdminService } from './admin.service';
import { ApiBearerAuth, ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthAdmin } from '@common/guards';
import { CurrentUser, DisableController } from '@common/decorators';
import { ICurrentUserData } from '@common/interfaces/auth';
import { AdminModel } from '@entities/admin';

@Controller('admin')
@ApiTags('Admin')
@DisableController()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('/me')
  @AuthAdmin()
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current admin user.' })
  @ApiOkResponse({
    status: 200,
    description: 'Current admin user.',
    type: AdminModel,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getMe(@CurrentUser() user: ICurrentUserData) {
    return user.info;
  }
}
