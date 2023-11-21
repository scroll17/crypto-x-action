/*external modules*/
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommentDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'Some text here..',
  })
  readonly text: string;
}
