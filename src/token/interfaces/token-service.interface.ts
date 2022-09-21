import { TokenPayload } from '../types/token-payload.type';
import { RefreshToken } from '@prisma/client';
import { UserResponse } from '../../user/types/user-response.type';

export const TOKEN_SERVICE = 'TOKEN_SERVICE';

export interface TokenService {
  generateRefreshToken(user: UserResponse): string;

  generateAccessToken(user: UserResponse): string;

  saveRefreshToken(userId: number, token: string): Promise<RefreshToken>;

  getByToken(token: string): Promise<RefreshToken>;

  removeByToken(token: string): Promise<void>;

  getRefreshTokenPayload(token: string): Promise<TokenPayload>;
}
