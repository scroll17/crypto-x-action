/*external modules*/
import { IsArray, IsNotEmpty, IsString, MinLength, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { Transform, Type } from 'class-transformer';
import { HttpException, HttpStatus } from '@nestjs/common';
import { BlockchainAccountNetworkInfoDto } from './blockchain-account-network-info.dto';

export class CreateBlockchainAccountDto {
  @IsString()
  @MinLength(1)
  @IsNotEmpty()
  @ApiProperty({ example: 'The First account' })
  readonly name: string;

  @IsString()
  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty({ example: '0x4A24FE8E61E0b57529B6642293626aFD407b03c9' })
  readonly address: string;

  @IsString({ each: true })
  @IsArray()
  @IsNotEmpty()
  @ApiProperty({ example: ['in usage', 'hot'] })
  readonly labels: string[];

  @IsNotEmpty()
  @Type(() => Types.ObjectId)
  @Transform(({ value }) => {
    if (!Types.ObjectId.isValid(value)) {
      throw new HttpException('Invalid ObjectId', HttpStatus.BAD_REQUEST);
    }

    return new Types.ObjectId(value);
  })
  @ApiProperty({
    type: String,
    example: '5349b4ddd2781d08c09890f4',
    description: 'The ObjectId in the String view',
  })
  readonly network: Types.ObjectId;

  @IsNotEmpty()
  @Type(() => BlockchainAccountNetworkInfoDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    type: BlockchainAccountNetworkInfoDto,
  })
  readonly networkInfo: BlockchainAccountNetworkInfoDto;
  // TODO: remove it
}
