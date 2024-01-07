import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { BlockchainNetwork } from './blockchain-network.schema';
import {
  BlockchainNetworkFamily,
  BlockchainNetworkName,
  BlockchainNetworkPrototypeLevel,
} from '@common/blockchain/enums';
import { BlockchainNetworkConnectEntity } from '@schemas/blockcain/network/connect/blockchain-network-connect.entity';

export class BlockchainNetworkEntity implements BlockchainNetwork {
  @ApiProperty({
    type: String,
    example: '5349b4ddd2781d08c09890f4',
    description: 'The entity ID in the MongoDB ObjectId string view',
  })
  _id: Types.ObjectId;

  @ApiProperty({
    type: String,
    example: 'ethereum-goerli',
    description: 'The unique inner key for Blockchain network',
  })
  innerKey: string;

  @ApiProperty({
    enum: Object.values(BlockchainNetworkFamily),
    example: BlockchainNetworkFamily.EVM,
    description: 'The Blockchain network Family',
  })
  family: BlockchainNetworkFamily;

  @ApiProperty({
    enum: Object.values(BlockchainNetworkName),
    example: BlockchainNetworkName.Ethereum,
    description: 'The Blockchain network name',
  })
  name: BlockchainNetworkName;

  @ApiProperty({
    type: String,
    example: 'Goerli',
    description: 'The local Blockchain network name for specific node',
  })
  localName: string;

  @ApiProperty({
    enum: Object.values(BlockchainNetworkPrototypeLevel),
    example: BlockchainNetworkPrototypeLevel.MainNet,
    description: 'The Blockchain prototype level',
  })
  prototypeLevel: BlockchainNetworkPrototypeLevel;

  @ApiProperty({
    type: String,
    example: 'ETH',
    description: 'The specific for Blockchain network main symbol',
  })
  currencySymbol: string;

  @ApiPropertyOptional()
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'The unique ID of Blockchain network',
  })
  networkId: number | null;

  @ApiPropertyOptional()
  @ApiProperty({
    type: String,
    example: 'https://etherscan.io/tx',
    description: 'The site for specific Blockchain scanning, like block inspecting and etc.',
  })
  scan: string | null;

  @ApiProperty({
    type: BlockchainNetworkConnectEntity,
    description: 'The HTTP (based and always required) connect options to client instance of network Node',
  })
  httpConnect: BlockchainNetworkConnectEntity;

  @ApiPropertyOptional()
  @ApiProperty({
    type: BlockchainNetworkConnectEntity,
    description:
      'The Socket (adds additional functionality) connect options to client instance of network Node',
  })
  socketConnect: BlockchainNetworkConnectEntity | null;

  @ApiProperty({
    type: String,
    example: 'The Ethereum network',
    description: 'The description of the network',
  })
  description: string;

  @ApiProperty({
    type: Boolean,
    example: true,
    description: 'Describes does this Network availability for any operations',
  })
  available: boolean;

  @ApiPropertyOptional()
  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023-03-21T17:32:28Z',
    description: 'The time when this Network was removed from config',
  })
  removedAt: Date | null;
}
