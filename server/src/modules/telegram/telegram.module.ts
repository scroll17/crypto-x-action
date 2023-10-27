import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ActionXBotModule } from './bots/action-x/action-x-bot.module';

@Module({
  imports: [
    ActionXBotModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: function (configService: ConfigService) {
        this.botName = configService.getOrThrow<string>('telegram.botName');

        const botEnabled = configService.getOrThrow<boolean>(
          'telegram.botEnabled',
        );
        return {
          token: configService.getOrThrow('telegram.token'),
          include: botEnabled ? [ActionXBotModule] : [],
        };
      },
    }),
  ],
  exports: [ActionXBotModule],
})
export class TelegramModule {}
