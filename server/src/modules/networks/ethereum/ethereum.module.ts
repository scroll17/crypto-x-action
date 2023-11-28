import { Module } from '@nestjs/common';
import { EthereumNetworkService } from './ethereum.service';
import { EthereumNetworkController } from './ethereum.controller';

@Module({
  imports: [],
  providers: [EthereumNetworkService],
  controllers: [EthereumNetworkController],
})
export class EthereumNetworkModule {}
