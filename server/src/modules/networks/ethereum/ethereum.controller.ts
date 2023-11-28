import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { EthereumNetworkService } from './ethereum.service';

@Controller('network/ethereum')
@ApiTags('EthereumNetwork')
export class EthereumNetworkController {
  constructor(private readonly ethereumNetworkService: EthereumNetworkService) {}
}
