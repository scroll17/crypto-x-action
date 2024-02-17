import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LineaExplorerService } from './linea-explorer.service';
import { IntegrationNames } from '@common/integrations/common';
import { DevEndpoint } from '@common/decorators';

@Controller(`integrations/${IntegrationNames.LineaExplorer}`)
@ApiTags(`Integrations: "${IntegrationNames.LineaExplorer}"`)
export class LineaExplorerController {
  constructor(private readonly lineaExplorerService: LineaExplorerService) {}

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
}
