import { ApiProperty } from '@nestjs/swagger';

export class PaginateMetaResultEntity {
  @ApiProperty({
    type: Number,
    example: 10,
    description: 'The total number of records in the DB',
  })
  readonly total: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'The page number of the selected data. (skip = (page - 1) * count)',
  })
  readonly page: number;

  @ApiProperty({
    type: Number,
    example: 10,
    description: 'The values equals to passed "count" argument',
  })
  readonly count: number;

  @ApiProperty({
    type: Number,
    example: 3,
    description: 'The indication which page will be last',
  })
  readonly lastPage: number;
}
