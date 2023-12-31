/*external modules*/
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BlockchainNetworkType } from '@common/blockchain';

export class BlockchainAccountNetworkInfoDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'The network name called by Provider',
  })
  readonly name: string;

  @IsEnum(BlockchainNetworkType)
  @IsNotEmpty()
  @ApiProperty({
    enum: Object.values(BlockchainNetworkType),
    example: BlockchainNetworkType.MainNet,
    description: 'This describes the type of Blockchain network',
  })
  readonly type: BlockchainNetworkType;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'https://mainnet.infura.io/ws/v3/234234234234234',
  })
  readonly url: string;
}
