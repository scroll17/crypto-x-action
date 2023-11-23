/*external modules*/
import { IsArray, IsOptional, IsString, MinLength, ValidateNested } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { EditCommentDto } from '@common/dto/comment';
import { EditBlockchainAccountLabelsDto } from './edit-blockchain-account-labels.dto';
import { EditAction } from '@common/enums';

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

  public getLabels(actionType: EditAction) {
    if (!this.labels) return [];
    return this.labels.filter((l) => l.action === actionType).map((l) => l.value);
  }

  public getComments(actionType: EditAction) {
    if (!this.comments) return [];
    return this.comments.filter((l) => l.action === actionType).map((c) => c.value);
  }
}
