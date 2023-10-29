/*external modules*/
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginateDto, SortDto } from './index';

export class FindDto<TFilter> {
  @IsNotEmpty()
  @Type(() => PaginateDto)
  @ValidateNested()
  @ApiProperty({
    type: PaginateDto,
  })
  readonly paginate: PaginateDto;

  @IsOptional()
  @Type(() => SortDto)
  @ValidateNested()
  @ApiProperty({
    type: SortDto,
  })
  readonly sort?: SortDto;

  readonly filter?: TFilter;
}
