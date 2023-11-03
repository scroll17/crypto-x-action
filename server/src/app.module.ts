import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import cors from 'cors';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { configuration } from './config/configuration';
import { usersConfiguration } from './config/users-configuration';
import { TelegramModule } from './modules/telegram/telegram.module';
import { SeedsModule } from './modules/seeds/seeds.module';
import { RedisModule } from './modules/redis/redis.module';
import { JobModule } from './modules/job/job.module';
import { AdminModule } from './modules/admin/admin.module';
import { NgrokModule } from './modules/ngrok/ngrok.module';
import { IpHelper } from '@common/helpers';
import { AppGetaway } from './app.getaway';
import { LoggingInterceptor } from '@common/interceptors';
import { ProtectionModule } from './modules/protection/protection.module';
import { DebankModule } from './modules/integrations/debank/debank.module';
import { UserModule } from './modules/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [configuration, usersConfiguration],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: function (configService: ConfigService) {
        const dbName = configService.getOrThrow('mongo.name');
        this.connectionName = dbName;

        return {
          uri: `mongodb://${configService.getOrThrow('mongo.host')}`,
          dbName: dbName,
          user: configService.getOrThrow('mongo.username'),
          pass: configService.getOrThrow('mongo.password'),
          authSource: dbName,
          replicaSet: 'rs0',
          retryAttempts: 3,
          retryDelay: 500,
          connectTimeoutMS: 3000,
        };
      },
    }),
    EventEmitterModule.forRoot({
      wildcard: true,
      delimiter: '.',
      maxListeners: 5,
      verboseMemoryLeak: true,
      ignoreErrors: false,
    }),
    SeedsModule,
    RedisModule, // global
    NgrokModule, // global
    JobModule, // global
    ProtectionModule, // global
    TelegramModule,
    AdminModule,
    UserModule,
    DebankModule,
  ],
  controllers: [],
  providers: [
    IpHelper,
    AppGetaway,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  private readonly logger = new Logger(this.constructor.name);

  constructor(private configService: ConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    const logsEnabled = this.configService.get('logs.origin');
    const whitelist = this.configService.get('security.corsWhiteList');

    consumer
      .apply(
        cors({
          methods: ['HEAD', 'PUT', 'PATCH', 'POST', 'GET', 'DELETE', 'OPTIONS'],
          allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf-token', 'x-forwarded-for'],
          exposedHeaders: ['*', 'Authorization', 'x-forwarded-for'],
          preflightContinue: false,
          credentials: true,
          origin: (origin, callback) => {
            if (logsEnabled)
              this.logger.debug('Request from origin:', {
                origin: origin ?? typeof origin,
                serverConfig: {
                  whitelist,
                },
              });

            if (whitelist.includes('*')) {
              callback(null, true);
              return;
            }

            // Note: "!origin" -> for server requests
            if (whitelist.includes(origin) || !origin) {
              callback(null, true);
            } else {
              this.logger.error('Request from not allowed CORS');

              callback(new HttpException('Not allowed by CORS', HttpStatus.FORBIDDEN));
            }
          },
        }),
      )
      .exclude({ path: '/admin/jobs/api/queues', method: RequestMethod.ALL })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
