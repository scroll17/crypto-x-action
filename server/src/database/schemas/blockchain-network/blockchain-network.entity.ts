import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { BlockchainNetwork } from './blockchain-network.schema';
import { BlockchainNetworks } from '@common/blockchain/enums';

export class BlockchainNetworkEntity implements BlockchainNetwork {
  @ApiProperty({
    type: String,
    example: '5349b4ddd2781d08c09890f4',
    description: 'The entity ID in the MongoDB ObjectId string view',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    enum: Object.values(BlockchainNetworks),
    example: BlockchainNetworks.Ethereum,
    description: 'The unique name of the Blockchain network',
  })
  name: BlockchainNetworks;

  @ApiProperty({
    type: String,
    example: 'The Ethereum network',
    description: 'The description of the network',
  })
  description: string;
}
