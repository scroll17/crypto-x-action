import { Module } from '@nestjs/common';
import { BlockchainAccountService } from './blockchain-account.service';
import { BlockchainAccountController } from './blockchain-account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockChainAccount, BlockchainAccountSchema } from '@schemas/index';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BlockChainAccount.name,
        schema: BlockchainAccountSchema,
      },
    ]),
  ],
  providers: [BlockchainAccountService],
  controllers: [BlockchainAccountController],
})
export class BlockchainAccountModule {}
