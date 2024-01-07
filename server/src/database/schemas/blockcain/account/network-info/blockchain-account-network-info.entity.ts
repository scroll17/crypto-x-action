import { ApiProperty } from '@nestjs/swagger';
import { BlockchainAccountNetworkInfo } from './blockchain-account-network-info.schema';
import { BlockchainNetworkPrototypeLevel } from '@common/blockchain/enums';

export class BlockchainAccountNetworkInfoEntity implements BlockchainAccountNetworkInfo {
  @ApiProperty({
    type: String,
    example: 'The network name called by Provider',
  })
  name: string;

  @ApiProperty({
    enum: Object.values(BlockchainNetworkPrototypeLevel),
    example: BlockchainNetworkPrototypeLevel.MainNet,
    description: 'This describes the type of Blockchain network',
  })
  type: BlockchainNetworkPrototypeLevel;

  @ApiProperty({
    type: String,
    example: 'https://mainnet.infura.io/ws/v3/234234234234234',
  })
  url: string;
}
