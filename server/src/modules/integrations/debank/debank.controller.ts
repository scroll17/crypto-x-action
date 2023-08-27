import { Controller, Get, HttpCode, ParseBoolPipe, Query, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse, ApiOkResponse, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { DebankService } from './debank.service';
import { SecurityTokenGuard } from '@common/guards';

@Controller('integrations/debank')
@ApiTags('Integrations', 'Debank')
@UseGuards(SecurityTokenGuard)
export class DebankController {
  constructor(private readonly debankService: DebankService) {}

  @Get('/balance-list')
  @HttpCode(200)
  @ApiQuery({ name: 'address', type: String })
  @ApiQuery({ name: 'cache', type: Boolean })
  @ApiOperation({ summary: 'Get current balance by address.' })
  @ApiOkResponse({
    status: 200,
    description: 'Balance list by address.',
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getBalanceList(@Query('address') address: string, @Query('cache', ParseBoolPipe) cache: boolean) {
    return this.debankService.getBalanceList(address, cache);
  }
}
