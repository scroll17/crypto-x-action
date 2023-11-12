import { Module } from '@nestjs/common';
import { BlockchainAccountService } from './account.service';
import { BlockchainAccountController } from './account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockchainAccount, BlockchainAccountSchema } from '@schemas/index';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BlockchainAccount.name,
        schema: BlockchainAccountSchema,
      },
    ]),
  ],
  providers: [BlockchainAccountService],
  controllers: [BlockchainAccountController],
})
export class BlockchainAccountModule {}
