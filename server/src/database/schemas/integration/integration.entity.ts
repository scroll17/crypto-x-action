import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Integration } from './integration.schema';
import { IntegrationNames } from '@common/integrations/common';

export class IntegrationEntity implements Integration {
  @ApiProperty({
    type: String,
    example: '5349b4ddd2781d08c09890f4',
    description: 'The entity ID in the MongoDB ObjectId string view',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    enum: Object.values(IntegrationNames),
    example: IntegrationNames.CryptoCompare,
    description: 'The Integration unique key',
  })
  key: IntegrationNames;

  @ApiProperty({
    type: String,
    example: 'CryptoCompare',
    description: 'The name of Integration',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'https://min-api.cryptocompare.com',
    description: 'The Integration url',
  })
  apiUrl: string;

  @ApiProperty({
    type: String,
    example: 'The service which provide Symbols price',
    description: 'The Integration description',
  })
  description: string;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'The Integration active status',
  })
  active: boolean;
}
