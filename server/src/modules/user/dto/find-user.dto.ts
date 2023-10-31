/*external modules*/
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { UserFilterDto } from './user-filter.dto';
import { FindDto } from '@common/dto';

export class FindUserDto extends FindDto<UserFilterDto> {
  @IsOptional()
  @Type(() => UserFilterDto)
  @ValidateNested()
  @ApiProperty({
    type: UserFilterDto,
  })
  declare readonly filter?: UserFilterDto;
}
