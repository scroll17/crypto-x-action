import { Module } from '@nestjs/common';
import { BlockchainNetworkController } from './network.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BlockchainNetwork, BlockchainNetworkSchema } from '@schemas/index';
import { BlockchainNetworkService } from './network.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: BlockchainNetwork.name,
        schema: BlockchainNetworkSchema,
      },
    ]),
  ],
  providers: [BlockchainNetworkService],
  controllers: [BlockchainNetworkController],
})
export class BlockchainNetworkModule {}
