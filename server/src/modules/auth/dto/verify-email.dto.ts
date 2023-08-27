/*external modules*/
import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class VerifyEmailDto {
  @IsNumber()
  @IsNotEmpty()
  @ApiProperty({ example: 12345 })
  readonly code: number;
}
