import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { SortType } from '../enums/rest';

export class SortDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'name',
  })
  readonly name: number;

  @IsEnum(SortType)
  @IsNotEmpty()
  @ApiProperty({
    enum: Object.values(SortType),
    example: SortType.ASC,
  })
  readonly type: SortType;
}
