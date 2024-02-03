import { Controller, Get, HttpCode, ParseArrayPipe, ParseBoolPipe, Query } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CryptoCompareService } from './crypto-compare.service';
import { DevEndpoint } from '@common/decorators';
import { IntegrationNames } from '@common/integrations/common';

@Controller(`integrations/${IntegrationNames.CryptoCompare}`)
@ApiTags(`Integrations: "${IntegrationNames.CryptoCompare}"`)
export class CryptoCompareController {
  constructor(private readonly cryptoCompareService: CryptoCompareService) {}

  @Get('/prices')
  @DevEndpoint()
  @HttpCode(200)
  @ApiQuery({ name: 'fromSymbol', type: String })
  @ApiQuery({ name: 'toSymbols', type: [String] })
  @ApiQuery({ name: 'cache', type: Boolean })
  @ApiOperation({ summary: 'Get Symbol Price comparison.' })
  @ApiOkResponse({
    status: 200,
    description: 'Object with compared Symbols price.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getPrice(
    @Query('fromSymbol') fromSymbol: string,
    @Query('toSymbols', ParseArrayPipe) toSymbols: string[],
    // @Query('cache', ParseBoolPipe) cache: boolean,
  ) {
    return this.cryptoCompareService.getPrices(fromSymbol, toSymbols);
  }
}
