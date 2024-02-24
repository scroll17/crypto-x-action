/*external modules*/
import { IsArray, IsNotEmpty, IsNumber, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MultipleAddressesReportDto {
  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 2359.23,
    description: 'The ETH price in USD',
  })
  readonly ethPrice: number;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @ApiProperty({
    type: [String],
    example: ['0x4A24FE8E61E0b57529B6642293626aFD407b03c9', '0x4A24FE8E61E0b57529B6642293626aFD407b03c9'],
    description: 'The array of blockchain addresses',
  })
  readonly addresses: string[];
}
