import { IsNotEmpty, IsNumber, IsPositive, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class PaginateDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    example: 1,
  })
  readonly page: number;

  @IsNumber()
  @IsPositive()
  @Min(1)
  @IsNotEmpty()
  @ApiProperty({
    type: Number,
    example: 10,
  })
  readonly count: number;
}
