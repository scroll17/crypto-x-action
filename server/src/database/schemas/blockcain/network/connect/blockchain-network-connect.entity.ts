import { ApiProperty } from '@nestjs/swagger';
import { BlockchainNetworkConnect } from './blockchain-network-connect.schema';

export class BlockchainNetworkConnectEntity implements BlockchainNetworkConnect {
  @ApiProperty({
    type: String,
    example: 'https://goerli.infura.io/v3/23e0d4a5f3604c6094d767924',
    description: 'The network rpc url',
  })
  url: string;

  @ApiProperty({
    type: String,
    example: {
      keepAlive: true,
      withCredentials: false,
      timeout: 20_000, // ms
    },
    description: 'The connect options to network node client instance in JSON format',
  })
  connectOptions: string;
}
