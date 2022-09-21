import { RegisterUserDto } from '../dto/register-user.dto';
import { LoginResponse } from '../types/login-response.type';
import { Response } from 'express';
import { UserResponse } from '../../user/types/user-response.type';

export const AUTH_SERVICE = 'AUTH_SERVICE';

export interface AuthService {
  login(user: UserResponse, response: Response): Promise<LoginResponse>;

  register(
    registerUserDto: RegisterUserDto,
    response: Response,
  ): Promise<LoginResponse>;

  refresh(refreshToken: string, response: Response): Promise<LoginResponse>;

  logout(refreshToken: string, response: Response, request): Promise<void>;
}
