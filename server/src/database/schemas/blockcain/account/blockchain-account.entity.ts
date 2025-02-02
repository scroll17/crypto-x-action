import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { BlockchainAccount } from './blockchain-account.schema';
import { UserEntity } from '@schemas/user';
import { CommentEntity } from '@schemas/comment';
import { BlockchainNetworkEntity } from '@schemas/blockcain/network';

export class BlockchainAccountEntity implements BlockchainAccount {
  @ApiProperty({
    type: String,
    example: '5349b4ddd2781d08c09890f4',
    description: 'The entity ID in the MongoDB ObjectId string view',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    example: 'Multi',
    description: 'The unique name of Account',
  })
  name: string;

  @ApiProperty({
    type: [String],
    example: ['grey', 'hot'],
    description: 'The array of labels which can be used as groups for Accounts',
  })
  labels: string[];

  @ApiProperty({
    type: String,
    example: '0x4A24FE8E61E0b57529B6642293626aFD407b03c9',
    description: 'The network shape blockchain account address',
  })
  address: string;

  @ApiPropertyOptional()
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-03-21T17:32:28Z',
    description: 'The time when this Account was removed from config',
  })
  removedAt: Date | null;

  @ApiProperty({
    type: BlockchainNetworkEntity,
    description: 'The Blockchain network record',
  })
  // @ts-ignore
  network: BlockchainNetworkEntity;

  @ApiProperty({
    type: [CommentEntity],
    description: 'The array of Comments',
  })
  // @ts-ignore
  comments: CommentEntity[];

  @ApiProperty({
    type: UserEntity,
    description: 'The ID of the User who created new one',
  })
  // @ts-ignore
  createdBy: UserEntity;
}
