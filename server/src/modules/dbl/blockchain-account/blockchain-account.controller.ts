import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlockchainAccountService } from './blockchain-account.service';

@Controller('blockchain-account')
@ApiTags('BlockchainAccount')
export class BlockchainAccountController {
  constructor(private readonly blockchainAccountService: BlockchainAccountService) {}
}
