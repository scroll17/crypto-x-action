import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseFloatPipe,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { DevEndpoint } from '@common/decorators';
import { LineaExplorerService } from './linea-explorer.service';
import { IntegrationNames } from '@common/integrations/common';
import { MultipleAddressesReportDto } from './dto/multiple-addresses-report.dto';

@Controller(`integrations/${IntegrationNames.LineaExplorer}`)
@ApiTags(`Integrations: "${IntegrationNames.LineaExplorer}"`)
export class LineaExplorerController {
  constructor(private readonly lineaExplorerService: LineaExplorerService) {}

  @Get('/total-fees')
  @DevEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Gets total transaction fees in Wei are paid by users to validators per day.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Total transaction fees in Wei are paid by users to validators per day.',
    schema: {
      type: 'object',
    },
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getTotalFees() {
    return this.lineaExplorerService.getTotalFees();
  }

  @Get('/coin-price')
  @DevEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get latest price of native coin in USD and BTC.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Latest price of native coin in USD and BTC.',
    schema: {
      type: 'object',
    },
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getCoinPrice() {
    return this.lineaExplorerService.getCoinPrice();
  }

  @Get('/token-balance')
  @DevEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Token balance by Address & Contract in Blockchain.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Object with balance.',
    schema: {
      type: 'object',
    },
  })
  @ApiQuery({ name: 'address', type: String })
  @ApiQuery({ name: 'contract', type: String })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getTokenBalance(@Query('address') address: string, @Query('contract') contract: string) {
    return this.lineaExplorerService.getTokenBalance(address, contract);
  }

  @Get('/address-balance/:hash')
  @DevEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Address balance in Blockchain.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Object with Address balance.',
    schema: {
      type: 'object',
    },
  })
  @ApiParam({ name: 'hash', type: String })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getAccountBalance(@Param('hash') hash: string) {
    return this.lineaExplorerService.getAddressBalance(hash);
  }

  @Get('/transactions/:hash')
  @DevEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Address transactions in Blockchain.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Array of Address transactions.',
    schema: {
      type: 'object',
    },
  })
  @ApiParam({ name: 'hash', type: String })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getAddressTransactions(@Param('hash') hash: string) {
    return this.lineaExplorerService.getAddressTransactions(hash);
  }

  @Get('/transactions-stat/:hash')
  @DevEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Address transactions statistics info in Blockchain.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Object with transactions stat info by Address.',
    schema: {
      type: 'array',
    },
  })
  @ApiParam({ name: 'hash', type: String })
  @ApiQuery({ name: 'ethPrice', type: Number })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getTransactionsStat(
    @Param('hash') hash: string,
    @Query('ethPrice', ParseFloatPipe) ethPrice: number,
  ) {
    return this.lineaExplorerService.getTransactionsStat(hash, ethPrice);
  }

  @Get('/address-report/:hash')
  @DevEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Address report (balance, transactions) in Blockchain.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Object with Address report info.',
  })
  @ApiParam({ name: 'hash', type: String })
  @ApiQuery({ name: 'ethPrice', type: Number })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getAddressReport(@Param('hash') hash: string, @Query('ethPrice', ParseFloatPipe) ethPrice: number) {
    return this.lineaExplorerService.getAddressReport(hash, ethPrice);
  }

  @Post('/multiple-addresses-report')
  @DevEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Multiple Addresses report (balance, transactions) in Blockchain.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Object with Multiple Addresses.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getMultipleAddressesReport(@Body() dto: MultipleAddressesReportDto) {
    return this.lineaExplorerService.getMultipleAddressesReport(dto.addresses, dto.ethPrice);
  }
}
