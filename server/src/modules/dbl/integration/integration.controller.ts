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
import { IntegrationService } from './integration.service';
import { AuthUser } from '@common/decorators';
import { ParseObjectIdPipe } from '@common/pipes';
import { IntegrationEntity } from '@schemas/integration';
import { FindIntegrationDto } from './dto';
import { IntegrationPaginateResultEntity } from './entities';

@Controller('integration')
@ApiTags('Integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

  @Post('/all')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get all integrations.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Paginate of integrations result.',
    type: IntegrationPaginateResultEntity,
  })
  @ApiForbiddenResponse({ description: 'Forbidden.' })
  async getAll(@Body() dto: FindIntegrationDto) {
    return this.integrationService.getAll(dto);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  @AuthUser()
  @ApiOperation({ summary: 'Get integration by id.' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The integration by id.',
    type: IntegrationEntity,
  })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  @ApiNotFoundResponse({ description: 'Integration not found' })
  @ApiParam({ name: 'id', type: String, description: 'The ObjectId in the String view' })
  async getById(@Param('id', ParseObjectIdPipe) id: Types.ObjectId) {
    return this.integrationService.getById(id);
  }
}
