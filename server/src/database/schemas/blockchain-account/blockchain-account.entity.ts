import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { BlockChainAccount } from './blockchain-account.schema';
import { UserEntity } from '@schemas/user';
import { CommentEntity } from '@schemas/comment';
import { BlockchainNetworks } from '@common/blockchain/enums';

export class BlockchainAccountEntity implements BlockChainAccount {
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
    enum: Object.values(BlockchainNetworks),
    example: BlockchainNetworks.Ethereum,
    description: 'The Blockchain network where this Account exists',
  })
  network: BlockchainNetworks;

  @ApiProperty({
    type: [String],
    example: ['grey', 'hot'],
    description: 'The array of labels which can be used as groups for Accounts',
  })
  labels: string[];

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
