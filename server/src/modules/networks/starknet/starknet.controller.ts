import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StarknetNetworkService } from './starknet.service';

@Controller('network/starknet')
@ApiTags('StarknetNetwork')
export class StarknetNetworkController {
  constructor(private readonly starknetNetworkService: StarknetNetworkService) {}
}
