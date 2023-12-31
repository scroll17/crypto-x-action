/*external modules*/
import { IsArray, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EditCommentDto } from '@common/dto/comment';
import { EditBlockchainAccountLabelsDto } from './edit-blockchain-account-labels.dto';
import { EditAction } from '@common/enums';
import { BlockchainAccountNetworkInfoDto } from './blockchain-account-network-info.dto';

export class EditBlockchainAccountDto {
  @IsOptional()
  @IsString()
  @MinLength(1)
  @ApiProperty({
    type: String,
    example: 'The Blockchain Account name',
  })
  readonly name?: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @ApiProperty({
    type: String,
    example: '0x4A24FE8E61E0b57529B6642293626aFD407b03c9',
  })
  readonly address?: string;

  @IsOptional()
  @IsArray()
  @Type(() => EditCommentDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    type: [EditCommentDto],
  })
  readonly comments?: EditCommentDto[];

  @IsOptional()
  @IsArray()
  @Type(() => EditBlockchainAccountLabelsDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    type: [EditBlockchainAccountLabelsDto],
  })
  readonly labels?: EditBlockchainAccountLabelsDto[];

  @IsOptional()
  @Type(() => BlockchainAccountNetworkInfoDto)
  @ValidateNested({ each: true })
  @ApiProperty({
    type: BlockchainAccountNetworkInfoDto,
  })
  readonly networkInfo?: BlockchainAccountNetworkInfoDto;

  public getLabels(actionType: EditAction) {
    if (!this.labels) return [];
    return this.labels.filter((l) => l.action === actionType).map((l) => l.value);
  }

  public getComments(actionType: EditAction) {
    if (!this.comments) return [];
    return this.comments.filter((l) => l.action === actionType).map((c) => c.value);
  }
}
