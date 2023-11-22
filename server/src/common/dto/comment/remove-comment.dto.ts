/*external modules*/
import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export class RemoveCommentDto {
  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform(({ value }) => {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid ObjectId');
    }

    return new Types.ObjectId(value);
  })
  @ApiProperty({
    type: String,
    example: '5349b4ddd2781d08c09890f4',
    description: 'The entity ID in the MongoDB ObjectId string view',
  })
  readonly id: Types.ObjectId;
}
