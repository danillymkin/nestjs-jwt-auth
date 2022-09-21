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

  @ApiProperty({ description: 'Имя', example: 'Алиса' })
  @IsString({ message: 'Имя должно быть строкой' })
  readonly firstName: string;

  @ApiProperty({ description: 'Фамилия', example: 'Ивлиева' })
  @IsString({ message: 'Фамилия должна быть строкой' })
  readonly lastName: string;

  @ApiProperty({ description: 'Отчество', example: 'Александровна' })
  @IsString({ message: 'Отчество должно быть строкой' })
  readonly patronymic: string;
}
