import { Module } from '@nestjs/common';
import { BlockchainAccountService } from './account.service';
import { BlockchainAccountController } from './account.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  BlockchainAccount,
  BlockchainAccountSchema,
  BlockchainNetwork,
  BlockchainNetworkSchema,
} from '@schemas/index';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BlockchainAccount.name,
        schema: BlockchainAccountSchema,
      },
      {
        name: BlockchainNetwork.name,
        schema: BlockchainNetworkSchema,
      },
    ]),
  ],
  providers: [BlockchainAccountService],
  controllers: [BlockchainAccountController],
})
export class BlockchainAccountModule {}
