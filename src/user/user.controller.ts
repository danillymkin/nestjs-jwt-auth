import {
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { USER_SERVICE, UserService } from './interfaces/user-service.interface';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from '../auth/decorators/auth.decorator';
import { UserResponse } from './types/user-response.type';
import { UserModel } from './models/user.model';
import { RoleName } from '@prisma/client';

@ApiTags('Пользователи')
@Controller('users')
export class UserController {
  constructor(
    @Inject(USER_SERVICE) private readonly userService: UserService,
  ) {}

  @ApiOperation({ summary: 'Получить всех пользователей' })
  @ApiResponse({ status: HttpStatus.OK, type: [UserModel] })
  @Auth(RoleName.ADMIN)
  @Get()
  public getAll(): Promise<UserResponse[]> {
    return this.userService.getAll();
  }

  @ApiOperation({ summary: 'Получить пользователя по id' })
  @ApiResponse({ status: HttpStatus.OK, type: UserModel })
  @Auth(RoleName.ADMIN)
  @Get(':id')
  public getById(@Param('id', ParseIntPipe) id: number): Promise<UserResponse> {
    return this.userService.getById(id);
  }
}
