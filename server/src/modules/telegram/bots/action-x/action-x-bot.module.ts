import { Module } from '@nestjs/common';
import { ActionXBotService } from './action-x-bot.service';
import { ActionXBotUpdate } from './action-x-bot.update';
import { ProtectionModule } from '../../../protection/protection.module';
import { MarkdownHelper, TelegrafMessageHelper } from '@common/telegram/helpers';
import { TelegramNotificationBotService } from '../../notification/notification.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '@schemas/user';
import { SetUserSecretWizard } from './scenes';

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
    ActionXBotService,
    ActionXBotUpdate,
    MarkdownHelper,
    TelegrafMessageHelper,
    TelegramNotificationBotService,
    // Scenes
    SetUserSecretWizard,
  ],
  exports: [ActionXBotService, TelegramNotificationBotService, MarkdownHelper],
})
export class ActionXBotModule {}
