import { BaseEntity } from 'typeorm';
import { AccessTokenEntity } from '@entities/accessToken/accessToken.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Lookup } from 'geoip-lite';

export class AccessTokenModel implements Omit<AccessTokenEntity, keyof BaseEntity> {
  @ApiProperty({
    type: Number,
    example: 35343,
    description: 'The entity ID',
  })
  id: number;

  @ApiProperty({
    type: String,
    example: '54.37.7.108',
    description: 'The IP address where user logged in',
  })
  logFromIP: string;

  @ApiPropertyOptional()
  @ApiProperty({
    type: 'object',
    example: {
      range: [908394496, 908396543],
      country: 'GB',
      region: '',
      eu: '1',
      timezone: 'Europe/London',
      city: '',
      ll: [51.4964, -0.1224],
      metro: 0,
      area: 500,
    },
    description: 'The detail IP address lookup object',
  })
  logFrom: Lookup | null;

  @ApiPropertyOptional()
  @ApiProperty({
    type: Number,
    example: 12,
    description: 'The user ID ref',
  })
  userId: number | null;

  @ApiPropertyOptional()
  @ApiProperty({
    type: Number,
    example: 12,
    description: 'The admin ID ref',
  })
  adminId: number | null;

  @ApiProperty({
    type: Number,
    example: 320000,
    description: 'The token live in the second',
  })
  liveTime: number;

  @ApiPropertyOptional()
  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: '2023-03-27T17:32:28Z',
    description: 'Time when user / admin had last activity',
  })
  lastUsedAt: Date | null;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: '2023-03-22T17:32:28Z',
    description: 'When token was created',
  })
  createdAt: Date;
}
