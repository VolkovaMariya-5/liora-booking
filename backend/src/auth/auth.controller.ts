import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterBusinessDto } from './dto/register-business.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

// @ApiTags — группирует эндпоинты в Swagger UI
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  // POST /api/auth/register — регистрация клиента
  @Post('register')
  @ApiOperation({ summary: 'Регистрация нового клиента' })
  @ApiResponse({ status: 201, description: 'Клиент создан, возвращает токен' })
  @ApiResponse({ status: 409, description: 'Email уже занят' })
  async register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  // POST /api/auth/register-business — регистрация владельца бизнеса
  @Post('register-business')
  @ApiOperation({ summary: 'Регистрация владельца бизнеса' })
  @ApiResponse({ status: 201, description: 'Пользователь и бизнес созданы' })
  @ApiResponse({ status: 409, description: 'Email или slug уже заняты' })
  async registerBusiness(@Body() dto: RegisterBusinessDto) {
    return this.authService.registerBusiness(dto);
  }

  // POST /api/auth/login — вход по email + пароль
  // LocalAuthGuard запускает passport-local, который вызывает AuthService.validateUser()
  @Post('login')
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK) // 200 вместо стандартного 201 для POST
  @ApiOperation({ summary: 'Вход в систему' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Успешный вход, возвращает accessToken' })
  @ApiResponse({ status: 401, description: 'Неверный email или пароль' })
  async login(@Request() req: { user: Parameters<AuthService['login']>[0] }) {
    // req.user установлен LocalStrategy.validate() — это уже проверенный пользователь
    return this.authService.login(req.user);
  }

  // POST /api/auth/google — вход/регистрация через Google OAuth
  // Вызывается из NextAuth.js с данными, полученными от Google
  @Post('google')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Вход через Google (вызывается из NextAuth)' })
  @ApiResponse({ status: 200, description: 'Пользователь найден или создан' })
  async googleLogin(@Body() body: { email: string; name: string }) {
    return this.authService.loginWithGoogle(body);
  }

  // GET /api/auth/me — получение данных текущего пользователя
  // JwtAuthGuard проверяет Bearer токен и загружает пользователя в req.user
  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth() // кнопка авторизации в Swagger UI
  @ApiOperation({ summary: 'Получить данные текущего пользователя' })
  @ApiResponse({ status: 200, description: 'Данные пользователя' })
  @ApiResponse({ status: 401, description: 'Токен отсутствует или невалиден' })
  getMe(@CurrentUser() user: Parameters<UsersService['sanitize']>[0]) {
    // Убираем passwordHash перед отправкой клиенту
    return this.usersService.sanitize(user);
  }
}
