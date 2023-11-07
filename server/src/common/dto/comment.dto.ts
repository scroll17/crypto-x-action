/*external modules*/
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CommentDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @ApiProperty({ example: 'Some text here..' })
  readonly text: string;
}
