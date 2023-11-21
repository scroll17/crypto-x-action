/*external modules*/
import { IsNotEmpty, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EditPropertyDto } from '@common/dto';
import { ChangeBlockchainAccountLabelDto } from './change-blockchain-account-label.dto';
import { Type } from 'class-transformer';

export class EditBlockchainAccountLabelsDto extends EditPropertyDto<ChangeBlockchainAccountLabelDto> {
  @IsNotEmpty()
  @Type(() => ChangeBlockchainAccountLabelDto)
  @ValidateNested()
  @ApiProperty({
    type: ChangeBlockchainAccountLabelDto,
  })
  declare readonly value: ChangeBlockchainAccountLabelDto;
}
