import { IsEmail, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({ description: 'Электронная почта', example: 'alice@mail.ru' })
  @IsEmail({}, { message: 'Некорректный E-Mail адрес' })
  @IsString({ message: 'E-Mail должен быть строкой' })
  readonly email: string;

  @ApiProperty({ description: 'Пароль', example: 'StrongPassword' })
  @IsString({ message: 'Пароль должен быть строкой' })
  readonly password: string;
}
