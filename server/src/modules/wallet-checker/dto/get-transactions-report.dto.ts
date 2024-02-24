/*external modules*/
import { IsArray, IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BlockchainNetworkName } from '@common/blockchain/enums';

export class GetTransactionsReportDto {
  @IsNotEmpty()
  @IsEnum(BlockchainNetworkName)
  @MinLength(1)
  @ApiProperty({
    enum: Object.values(BlockchainNetworkName),
    example: BlockchainNetworkName.Ethereum,
    description: 'The Blockchain network',
  })
  readonly network: BlockchainNetworkName;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  @MinLength(1, { each: true })
  @ApiProperty({
    type: [String],
    example: ['0x4A24FE8E61E0b57529B6642293626aFD407b03c9', '0x4A24FE8E61E0b57529B6642293626aFD407b03c9'],
    description: 'The array of blockchain addresses',
  })
  readonly addresses: string[];
}
