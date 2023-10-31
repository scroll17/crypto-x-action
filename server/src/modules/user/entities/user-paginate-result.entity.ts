import { ApiProperty } from '@nestjs/swagger';
import { UserEntity } from '@schemas/user';
import { PaginateResultEntity } from '@common/entities';

export class UserPaginateResultEntity extends PaginateResultEntity<UserEntity> {
  @ApiProperty({
    type: [UserEntity],
    description: 'Array of users',
  })
  declare readonly data: UserEntity[];
}
