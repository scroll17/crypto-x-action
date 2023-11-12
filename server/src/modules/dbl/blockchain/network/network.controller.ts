import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlockchainNetworkService } from './network.service';

@Controller('blockchain/network')
@ApiTags('Blockchain', 'BlockchainNetwork')
export class BlockchainNetworkController {
  constructor(private readonly blockchainNetworkService: BlockchainNetworkService) {}
}
