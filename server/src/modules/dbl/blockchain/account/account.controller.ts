import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlockchainAccountService } from './account.service';

@Controller('blockchain/account')
@ApiTags('Blockchain', 'BlockchainAccount')
export class BlockchainAccountController {
  constructor(private readonly blockchainAccountService: BlockchainAccountService) {}
}
