import {
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { TokenService } from './interfaces/token-service.interface';
import { PrismaService } from '../prisma/prisma.service';
import { TokenPayload } from './types/token-payload.type';
import { RefreshToken } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserResponse } from '../user/types/user-response.type';

@Injectable()
export class TokenServiceImpl implements TokenService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {}

  private readonly logger = new Logger(TokenServiceImpl.name);

  public generateRefreshToken(user: UserResponse): string {
    const payload = this.createPayload(user);
    const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
    const expiresIn = this.configService.get<string>('JWT_REFRESH_EXPIRES_IN');

    return this.jwtService.sign(payload, {
      expiresIn,
      secret,
    });
  }

  public generateAccessToken(user: UserResponse): string {
    const payload = this.createPayload(user);
    const secret = this.configService.get<string>('JWT_ACCESS_SECRET');
    const expiresIn = this.configService.get<string>('JWT_ACCESS_EXPIRES_IN');

    return this.jwtService.sign(payload, {
      expiresIn,
      secret,
    });
  }

  public async getByToken(token: string): Promise<RefreshToken> {
    try {
      const refreshToken: RefreshToken =
        await this.prismaService.refreshToken.findUniqueOrThrow({
          where: { token },
        });

      this.logger.log(
        `IN TokenServiceImpl::findOneByToken - refresh token with id: ${refreshToken.id} found by token: ${token}`,
      );

      return refreshToken;
    } catch (e) {
      this.logger.error(
        `IN TokenServiceImpl::findOneByToken - refresh token not found by token: ${token}`,
      );

      throw new NotFoundException('RefreshToken не найден');
    }
  }

  public async removeByToken(token: string): Promise<void> {
    this.logger.log(
      `IN TokenServiceImpl::removeByToken - remove RefreshToken by token: ${token}`,
    );

    await this.prismaService.refreshToken.delete({ where: { token } });
  }

  public async saveRefreshToken(
    userId: number,
    token: string,
  ): Promise<RefreshToken> {
    const refreshTokenFromDB = await this.getByUserId(userId);
    if (refreshTokenFromDB) {
      this.logger.log(
        `IN TokenServiceImpl::saveRefreshToken - updated RefreshToken with id: ${refreshTokenFromDB.id}`,
      );

      return this.prismaService.refreshToken.update({
        where: {
          id: refreshTokenFromDB.id,
        },
        data: { token },
      });
    }

    const refreshToken = await this.prismaService.refreshToken.create({
      data: { userId, token },
    });

    this.logger.log(
      `IN TokenServiceImpl::saveRefreshToken - created RefreshToken with id: ${refreshToken.id}`,
    );

    return refreshToken;
  }

  public async getRefreshTokenPayload(token: string): Promise<TokenPayload> {
    const tokenPayload = this.validateRefreshToken(token);
    const tokenFromDB = await this.prismaService.refreshToken.findUnique({
      where: { token },
    });
    if (!(tokenPayload && tokenFromDB)) {
      throw new UnauthorizedException('Пользователь не авторизован');
    }
    return tokenPayload;
  }

  private validateRefreshToken(token: string): TokenPayload {
    try {
      const secret = this.configService.get<string>('JWT_REFRESH_SECRET');
      const payload: TokenPayload = this.jwtService.verify(token, {
        secret,
        ignoreExpiration: false,
      });

      this.logger.log(
        `IN TokenServiceImpl::validateRefreshToken - extract payload: { id: ${payload.id}, email: ${payload.email} } from token: ${token}`,
      );

      return payload;
    } catch (e) {
      this.logger.error(
        `IN TokenServiceImpl::validateRefreshToken - token: ${token} is not valid`,
      );

      return null;
    }
  }

  private createPayload(user: UserResponse): TokenPayload {
    this.logger.log(
      `IN TokenServiceImpl::createPayload - created payload for user with id: ${user.id}`,
    );

    return {
      id: user.id,
      email: user.email,
    };
  }

  private async getByUserId(userId: number): Promise<RefreshToken> {
    try {
      const refreshToken =
        await this.prismaService.refreshToken.findFirstOrThrow({
          where: { userId },
        });

      this.logger.log(
        `IN TokenServiceImpl::getByUserId - refreshToken with id: ${refreshToken.id} found by user id: ${userId}`,
      );

      return refreshToken;
    } catch (e) {
      this.logger.log(
        `IN TokenServiceImpl::getByUserId - refreshToken not found by user id: ${userId}`,
      );

      return null;
    }
  }
}
