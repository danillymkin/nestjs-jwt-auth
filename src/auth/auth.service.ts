import {
  BadRequestException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './interfaces/auth-service.interface';
import { LoginResponse } from './types/login-response.type';
import { RegisterUserDto } from './dto/register-user.dto';
import {
  USER_SERVICE,
  UserService,
} from '../user/interfaces/user-service.interface';
import {
  TOKEN_SERVICE,
  TokenService,
} from '../token/interfaces/token-service.interface';
import {
  REFRESH_TOKEN_COOKIE_MAX_AGE,
  REFRESH_TOKEN_COOKIE_NAME,
} from './utils/constants';
import { UserResponse } from '../user/types/user-response.type';

@Injectable()
export class AuthServiceImpl implements AuthService {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: UserService,
    @Inject(TOKEN_SERVICE) private readonly tokenService: TokenService,
  ) {}

  public async login(
    userData: UserResponse,
    response: Response,
  ): Promise<LoginResponse> {
    const accessToken = this.tokenService.generateAccessToken(userData);
    const user = await this.userService.getById(userData.id);
    await this.setRefreshToken(userData, response);

    return { accessToken, user };
  }

  public async register(
    registerUserDto: RegisterUserDto,
    response: Response,
  ): Promise<LoginResponse> {
    await this.checkIsUserExist(registerUserDto.email);
    const user = await this.userService.create(registerUserDto);

    return await this.login(user, response);
  }

  public async refresh(
    refreshToken: string,
    response: Response,
  ): Promise<LoginResponse> {
    try {
      const tokenPayload = await this.tokenService.getRefreshTokenPayload(
        refreshToken,
      );
      const user = await this.userService.getById(tokenPayload.id);

      return await this.login(user, response);
    } catch (e) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
  }

  public async logout(
    refreshToken: string,
    response: Response,
    request,
  ): Promise<void> {
    response.clearCookie(REFRESH_TOKEN_COOKIE_NAME);
    request.logout();
    await this.tokenService.removeByToken(refreshToken);
  }

  private async checkIsUserExist(email: string) {
    const isUserExist = await this.userService.existByEmail(email);
    if (isUserExist) {
      throw new BadRequestException(
        `Пользователь с почтовым адресом ${email} уже существует`,
      );
    }
  }

  private async setRefreshToken(
    user: UserResponse,
    response: Response,
  ): Promise<void> {
    const refreshToken = this.tokenService.generateRefreshToken(user);
    await this.tokenService.saveRefreshToken(user.id, refreshToken);
    this.setRefreshTokenInCookie(refreshToken, response);
  }

  private setRefreshTokenInCookie(token: string, response: Response): void {
    response.cookie(REFRESH_TOKEN_COOKIE_NAME, token, {
      maxAge: REFRESH_TOKEN_COOKIE_MAX_AGE,
      httpOnly: true,
    });
  }
}
