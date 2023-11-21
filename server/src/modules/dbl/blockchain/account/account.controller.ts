import { Types } from 'mongoose';
import { ParseObjectIdPipe } from '@common/pipes';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BlockchainAccountService } from './account.service';
import { AuthUser, CurrentUser } from '@common/decorators';
import { UserDocument } from '@schemas/user';
import { BlockchainAccountEntity } from '@schemas/blockcain/account';
import { CreateBlockchainAccountDto, FindBlockchainAccountDto } from './dto';
import { BlockchainAccountPaginateResultEntity } from './entities';

@Controller('blockchain/account')
@ApiTags('Blockchain', 'BlockchainAccount')
export class BlockchainAccountController {
  constructor(private readonly blockchainAccountService: BlockchainAccountService) {}

  @Post('/add')
  @HttpCode(HttpStatus.CREATED)
  @AuthUser()
  @ApiOperation({ summary: 'Create new blockchain account.' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'New Blockchain Account document.',
    type: BlockchainAccountEntity,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async add(@CurrentUser() user: UserDocument, @Body() dto: CreateBlockchainAccountDto) {
    return this.blockchainAccountService.add(user, dto);
  }

  @Post('/all')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get all blockchain accounts.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginate of blockchain accounts result.',
    type: BlockchainAccountPaginateResultEntity,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getAll(@Body() dto: FindBlockchainAccountDto) {
    return this.blockchainAccountService.getAll(dto);
  }

  @Get('/labels')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get blockchain account unique labels.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The blockchain account unique labels.',
    type: [String],
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async getUniqueLabels() {
    return this.blockchainAccountService.getUniqueLabels();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get blockchain account by id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The blockchain account by id.',
    type: BlockchainAccountEntity,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Blockchain account not found' })
  @ApiParam({ name: 'id', type: String, description: 'The ObjectId in the String view' })
  async getById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.blockchainAccountService.getById(id);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Delete blockchain account by id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The result of deletion.',
    type: Boolean,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Blockchain account not found' })
  @ApiParam({ name: 'id', type: String, description: 'The ObjectId in the String view' })
  async remove(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    await this.blockchainAccountService.remove(id);
    return true;
  }
}
