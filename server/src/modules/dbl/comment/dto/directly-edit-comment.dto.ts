/*external modules*/
import { IsOptional, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class DirectlyEditCommentDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiProperty({
    type: String,
    example: 'The comment about...',
  })
  readonly text?: string;
}
