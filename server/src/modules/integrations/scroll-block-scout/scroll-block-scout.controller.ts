import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ScrollBlockScoutService } from './scroll-block-scout.service';
import { IntegrationNames } from '@common/integrations/common';
import { DevEndpoint } from '@common/decorators';

@Controller(`integrations/${IntegrationNames.ScrollBlockScout}`)
@ApiTags(`Integrations: "${IntegrationNames.ScrollBlockScout}"`)
export class ScrollBlockScoutController {
  constructor(private readonly scrollBlockScoutService: ScrollBlockScoutService) {}

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
    return this.scrollBlockScoutService.getTotalFees();
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
    return this.scrollBlockScoutService.getCoinPrice();
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
  async getAddress(@Param('hash') hash: string) {
    return this.scrollBlockScoutService.getAccountBalance(hash);
  }
}
