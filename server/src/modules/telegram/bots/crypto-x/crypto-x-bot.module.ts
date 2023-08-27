import { Module } from '@nestjs/common';
import { CryptoXBotService } from './crypto-x-bot.service';
import { CryptoXBotUpdate } from './crypto-x-bot.update';
import { ProtectionModule } from '../../../protection/protection.module';

@Module({
  imports: [ProtectionModule],
  providers: [CryptoXBotService, CryptoXBotUpdate],
  exports: [CryptoXBotService],
})
export class CryptoXBotModule {}
