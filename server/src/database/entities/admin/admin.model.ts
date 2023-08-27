import { BaseEntity } from 'typeorm';
import { AdminEntity } from '@entities/admin/admin.entity';
import { ApiProperty } from '@nestjs/swagger';

export class AdminModel
  implements
    Omit<Omit<AdminEntity, keyof BaseEntity>, 'password' | 'tokens' | 'hashPassword' | 'comparePassword' | 'toJSON'>
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
    description: 'The admin name',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'admin@test.com',
    description: 'The admin email',
  })
  email: string;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: '2023-03-21T17:32:28Z',
    description: 'When admin was created',
  })
  createdAt: Date;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: '2023-03-22T17:32:28Z',
    description: 'When admin was last time updated',
  })
  updatedAt: Date;
}
