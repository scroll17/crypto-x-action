import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CryptoXBotModule } from './bots/crypto-x/crypto-x-bot.module';

@Module({
  imports: [
    CryptoXBotModule,
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: function (configService: ConfigService) {
        this.botName = configService.get('telegram.botName');

        return {
          token: configService.getOrThrow('telegram.token'),
          include: [CryptoXBotModule],
        };
      },
    }),
  ],
  exports: [CryptoXBotModule],
})
export class TelegramModule {}
