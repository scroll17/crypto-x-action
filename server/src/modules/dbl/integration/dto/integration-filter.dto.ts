/*external modules*/
import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';
import { IsBoolean, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IntegrationNames } from '@common/integrations/common';

export class IntegrationFilterDto {
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
  @IsEnum(IntegrationNames)
  @MinLength(1)
  @ApiProperty({
    enum: Object.values(IntegrationNames),
    example: IntegrationNames.CryptoCompare,
  })
  readonly key?: IntegrationNames;

  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiProperty({
    type: String,
    example: 'CryptoCompare',
  })
  readonly name?: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    type: Boolean,
    example: true,
  })
  readonly active?: boolean;
}
