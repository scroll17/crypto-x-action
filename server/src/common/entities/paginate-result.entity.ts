import { ApiProperty } from '@nestjs/swagger';
import { PaginateMetaResultEntity } from './paginate-meta-result.entity';

export class PaginateResultEntity<TEntity> {
  readonly data: TEntity[];

  @ApiProperty({
    type: PaginateMetaResultEntity,
    description: 'Meta information about selection result',
  })
  readonly meta: PaginateMetaResultEntity;
}
