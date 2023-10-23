import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { BotModule } from './bots/bot/bot.module';

@Module({
  imports: [
    BotModule,
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
          include: botEnabled ? [BotModule] : [],
        };
      },
    }),
  ],
  exports: [BotModule],
})
export class TelegramModule {}
