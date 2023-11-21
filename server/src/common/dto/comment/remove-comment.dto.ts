/*external modules*/
import { IsNotEmpty } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { CommentEntity } from '@schemas/comment';
import { Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export class RemoveCommentDto extends PickType(CommentEntity, ['_id']) {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform(({ value }) => {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid ObjectId');
    }

    return new Types.ObjectId(value);
  })
  readonly id: Types.ObjectId;
}
