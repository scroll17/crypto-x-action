import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
}
