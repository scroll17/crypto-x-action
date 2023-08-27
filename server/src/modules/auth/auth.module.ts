import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataGenerateHelper } from '@common/helpers';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { FacebookStrategy } from './strategies/facebook.strategy';
import {
  AccessTokenRepositoryProvider,
  AdminRepositoryProvider,
  UserRepositoryProvider,
} from '../database/repositories';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => {
        return {
          global: true,
          secret: configService.get('jwt.accessSecret'),
          signOptions: {
            expiresIn: configService.get('jwt.accessExpires'),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    FacebookStrategy,
    DataGenerateHelper,
    // DB
    AccessTokenRepositoryProvider,
    AdminRepositoryProvider,
    UserRepositoryProvider,
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
