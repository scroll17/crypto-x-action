import { Types } from 'mongoose';
import { ParseObjectIdPipe } from '@common/pipes';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { BlockchainAccountService } from './account.service';
import { AuthUser, CurrentUser } from '@common/decorators';
import { UserDocument } from '@schemas/user';
import { BlockchainAccountEntity } from '@schemas/blockcain/account';
import { AddBlockchainAccountDto, EditBlockchainAccountDto, FindBlockchainAccountDto } from './dto';
import { BlockchainAccountPaginateResultEntity } from './entities';
import { CreateCommentDto, ChangeCommentDto } from '@common/dto';

@Controller('blockchain/account')
@ApiTags('BlockchainAccount')
@ApiExtraModels(CreateCommentDto, ChangeCommentDto)
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
  @ApiForbiddenResponse({ description: 'Account with passed name already exists.' })
  async add(@CurrentUser() user: UserDocument, @Body() dto: AddBlockchainAccountDto) {
    return this.blockchainAccountService.add(user, dto);
  }

  @Patch('/edit')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Update blockchain account by id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Updated Blockchain Account document.',
    type: BlockchainAccountEntity,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Blockchain account not found' })
  @ApiForbiddenResponse({ description: 'Account with passed name already exists.' })
  @ApiQuery({ name: 'id', type: String, description: 'The ObjectId in the String view' })
  async edit(
    @CurrentUser() user: UserDocument,
    @Query('id', ParseObjectIdPipe) id: Types.ObjectId,
    @Body() dto: EditBlockchainAccountDto,
  ) {
    return this.blockchainAccountService.edit(user, id, dto);
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
  async remove(@CurrentUser() user: UserDocument, @Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    await this.blockchainAccountService.remove(user, id);
    return true;
  }
}
