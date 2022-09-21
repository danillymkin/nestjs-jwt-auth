import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { RoleName, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserService } from './interfaces/user-service.interface';
import { LoginUserDto } from '../auth/dto/login-user.dto';
import { RegisterUserDto } from '../auth/dto/register-user.dto';
import { UserResponse, userResponse } from './types/user-response.type';

@Injectable()
export class UserServiceImpl implements UserService {
  constructor(private readonly prismaService: PrismaService) {}

  private readonly logger = new Logger(UserServiceImpl.name);

  public async create(registerUserDto: RegisterUserDto): Promise<UserResponse> {
    const hashedPassword = await this.hashPassword(registerUserDto.password);
    const user: UserResponse = await this.prismaService.user.create({
      data: {
        email: registerUserDto.email,
        password: hashedPassword,
        firstName: registerUserDto.firstName,
        lastName: registerUserDto.lastName,
        patronymic: registerUserDto.patronymic,
        roles: {
          connect: {
            name: RoleName.USER,
          },
        },
      },
      ...userResponse,
    });

    this.logger.log(
      `IN UserServiceImpl::create - user with id: ${user.id} successfully created`,
    );

    return user;
  }

  public async getAll(): Promise<UserResponse[]> {
    const users: UserResponse[] = await this.prismaService.user.findMany({
      ...userResponse,
    });

    this.logger.log(`IN UserServiceImpl::getAll - found ${users.length} users`);

    return users;
  }

  public async getByEmail(email: string): Promise<UserResponse> {
    try {
      const user: UserResponse =
        await this.prismaService.user.findUniqueOrThrow({
          where: { email },
          ...userResponse,
        });

      this.logger.log(
        `IN UserServiceImpl::getByEmail - user with id: ${user.id} found by email: ${email}`,
      );

      return user;
    } catch (e) {
      this.logger.log(
        `IN UserServiceImpl::getByEmail - user not found by email: ${email}`,
      );

      throw new NotFoundException(`Пользователь с E-Mail: ${email} не найден.`);
    }
  }

  public async getById(id: number): Promise<UserResponse> {
    try {
      const user: UserResponse =
        await this.prismaService.user.findUniqueOrThrow({
          where: { id },
          ...userResponse,
        });

      this.logger.log(
        `IN UserServiceImpl::getById - user with email: ${user.email} found by id: ${id}`,
      );

      return user;
    } catch (e) {
      this.logger.log(
        `IN UserServiceImpl::getById - user with id: ${id} not found`,
      );

      throw new NotFoundException(`Пользователь с id: ${id} не найден.`);
    }
  }

  public async existByEmail(email: string): Promise<boolean> {
    const candidate = await this.prismaService.user.findUnique({
      where: { email },
    });

    return !!candidate;
  }

  public async validate({ email, password }: LoginUserDto): Promise<User> {
    try {
      const user: User = await this.prismaService.user.findUniqueOrThrow({
        where: { email },
      });

      this.logger.log(
        `IN UserServiceImpl::validate - user with id: ${user.id} found by email: ${email}`,
      );

      const passwordsEquals = await bcrypt.compare(password, user.password);
      if (passwordsEquals) {
        this.logger.log(
          `IN UserServiceImpl::validate - user's password is compare with password from DB`,
        );
        return user;
      }
    } catch (e) {
      this.logger.log(
        `IN UserServiceImpl::validate - user not found by email: ${email}`,
      );

      throw new BadRequestException('Неверный E-Mail или пароль');
    }

    this.logger.log(
      `IN UserServiceImpl::validate - user's password is not compare with password from DB`,
    );

    throw new BadRequestException('Неверный E-Mail или пароль');
  }

  private async hashPassword(password: string): Promise<string> {
    const hashSalt = await bcrypt.genSalt();
    return await bcrypt.hash(password, hashSalt);
  }
}
