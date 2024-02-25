import { ApiProperty } from '@nestjs/swagger';

export class TransactionReportItemEntity {
  @ApiProperty({
    type: String,
    example: '0x4A24FE8E61E0b57529B6642293626aFD407b03c9',
    description: 'The network shape blockchain account address',
  })
  address: string;

  @ApiProperty({
    type: String,
    example: '0.0039 ($41)',
    description: 'The total ETH balance by single Address',
  })
  eth: string;

  @ApiProperty({
    type: Number,
    example: 31,
    description: 'The total number of TX by single Address',
  })
  txCount: number;

  @ApiProperty({
    type: String,
    example: '5.22 ($16001)',
    description: 'The total Volume of all transactions by single Address',
  })
  volume: string;

  @ApiProperty({
    type: String,
    example: '0.000075',
    description: 'The total used Gas in ETH of all transactions by single Address',
  })
  gasUsed: string;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'The number of Deployed Contracts by single Address',
  })
  dContracts: number;

  @ApiProperty({
    type: Number,
    example: 12,
    description: 'The number of Unique Contracts was used during all transactions by single Address',
  })
  uContracts: number;

  @ApiProperty({
    type: Number,
    example: 5,
    description: 'The number of Unique Days when transactions were done by single Address',
  })
  uDays: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'The number of Unique Weeks when transactions were done by single Address',
  })
  uWeeks: number;

  @ApiProperty({
    type: Number,
    example: 1,
    description: 'The number of Unique Months when transactions were done by single Address',
  })
  uMonths: number;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '2023/03/21',
    description: 'The time when first transaction was completed by single Address',
  })
  firstTxDate: string;

  @ApiProperty({
    type: String,
    format: 'date-time',
    example: '-',
    description: 'The time when last transaction was completed by single Address',
  })
  lastTxDate: string;

  @ApiProperty({
    type: String,
    example: '0.0345 ($77)',
    description: 'The total paid Fee of all transactions by single Address',
  })
  fee: string;

  @ApiProperty({
    type: String,
    example: '0.00019 ($5)',
    description: 'The total paid Gas price of all transactions by single Address',
  })
  gasPrice: string;
}
