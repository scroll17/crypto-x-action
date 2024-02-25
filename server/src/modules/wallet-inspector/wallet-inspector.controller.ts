import { Body, Controller, Get, HttpCode, HttpStatus, ParseBoolPipe, Post, Query } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WalletInspectorService } from './wallet-inspector.service';
import { AuthUser } from '@common/decorators';
import { GetTransactionsReportDto } from './dto';

@Controller('wallet-checker')
@ApiTags('WalletChecker')
export class WalletInspectorController {
  constructor(private readonly walletInspectorService: WalletInspectorService) {}

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
    return this.walletInspectorService.getNetworks(onlyActive);
  }

  @Post('/transactions-report')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get Transactions report by Multiple Addresses in Blockchain.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Object Transactions report by Multiple Addresses.',
    type: [String], // TODO
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getMultipleAddressesReport(@Body() dto: GetTransactionsReportDto) {
    return this.walletInspectorService.buildTransactionsReport(dto.network, dto.addresses);
  }
}
