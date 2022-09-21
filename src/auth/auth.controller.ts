import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AUTH_SERVICE, AuthService } from './interfaces/auth-service.interface';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { UserData } from './decorators/user-data.decorator';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginResponse } from './types/login-response.type';
import { RefreshToken } from './decorators/refresh-token.decorator';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { UserResponse } from '../user/types/user-response.type';
import { LoginResponseDto } from './dto/login-response.dto';

@ApiTags('Аутентификация')
@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authService: AuthService,
  ) {}

  @ApiOperation({ summary: 'Войти в аккаунт' })
  @ApiResponse({ status: HttpStatus.OK, type: LoginResponseDto })
  @ApiBody({ type: LoginUserDto })
  @UseGuards(LocalAuthGuard)
  @Post('login')
  public login(
    @UserData() user: UserResponse,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponse> {
    return this.authService.login(user, response);
  }

  @ApiOperation({ summary: 'Регистрация' })
  @ApiResponse({ status: HttpStatus.CREATED, type: LoginResponseDto })
  @Post('register')
  public register(
    @Body() registerUserDto: RegisterUserDto,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponse> {
    return this.authService.register(registerUserDto, response);
  }

  @ApiOperation({ summary: 'Обновить токен доступа' })
  @ApiResponse({ status: HttpStatus.OK, type: LoginResponseDto })
  @Get('refresh')
  public refresh(
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) response: Response,
  ): Promise<LoginResponse> {
    return this.authService.refresh(refreshToken, response);
  }

  @ApiOperation({ summary: 'Выйти из аккаунта' })
  @ApiResponse({ status: HttpStatus.OK })
  @Post('logout')
  public logout(
    @RefreshToken() refreshToken: string,
    @Res({ passthrough: true }) response: Response,
    @Req() request,
  ): Promise<void> {
    return this.authService.logout(refreshToken, response, request);
  }
}
