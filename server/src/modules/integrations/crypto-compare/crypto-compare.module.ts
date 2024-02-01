import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CryptoCompareService } from './crypto-compare.service';
import { CryptoCompareController } from './crypto-compare.controller';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
    }),
  ],
  providers: [CryptoCompareService],
  controllers: [CryptoCompareController],
})
export class CryptoCompareModule {}
