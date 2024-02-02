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
    description: 'The ID of the User who created new one',
  })
  // @ts-ignore
  createdBy: UserEntity;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: '2023-03-22T17:32:28Z',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: '2023-04-22T17:32:28Z',
  })
  updatedAt: Date;
}
