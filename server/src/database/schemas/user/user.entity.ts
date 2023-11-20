import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { User } from './user.schema';

export class UserEntity implements User {
  @ApiProperty({
    type: String,
    example: '5349b4ddd2781d08c09890f4',
    description: 'The entity ID in the MongoDB ObjectId string view',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    example: 'Angel',
    description: 'The name of User',
  })
  name: string;

  @ApiPropertyOptional()
  @ApiProperty({
    type: String,
    example: '_Angel_',
    description: 'The username in Telegram of User',
  })
  username: string;

  @ApiProperty({
    type: String,
    example: 'test@test.com',
    description: 'The email of User',
  })
  email: string;

  @ApiProperty({
    type: Number,
    example: 345_345_345,
    description: 'Is user telegramId',
  })
  telegramId: number;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Is user has access to the system',
  })
  blocked: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Is user has access to bot',
  })
  hasBotAccess: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Is user Admin',
  })
  isAdmin: boolean;

  @ApiPropertyOptional()
  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: '2023-03-27T17:32:28Z',
    description: 'Time when user had last activity',
  })
  lastActivityAt: Date;
}
