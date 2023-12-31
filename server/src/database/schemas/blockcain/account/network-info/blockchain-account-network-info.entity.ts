import { ApiProperty } from '@nestjs/swagger';
import { BlockchainAccountNetworkInfo } from './blockchain-account-network-info.schema';
import { BlockchainNetworkType } from '@common/blockchain';

export class BlockchainAccountNetworkInfoEntity implements BlockchainAccountNetworkInfo {
  @ApiProperty({
    type: String,
    example: 'The network name called by Provider',
  })
  name: string;

  @ApiProperty({
    enum: Object.values(BlockchainNetworkType),
    example: BlockchainNetworkType.MainNet,
    description: 'This describes the type of Blockchain neetwork',
  })
  type: BlockchainNetworkType;

  @ApiProperty({
    type: String,
    example: 'https://mainnet.infura.io/ws/v3/234234234234234',
  })
  url: string;
}
