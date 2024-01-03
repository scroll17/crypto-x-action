import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Proxy } from './proxy.schema';
import { HttpProtocol } from '@common/enums';

export class ProxyEntity implements Proxy {
  @ApiProperty({
    type: String,
    example: '5349b4ddd2781d08c09890f4',
    description: 'The entity ID in the MongoDB ObjectId string view',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    example: 'Proxy #1',
    description: 'The name of Proxy',
  })
  name: string;

  @ApiProperty({
    type: String,
    example: 'The new Proxy ...',
    description: 'The Proxy description',
  })
  description: string;

  @ApiProperty({
    type: String,
    example: 'testuser',
    description: 'The login to Proxy',
  })
  login: string;

  @ApiProperty({
    type: String,
    example: '123456',
    description: 'The password to Proxy',
  })
  password: string;

  @ApiProperty({
    type: String,
    example: '77.47.245.8',
    description: 'The IP of Proxy',
  })
  ip: string;

  @ApiProperty({
    type: Number,
    example: 59_001,
    description: 'The port of Proxy',
  })
  port: number;

  @ApiProperty({
    enum: Object.values(HttpProtocol),
    example: [HttpProtocol.HTTP],
    isArray: true,
    description: 'This describes the available HTTP protocols for Proxy',
  })
  protocols: HttpProtocol;

  @ApiProperty({
    type: Date,
    format: 'date-time',
    example: '2023-03-27T17:32:28Z',
    description: 'Time when the Proxy will be not available',
  })
  expiredAt: Date;
}
