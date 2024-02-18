import { Controller, Get, HttpCode, HttpStatus, Param } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
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
    return this.zkSyncBlockExplorerService.getAddressBalance(hash);
  }
}
