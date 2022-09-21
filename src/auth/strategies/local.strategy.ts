import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import {
  USER_SERVICE,
  UserService,
} from '../../user/interfaces/user-service.interface';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject(USER_SERVICE) private readonly usersService: UserService,
  ) {
    super({
      usernameField: 'email',
    });
  }

  public async validate(email: string, password: string) {
    try {
      return await this.usersService.validate({ email, password });
    } catch (e) {
      throw new BadRequestException('Неверный E-Mail или пароль');
    }
  }
}
