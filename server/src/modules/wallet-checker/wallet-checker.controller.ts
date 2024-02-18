import { Controller, Get, HttpCode, HttpStatus, ParseBoolPipe, Query } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WalletCheckerService } from './wallet-checker.service';
import { AuthUser } from '@common/decorators';

@Controller('wallet-checker')
@ApiTags('WalletChecker')
export class WalletCheckerController {
  constructor(private readonly walletCheckerService: WalletCheckerService) {}

  @Get('/networks')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get all Networks.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Array of Networks names',
    type: [String],
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  @ApiQuery({
    name: 'onlyActive',
    type: Boolean,
    description: 'Describe does need show all Networks or only active',
  })
  async getNetworks(@Query('onlyActive', ParseBoolPipe) onlyActive: boolean) {
    return this.walletCheckerService.getNetworks(onlyActive);
  }
}
