import { ApiProperty } from '@nestjs/swagger';
import { PaginateResultEntity } from '@common/entities';
import { BlockchainNetworkEntity } from 'src/database/schemas/blockcain/network';

export class BlockchainNetworkPaginateResultEntity extends PaginateResultEntity<BlockchainNetworkEntity> {
  @ApiProperty({
    type: [BlockchainNetworkEntity],
    description: 'Array of blockchain networks',
  })
  declare readonly data: BlockchainNetworkEntity[];
}
