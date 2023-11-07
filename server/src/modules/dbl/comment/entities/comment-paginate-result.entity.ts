import { ApiProperty } from '@nestjs/swagger';
import { PaginateResultEntity } from '@common/entities';
import { CommentEntity } from '@schemas/comment';

export class CommentPaginateResultEntity extends PaginateResultEntity<CommentEntity> {
  @ApiProperty({
    type: [CommentEntity],
    description: 'Array of comments',
  })
  declare readonly data: CommentEntity[];
}
