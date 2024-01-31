import { Types } from 'mongoose';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
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
import { UserPaginateResultEntity } from '../user/entities/user-paginate-result.entity';
import { ParseObjectIdPipe } from '@common/pipes';
import { CommentEntity } from '@schemas/comment';
import { DirectlyEditCommentDto, FindCommentDto } from './dto';
import {IntegrationEntity} from "@schemas/integration";

@Controller('integration')
@ApiTags('Integration')
export class IntegrationController {
  constructor(private readonly integrationService: IntegrationService) {}

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
