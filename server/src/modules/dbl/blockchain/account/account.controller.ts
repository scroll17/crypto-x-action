import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BlockchainAccountService } from './account.service';

@Controller('blockchain-account')
@ApiTags('BlockchainAccount')
export class AccountController {
  constructor(private readonly blockchainAccountService: BlockchainAccountService) {}
}
