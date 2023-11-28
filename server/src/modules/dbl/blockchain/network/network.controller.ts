import { Types } from 'mongoose';
import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BlockchainNetworkService } from './network.service';
import { AuthUser } from '@common/decorators';
import { BlockchainNetworkPaginateResultEntity } from './entities';
import { FindBlockchainNetworkDto } from './dto';
import { ParseObjectIdPipe } from '@common/pipes';
import { BlockchainNetworkEntity } from 'src/database/schemas/blockcain/network';

@Controller('blockchain/network')
@ApiTags('BlockchainNetwork')
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

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get blockchain network by id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The blockchain network by id.',
    type: BlockchainNetworkEntity,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Blockchain network not found' })
  @ApiParam({ name: 'id', type: String, description: 'The ObjectId in the String view' })
  async getById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.blockchainNetworkService.getById(id);
  }
}
