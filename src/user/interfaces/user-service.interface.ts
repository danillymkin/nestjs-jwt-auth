import { LoginUserDto } from '../../auth/dto/login-user.dto';
import { RegisterUserDto } from '../../auth/dto/register-user.dto';
import { User } from '@prisma/client';
import { UserResponse } from '../types/user-response.type';

export const USER_SERVICE = 'USER_SERVICE';

export interface UserService {
  create(registerUserDto: RegisterUserDto): Promise<UserResponse>;

  getAll(): Promise<UserResponse[]>;

  getById(id: number): Promise<UserResponse>;

  getByEmail(email: string): Promise<UserResponse>;

  existByEmail(email: string): Promise<boolean>;

  validate(loginUserDto: LoginUserDto): Promise<User>;
}
