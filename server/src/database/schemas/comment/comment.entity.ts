import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Comment } from './comment.schema';
import { UserEntity } from '@schemas/user';

export class CommentEntity implements Comment {
  @ApiProperty({
    type: String,
    example: '5349b4ddd2781d08c09890f4',
    description: 'The entity ID in the MongoDB ObjectId string view',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    example: 'Test comment',
    description: 'The data of Comment',
  })
  text: string;

  @ApiProperty({
    type: UserEntity,
  })
  // @ts-ignore
  createdBy: UserEntity;
}