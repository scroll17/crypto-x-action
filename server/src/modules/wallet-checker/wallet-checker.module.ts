import { Module } from '@nestjs/common';
import { WalletCheckerService } from './wallet-checker.service';
import { WalletCheckerController } from './wallet-checker.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Integration, IntegrationSchema } from '@schemas/integration';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Integration.name,
        schema: IntegrationSchema,
      },
    ]),
  ],
  providers: [WalletCheckerService],
  controllers: [WalletCheckerController],
})
export class WalletCheckerModule {}
