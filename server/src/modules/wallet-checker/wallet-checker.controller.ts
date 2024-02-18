import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WalletCheckerService } from './wallet-checker.service';

@Controller('wallet-checker')
@ApiTags('WalletChecker')
export class WalletCheckerController {
  constructor(private readonly walletCheckerService: WalletCheckerService) {}
}
