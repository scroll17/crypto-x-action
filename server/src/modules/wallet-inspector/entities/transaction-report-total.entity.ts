import { ApiProperty } from '@nestjs/swagger';

export class TransactionReportTotalEntity {
  @ApiProperty({
    type: String,
    example: '0.0039 ($41)',
    description: 'The total ETH balance by all Addresses',
  })
  totalEth: string;

  @ApiProperty({
    type: String,
    example: '1.45 ($3120)',
    description: 'The total Volume of all transactions by all Addresses',
  })
  totalVolume: string;

  @ApiProperty({
    type: String,
    example: '0.00019 ($5)',
    description: 'The total paid Fee of all transactions by all Addresses',
  })
  totalFee: string;

  @ApiProperty({
    type: String,
    example: '0.00019 ($5)',
    description: 'The total paid Gas price of all transactions by all Addresses',
  })
  totalGasPrice: string;
}
