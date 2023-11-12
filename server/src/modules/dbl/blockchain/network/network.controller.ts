import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BlockchainNetworkService } from './network.service';
import { AuthUser } from '@common/decorators';
import { BlockchainNetworkPaginateResultEntity } from './entities';
import { FindBlockchainNetworkDto } from './dto';

@Controller('blockchain/network')
@ApiTags('Blockchain', 'BlockchainNetwork')
export class BlockchainNetworkController {
  constructor(private readonly blockchainNetworkService: BlockchainNetworkService) {}

  @Post('/all')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get all registered blockchain networks.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginate of blockchain networks result.',
    type: BlockchainNetworkPaginateResultEntity,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getAll(@Body() dto: FindBlockchainNetworkDto) {
    return this.blockchainNetworkService.getAll(dto);
  }
}
