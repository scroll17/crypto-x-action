/*external modules*/
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  @ApiProperty({ example: 'Danil' })
  readonly firstName: string;

  @IsString()
  @MinLength(2)
  @IsNotEmpty()
  @ApiProperty({ example: 'Zaluzhniy' })
  readonly lastName: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'user@example.com' })
  readonly email: string;

  @MinLength(8)
  @IsNotEmpty()
  @ApiProperty({ example: 'test12345' })
  readonly password: string;

  @IsString()
  @MinLength(12)
  @IsNotEmpty()
  @ApiProperty({ example: '380983479999' })
  readonly phone: string;
}
