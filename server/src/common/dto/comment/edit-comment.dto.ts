/*external modules*/
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { CommentEntity } from '@schemas/comment';
import { Type } from 'class-transformer';
import { EditAction } from '@common/enums';
import { CreateCommentDto, RemoveCommentDto } from '@common/dto';
import { EditPropertyDto } from '../edit-property.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

export class EditCommentDto extends EditPropertyDto<CommentEntity> {
  @IsNotEmpty()
  @Type((obj) => {
    if (!obj) {
      throw new HttpException('Body is required', HttpStatus.BAD_REQUEST);
    }

    const { action } = obj.object as EditPropertyDto<void>;
    return action === EditAction.Add ? CreateCommentDto : RemoveCommentDto;
  })
  @ValidateNested()
  @ApiProperty({
    oneOf: [{ $ref: getSchemaPath(CreateCommentDto) }, { $ref: getSchemaPath(RemoveCommentDto) }],
  })
  declare readonly value: CommentEntity;
}
