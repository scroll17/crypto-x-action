import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseBlockScoutService } from './base-block-scout.service';
import { IntegrationNames } from '@common/integrations/common';
import { DevEndpoint } from '@common/decorators';

@Controller(`integrations/${IntegrationNames.BaseBlockScout}`)
@ApiTags(`Integrations: "${IntegrationNames.BaseBlockScout}"`)
export class BaseBlockScoutController {
  constructor(private readonly baseBlockScoutService: BaseBlockScoutService) {}

  @Get('/stats')
  @DevEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Blockchain stats info.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Object with Blockchain stats info.',
    schema: {
      type: 'object',
    },
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getStats() {
    return this.baseBlockScoutService.getStats();
  }

  @Get('/address/:hash')
  @DevEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Address info in Blockchain.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Object with Address info.',
    schema: {
      type: 'object',
    },
  })
  @ApiParam({ name: 'hash', type: String })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getAddress(@Query('hash') hash: string) {
    return this.baseBlockScoutService.getAddress(hash);
  }

  @Get('/token-balances/:hash')
  @DevEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get Address token balances info in Blockchain.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Array with token balances info by Address.',
    schema: {
      type: 'array',
    },
  })
  @ApiParam({ name: 'hash', type: String })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getTokenBalances(@Query('hash') hash: string) {
    return this.baseBlockScoutService.getTokenBalances(hash);
  }
}
