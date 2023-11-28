import { Module } from '@nestjs/common';
import { StarknetNetworkService } from './starknet.service';
import { StarknetNetworkController } from './starknet.controller';

@Module({
  imports: [],
  providers: [StarknetNetworkService],
  controllers: [StarknetNetworkController],
})
export class StarknetNetworkModule {}
