import { UserEntity } from '@entities/user/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserWentFrom } from '@entities/user/user-went-from.enum';
import { BaseEntity } from 'typeorm';

export class UserModel
  implements
    Omit<Omit<UserEntity, keyof BaseEntity>, 'password' | 'tokens' | 'hashPassword' | 'comparePassword' | 'toJSON'>
{
  @ApiProperty({
    type: Number,
    example: 35343,
    description: 'The entity ID',
  })
  id: number;

  @ApiProperty({
    type: String,
    example: 'John',
    description: 'The user first name',
  })
  firstName: string;

  @ApiProperty({
    type: String,
    example: 'Doe',
    description: 'The user last name',
  })
  lastName: string;

  @ApiPropertyOptional()
  @ApiProperty({
    type: String,
    example: 'test@test.com',
    description: 'The user email',
  })
  email: string | null;

  @ApiPropertyOptional()
  @ApiProperty({
    type: String,
    example: '+380962446722',
    description: 'The user phone',
  })
  phone: string | null;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Have user made email confirmation',
  })
  verified: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Is user blocked by Admin',
  })
  blocked: boolean;

  @ApiProperty({
    type: Boolean,
    example: false,
    description: 'Is user deleted',
  })
  deleted: boolean;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Is user has access to bot',
  })
  hasBotAccess: boolean;

  @ApiProperty({
    type: String,
    example: '117864272370217919267',
    description: 'Is user telegramId',
  })
  telegramId: string;

  @ApiProperty({
    type: String,
    required: false,
    example: '117864272370217919267',
    description: 'Is user googleId',
  })
  googleId: string | null;

  @ApiProperty({
    type: String,
    required: false,
    example: '117864213121919267',
    description: 'Is user facebookId',
  })
  facebookId: string | null;

  @ApiProperty({
    enum: Object.values(UserWentFrom),
    example: 'Manual',
    description: 'Where from user went to here',
  })
  wentFrom: UserWentFrom;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: '2023-03-21T17:32:28Z',
    description: 'When user was created',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: '2023-03-22T17:32:28Z',
    description: 'When user was last time updated',
  })
  updatedAt: Date;

  @ApiPropertyOptional()
  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: '2023-03-27T17:32:28Z',
    description: 'When user was deleted',
  })
  deletedAt: Date | null;
}
