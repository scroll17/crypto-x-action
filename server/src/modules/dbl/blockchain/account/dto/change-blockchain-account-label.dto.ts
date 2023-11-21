/*external modules*/
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChangeBlockchainAccountLabelDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'hot',
    description: 'The lable name here..',
  })
  readonly label: string;
}
