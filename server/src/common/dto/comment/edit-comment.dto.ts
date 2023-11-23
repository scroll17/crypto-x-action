/*external modules*/
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { CreateCommentDto } from './create-comment.dto';
import { ChangeCommentDto } from './change-comment.dto';
import { EditPropertyDto } from '../edit-property.dto';

export class EditCommentDto extends EditPropertyDto<CreateCommentDto | ChangeCommentDto> {
  @IsNotEmpty()
  @Type(() => ChangeCommentDto)
  @ValidateNested()
  @ApiProperty({
    type: [ChangeCommentDto],
  })
  declare readonly value: ChangeCommentDto;
}
