/*external modules*/
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { IsNumber, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class UserFilterDto {
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
    example: 'Andrii',
  })
  readonly name?: string;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiProperty({
    type: String,
    example: 'user@example.com',
  })
  readonly email?: string;

  @IsOptional()
  @IsNumber()
  @ApiProperty({
    type: Number,
    example: 2_342_342_324,
  })
  readonly telegramId?: number;
}
