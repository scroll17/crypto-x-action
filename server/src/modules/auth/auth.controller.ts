import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpCode,
  Ip,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBasicAuth,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
  ApiUnauthorizedResponse,
  getSchemaPath,
} from '@nestjs/swagger';
import { RegisterUserDto } from './dto/register-user.dto';
import { GoogleAuthGuard, JwtAuthGuard, LocalAuthGuard } from '@common/guards';
import { CurrentUser } from '@common/decorators';
import { ICurrentUserData, IUserDataInThirdPartyService } from '@common/interfaces/auth';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { InitPasswordResetDto } from './dto/init-password-reset.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { LoggedInUserEntity } from './entities/logged-in-user.entity';
import { LoggedInAdminEntity } from './entities/logged-in-admin.entity';
import { UserModel, UserWentFrom } from '@entities/user';
import { AccessTokenModel } from '@entities/accessToken';
import { Request } from 'express';
import { LoggedInThirdPartyServiceUserEntity } from './entities/logged-in-third-party-service-user.entity';
import { FacebookAuthGuard } from '@common/guards/facebook-auth.guard';

@Controller('auth')
@ApiTags('Auth')
@ApiExtraModels(LoggedInAdminEntity)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/register')
  @HttpCode(201)
  @ApiOperation({ summary: 'Register user.' })
  @ApiCreatedResponse({
    status: 201,
    description: 'Created user with access token.',
    type: LoggedInUserEntity,
  })
  @ApiForbiddenResponse({
    description: 'User with passed email or phone already exists',
  })
  async register(@Body() dto: RegisterUserDto, @Ip() ip: string) {
    return this.authService.register(dto, ip);
  }

  @Post('/login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(201)
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Login user.' })
  @ApiCreatedResponse({
    status: 201,
    description: 'User with tokens.',
    schema: {
      oneOf: [
        {
          $ref: getSchemaPath(LoggedInUserEntity),
        },
        {
          $ref: getSchemaPath(LoggedInAdminEntity),
        },
      ],
    },
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse({ description: 'User not unauthorized.' })
  async login(@CurrentUser() user: ICurrentUserData, @Ip() ip: string) {
    return this.authService.login(user, ip);
  }

  @Get('/google')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Init google auth' })
  async googleInit() {}

  @Get('/google/callback')
  @UseGuards(GoogleAuthGuard)
  @ApiOperation({ summary: 'Complete google auth' })
  @ApiOkResponse({
    status: 200,
    description: 'User with tokens.',
    type: LoggedInThirdPartyServiceUserEntity,
  })
  async googleLogin(@Req() req: Request, @Ip() ip: string) {
    return this.authService.thirdPartyLogin(req.user as IUserDataInThirdPartyService, UserWentFrom.Google, ip);
  }

  @Get('/facebook')
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ summary: 'Init facebook auth' })
  async facebookInit() {}

  @Get('/facebook/callback')
  @UseGuards(FacebookAuthGuard)
  @ApiOperation({ summary: 'Complete facebook auth' })
  @ApiOkResponse({
    status: 200,
    description: 'User with tokens.',
    type: LoggedInThirdPartyServiceUserEntity,
  })
  async facebookLogin(@Req() req: Request, @Ip() ip: string) {
    return this.authService.thirdPartyLogin(req.user as IUserDataInThirdPartyService, UserWentFrom.Facebook, ip);
  }

  @Patch('/verify-email')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify user email.' })
  @ApiCreatedResponse({
    status: 200,
    description: 'Current user.',
    type: UserModel,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async verifyEmail(@CurrentUser() user: ICurrentUserData, @Body() dto: VerifyEmailDto) {
    return this.authService.checkVerificationCode(user, dto.code);
  }

  @Post('/resend-verify-code')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Resend verify user code to user.' })
  @ApiOkResponse({
    status: 200,
    description: 'Result of resend email.',
    type: Boolean,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async resendVerifyCode(@CurrentUser() user: ICurrentUserData) {
    return this.authService.resendVerificationCode(user);
  }

  @Get('/tokens-list')
  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get list of existed tokens.' })
  @ApiOkResponse({
    status: 200,
    description: 'List of existed tokens.',
    type: [AccessTokenModel],
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getTokensList(@CurrentUser() user: ICurrentUserData) {
    return this.authService.getTokensList(user.info);
  }

  @Delete('/revoke-token')
  @UseGuards(JwtAuthGuard)
  @HttpCode(204)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove access token by id.' })
  @ApiOkResponse({
    status: 204,
    description: 'Token revoked.',
  })
  @ApiQuery({ name: 'id', type: Number })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiNotFoundResponse({ description: 'Token not found.' })
  async revokeToken(@CurrentUser() user: ICurrentUserData, @Query('id', ParseIntPipe) tokenId: number) {
    await this.authService.revokeToken(user, tokenId);
  }

  @Put('/refresh')
  @HttpCode(200)
  @ApiBasicAuth()
  @ApiOperation({ summary: 'Refresh access token.' })
  @ApiCreatedResponse({
    status: 200,
    description: 'New refresh and access tokens.',
    schema: {
      properties: {
        accessToken: {
          type: 'string',
        },
      },
    },
  })
  @ApiQuery({ name: 'token', type: String })
  @ApiNotFoundResponse({ description: 'Token not found.' })
  async refresh(@Query('token') refreshToken: string) {
    return this.authService.refresh(refreshToken);
  }

  @Post('/logout')
  @UseGuards(JwtAuthGuard)
  @HttpCode(201)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Logout user and destroy token.' })
  @ApiCreatedResponse({
    status: 201,
    description: 'Result of logout.',
    type: Boolean,
  })
  @ApiNotFoundResponse({ description: 'User not found.' })
  @ApiUnauthorizedResponse({ description: 'User not unauthorized.' })
  async logout(@CurrentUser() user: ICurrentUserData, @Headers('Authorization') rawAccessToken: string) {
    const accessTokenStr = rawAccessToken.split(' ')[1];
    return this.authService.logout(user.info, accessTokenStr);
  }

  @Post('/init-password-reset')
  @HttpCode(201)
  @ApiOperation({ summary: 'Init password reset for user.' })
  @ApiCreatedResponse({
    status: 201,
    description: 'Result of send init password reset email.',
    type: Boolean,
  })
  @ApiNotFoundResponse({ description: 'Record not found.' })
  async initPasswordReset(@Body() dto: InitPasswordResetDto) {
    return this.authService.initPasswordReset(dto.email);
  }

  @Post('/reset-password')
  @HttpCode(201)
  @ApiOperation({ summary: 'Reset password for user.' })
  @ApiCreatedResponse({
    status: 201,
    description: 'Result of password reset.',
    type: Boolean,
  })
  @ApiNotFoundResponse({ description: 'Reset code not found.' })
  @ApiNotFoundResponse({ description: 'Record not found.' })
  async resetPassword(@Body() dto: ResetPasswordDto) {
    return this.authService.resetPassword(dto);
  }
}
