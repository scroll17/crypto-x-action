import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ZkSyncBlockExplorerService } from './zk-sync-block-explorer.service';
import { IntegrationNames } from '@common/integrations/common';
import { DevEndpoint } from '@common/decorators';

@Controller(`integrations/${IntegrationNames.ZkSyncBlockExplorer}`)
@ApiTags(`Integrations: "${IntegrationNames.ZkSyncBlockExplorer}"`)
export class ZkSyncBlockExplorerController {
  constructor(private readonly zkSyncBlockExplorerService: ZkSyncBlockExplorerService) {}

  @Get('/eth-price')
  @DevEndpoint()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get latest price of ETH coin in USD.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Latest price of ETH coin in USD.',
    schema: {
      type: 'object',
    },
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getEthPrice() {
    return this.zkSyncBlockExplorerService.getEthPrice();
  }
}
