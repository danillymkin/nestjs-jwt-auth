import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
} from '@nestjs/common';
import {
  USER_SERVICE,
  UserService,
} from '../../user/interfaces/user-service.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_SERVICE) private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_ACCESS_SECRET'),
    });
  }

  private readonly logger = new Logger(JwtStrategy.name);

  async validate(payload: any) {
    try {
      const user = await this.userService.getById(payload?.id);

      this.logger.log(
        `IN JwtStrategy::validate - found user with email: ${user.email} by id: ${payload?.id}`,
      );

      return user;
    } catch (e) {
      throw new BadRequestException('Невалидный токен');
    }
  }
}
