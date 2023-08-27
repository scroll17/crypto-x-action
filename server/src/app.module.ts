/*external modules*/
import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
/*modules*/
import { RedisModule } from './modules/redis/redis.module';
import { NgrokModule } from './modules/ngrok/ngrok.module';
import { AuthModule } from './modules/auth/auth.module';
import { AdminModule } from './modules/admin/admin.module';
import { UserModule } from './modules/user/user.module';
import { SeedModule } from './modules/seed/seed.module';
import { TelegramModule } from './modules/telegram/telegram.module';
import { DebankModule } from './modules/integrations/debank/debank.module';
import { ProtectionModule } from './modules/protection/protection.module';
import { DatabaseModule } from './modules/database/database.module';
/*services*/
/*controllers*/
/*@entities*/
import { UserEntity } from '@entities/user';
import { AccessTokenEntity } from '@entities/accessToken';
import { AdminEntity } from '@entities/admin';
/*@common*/
import { LoggingInterceptor } from '@common/interceptors';
/*other*/
import { configuration } from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          type: 'postgres',
          url: configService.getOrThrow('postgres.url'),
          entities: [UserEntity, AccessTokenEntity, AdminEntity],
          logging: true,
          synchronize: configService.getOrThrow('database.syncEntities'),
          autoLoadEntities: configService.getOrThrow('database.autoLoadEntities'),
        };
      },
      inject: [ConfigService],
    }),
    DatabaseModule,
    RedisModule, // Global
    NgrokModule, // Global
    ProtectionModule, // Global
    AuthModule,
    AdminModule,
    UserModule,
    SeedModule,
    TelegramModule,
    DebankModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule {}
