import { LoginResponse } from '../types/login-response.type';
import { UserResponse } from '../../user/types/user-response.type';
import { ApiProperty } from '@nestjs/swagger';
import { UserModel } from '../../user/models/user.model';

export class LoginResponseDto implements LoginResponse {
  @ApiProperty({ description: 'Пользователь', type: UserModel })
  readonly user: UserResponse;

  @ApiProperty({
    description: 'Токен доступа',
    example: 'eyJhbGciOiJIUzI1Ni.eyJpZCI6MW1haWwiO.cA2XWju-fAoENALb',
  })
  readonly accessToken: string;
}
