/*external modules*/
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { IsArray, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BlockchainAccountFilterDto {
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
  @IsString()
  @MinLength(1)
  @ApiProperty({
    type: String,
    example: 'The test name',
    description: 'The name of Account',
  })
  readonly name?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ApiProperty({
    type: [String],
  })
  readonly labels?: string[];

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
  readonly network?: Types.ObjectId;

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
  readonly createdBy?: Types.ObjectId;
}
