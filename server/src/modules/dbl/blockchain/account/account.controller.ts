import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
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
}
