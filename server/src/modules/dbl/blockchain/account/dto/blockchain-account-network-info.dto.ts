/*external modules*/
import { IsEnum, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BlockchainNetworkPrototypeLevel } from '@common/blockchain/enums';

export class BlockchainAccountNetworkInfoDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'The network name called by Provider',
  })
  readonly name: string;

  @IsEnum(BlockchainNetworkPrototypeLevel)
  @IsNotEmpty()
  @ApiProperty({
    enum: Object.values(BlockchainNetworkPrototypeLevel),
    example: BlockchainNetworkPrototypeLevel.MainNet,
    description: 'This describes the type of Blockchain network',
  })
  readonly type: BlockchainNetworkPrototypeLevel;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    example: 'https://mainnet.infura.io/ws/v3/234234234234234',
  })
  readonly url: string;
}
