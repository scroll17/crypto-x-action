import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { BotUpdate } from './bot.update';
import { ProtectionModule } from '../../../protection/protection.module';
import {
  MarkdownHelper,
  TelegrafMessageHelper,
} from '@common/telegram/helpers';
import { TelegramNotificationBotService } from '../../notification/notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user';

@Module({
  imports: [
    ProtectionModule,
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  providers: [
    BotService,
    BotUpdate,
    MarkdownHelper,
    TelegrafMessageHelper,
    TelegramNotificationBotService,
  ],
  exports: [BotService, TelegramNotificationBotService, MarkdownHelper],
})
export class BotModule {}
