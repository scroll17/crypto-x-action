import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { CryptoCompareService } from './crypto-compare.service';
import { CryptoCompareController } from './crypto-compare.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Integration, IntegrationSchema } from '@schemas/integration';

@Module({
  imports: [
    HttpModule.register({
      maxRedirects: 5,
    }),
    MongooseModule.forFeature([
      {
        name: Integration.name,
        schema: IntegrationSchema,
      },
    ]),
  ],
  providers: [CryptoCompareService],
  controllers: [CryptoCompareController],
})
export class CryptoCompareModule {}