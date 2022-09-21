import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterUserDto {
  @ApiProperty({ description: 'Электронная почта', example: 'alice@mail.ru' })
  @IsEmail({}, { message: 'Некорректный E-Mail адрес' })
  @IsString({ message: 'E-Mail должен быть строкой' })
  readonly email: string;

  @ApiProperty({ description: 'Пароль', example: 'StrongPassword' })
  @IsString({ message: 'Пароль должен быть строкой' })
  @MinLength(6, { message: 'Пароль должен быть длиннее 6 символов' })
  readonly password: string;
}
