import { ApiProperty } from '@nestjs/swagger';
import { PaginateResultEntity } from '@common/entities';
import { BlockchainAccountEntity } from '@schemas/blockcain/account';

export class BlockchainAccountPaginateResultEntity extends PaginateResultEntity<BlockchainAccountEntity> {
  @ApiProperty({
    type: [BlockchainAccountEntity],
    description: 'Array of blockchain accounts',
  })
  declare readonly data: BlockchainAccountEntity[];
}
