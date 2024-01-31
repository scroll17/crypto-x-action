import { ApiProperty } from '@nestjs/swagger';
import { PaginateResultEntity } from '@common/entities';
import { IntegrationEntity } from '@schemas/integration';

export class IntegrationPaginateResultEntity extends PaginateResultEntity<IntegrationEntity> {
  @ApiProperty({
    type: [IntegrationEntity],
    description: 'Array of integrations',
  })
  declare readonly data: IntegrationEntity[];
}
