/*external modules*/
import ms from 'ms';
import { Global, MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { AudioConsumer, audioProcessorName, InitLoadSheetConsumer, initLoadSheetName } from './consumers';
import { ReloadSheetConsumer, reloadSheetName } from './static/consumers';
import { JobBoardService } from './board/job-board.service';
import { JobStaticService } from './static/job-static.service';
import { TelegramModule } from '../telegram/telegram.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user';
/*modules*/
/*services*/
/*controllers*/
/*consumers*/

const consumers = [AudioConsumer, InitLoadSheetConsumer];
const staticConsumers = [ReloadSheetConsumer];

const allConsumers = [...consumers, ...staticConsumers];

const buildDefaultJobOptions = (timeout: number, [removeOnComplete = 2, removeOnFail = 2] = []) => ({
  attempts: 1,
  timeout,
  removeOnFail,
  removeOnComplete,
});

@Global()
@Module({
  imports: [
    TelegramModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => {
        return {
          redis: {
            host: configService.get('redis.host'),
            port: configService.get('redis.port'),
          },
          prefix: `${configService.get('env')}:bull`,
        };
      },
      inject: [ConfigService],
    }),
    // BASIC - DEV TEST
    BullModule.registerQueue({
      name: audioProcessorName,
      defaultJobOptions: buildDefaultJobOptions(ms('5s'), [1, 1]),
    }),
    // BASIC - PROD
    BullModule.registerQueue({
      name: initLoadSheetName,
      defaultJobOptions: buildDefaultJobOptions(ms('2.5 hrs')),
    }),
    // STATIC
    BullModule.registerQueue({
      name: reloadSheetName,
      settings: {
        lockDuration: ms('1.5h'),
        maxStalledCount: 0,
      },
      defaultJobOptions: {
        attempts: 2,
        timeout: ms('2.5h'),
        removeOnFail: 2,
        removeOnComplete: 2,
        repeat: {
          cron: '0 3 * * 1-6', // At 03:00 on every day-of-week from Monday through Saturday
        },
        backoff: {
          type: 'fixed',
          delay: ms('10m'),
        },
      },
    }),
  ],
  providers: [...allConsumers, JobBoardService, JobStaticService],
  exports: [BullModule, JobBoardService, ...allConsumers],
})
export class JobModule implements NestModule {
  constructor(private readonly jobBoardService: JobBoardService) {}

  configure(consumer: MiddlewareConsumer) {
    consumer.apply(this.jobBoardService.getRouter()).forRoutes(this.jobBoardService.getBasePath());
  }
}
