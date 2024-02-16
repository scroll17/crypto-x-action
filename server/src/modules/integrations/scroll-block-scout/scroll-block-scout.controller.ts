import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
}
