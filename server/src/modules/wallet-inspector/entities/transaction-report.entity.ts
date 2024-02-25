import { ApiProperty } from '@nestjs/swagger';
import { TransactionReportColumnEntity } from './transaction-report-column.entity';
import { TransactionReportItemEntity } from './transaction-report-item.entity';
import { TransactionReportTotalEntity } from './transaction-report-total.entity';

export class TransactionReportEntity {
  @ApiProperty({
    type: [TransactionReportColumnEntity],
    description: 'The array of Table columns',
  })
  columns: TransactionReportColumnEntity[];

  @ApiProperty({
    type: [TransactionReportItemEntity],
    description: 'The array of Transaction stat item',
  })
  items: TransactionReportItemEntity[];

  @ApiProperty({
    type: TransactionReportTotalEntity,
    description: 'The total of all Transaction stat items',
  })
  total: TransactionReportTotalEntity;
}
