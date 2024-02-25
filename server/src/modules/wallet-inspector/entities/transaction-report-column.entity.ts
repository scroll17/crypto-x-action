import { ApiProperty } from '@nestjs/swagger';

export class TransactionReportColumnEntity {
  @ApiProperty({
    type: Number,
    example: 1,
    description: 'The column position in the table',
  })
  index: number;

  @ApiProperty({
    type: String,
    example: 'eth',
    description: 'The field name from the server',
  })
  fieldName: string;

  @ApiProperty({
    type: String,
    example: 'ETH',
    description: 'The column name in the UI',
  })
  columnName: string;

  @ApiProperty({
    type: String,
    example: 'ETH Balance',
    description: 'The column name when user focus on the text in the UI',
  })
  focusName: string;
}
