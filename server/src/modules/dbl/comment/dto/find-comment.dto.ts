/*external modules*/
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { CommentFilterDto } from './comment-filter.dto';
import { FindDto } from '@common/dto';

export class FindCommentDto extends FindDto<CommentFilterDto> {
  @IsOptional()
  @Type(() => CommentFilterDto)
  @ValidateNested()
  @ApiProperty({
    type: CommentFilterDto,
  })
  declare readonly filter?: CommentFilterDto;
}
