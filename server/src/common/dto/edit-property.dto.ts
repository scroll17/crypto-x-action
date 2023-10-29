import { EditAction } from '../enums/rest';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class EditPropertyDto<TValue> {
  @IsEnum(EditAction)
  @IsNotEmpty()
  @ApiProperty({
    enum: Object.values(EditAction),
    example: EditAction.Add,
    description: 'The type of edit operation belonged to value',
  })
  action: EditAction;

  value: TValue;
}
