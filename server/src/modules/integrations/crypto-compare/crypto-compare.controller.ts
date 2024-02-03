import { Controller, Get, HttpCode, HttpStatus, ParseArrayPipe, ParseBoolPipe, Query } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CryptoCompareService } from './crypto-compare.service';
import { DevEndpoint } from '@common/decorators';
import { IntegrationNames } from '@common/integrations/common';

@Controller(`integrations/${IntegrationNames.CryptoCompare}`)
@ApiTags(`Integrations: "${IntegrationNames.CryptoCompare}"`)
export class CryptoCompareController {
  constructor(private readonly cryptoCompareService: CryptoCompareService) {}

  @Get('/prices')
  @DevEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'fromSymbol', type: String })
  @ApiQuery({ name: 'toSymbols', type: [String] })
  @ApiQuery({ name: 'cache', type: Boolean })
  @ApiOperation({ summary: 'Get Symbols Price comparison.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Object with compared Symbols price.',
    schema: {
      type: 'object',
    },
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getPrices(
    @Query('fromSymbol') fromSymbol: string,
    @Query('toSymbols', ParseArrayPipe) toSymbols: string[],
  ) {
    return this.cryptoCompareService.getPrices(fromSymbol, toSymbols);
  }

  @Get('/price')
  @DevEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiQuery({ name: 'fromSymbol', type: String })
  @ApiQuery({ name: 'toSymbol', type: String })
  @ApiQuery({ name: 'useCache', type: Boolean })
  @ApiOperation({ summary: 'Get Symbol Price comparison.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Number or Null of compared Symbol price.',
    type: Number,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getPrice(
    @Query('fromSymbol') fromSymbol: string,
    @Query('toSymbol') toSymbol: string,
    @Query('useCache', ParseBoolPipe) useCache: boolean,
  ) {
    return this.cryptoCompareService.getPrice(fromSymbol, toSymbol, useCache);
  }
}
