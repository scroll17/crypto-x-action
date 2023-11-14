/*external modules*/
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BlockchainAccountFilterDto } from './blockchain-account-filter.dto';
import { FindDto } from '@common/dto';

export class FindBlockchainAccountDto extends FindDto<BlockchainAccountFilterDto> {
  @IsOptional()
  @Type(() => BlockchainAccountFilterDto)
  @ValidateNested()
  @ApiProperty({
    type: BlockchainAccountFilterDto,
  })
  declare readonly filter?: BlockchainAccountFilterDto;
}
