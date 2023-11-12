/*external modules*/
import { IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BlockchainNetworkFilterDto } from './blockchain-network-filter.dto';
import { FindDto } from '@common/dto';

export class FindBlockchainNetworkDto extends FindDto<BlockchainNetworkFilterDto> {
  @IsOptional()
  @Type(() => BlockchainNetworkFilterDto)
  @ValidateNested()
  @ApiProperty({
    type: BlockchainNetworkFilterDto,
  })
  declare readonly filter?: BlockchainNetworkFilterDto;
}
