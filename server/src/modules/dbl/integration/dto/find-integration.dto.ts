/*external modules*/
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IntegrationFilterDto } from './integration-filter.dto';
import { FindDto } from '@common/dto';

export class FindIntegrationDto extends FindDto<IntegrationFilterDto> {
  @IsOptional()
  @Type(() => IntegrationFilterDto)
  @ValidateNested()
  @ApiProperty({
    type: IntegrationFilterDto,
  })
  declare readonly filter?: IntegrationFilterDto;
}
