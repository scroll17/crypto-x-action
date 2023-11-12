/*external modules*/
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { IsEnum, IsOptional, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { BlockchainNetworks } from '@common/blockchain/enums';

export class BlockchainNetworkFilterDto {
  @IsOptional()
  @Type(() => Types.ObjectId)
  @Transform(({ value }) => {
    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException('Invalid ObjectId');
    }

    return new Types.ObjectId(value);
  })
  @ApiProperty({
    type: String,
    example: '5349b4ddd2781d08c09890f4',
    description: 'The ObjectId in the String view',
  })
  readonly id?: Types.ObjectId;

  @IsOptional()
  @IsEnum(BlockchainNetworks)
  @MinLength(1)
  @ApiProperty({
    enum: Object.values(BlockchainNetworks),
    example: BlockchainNetworks.Ethereum,
    description: 'The Blockchain network',
  })
  readonly name?: BlockchainNetworks;
}
