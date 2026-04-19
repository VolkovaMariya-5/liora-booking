import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// JwtAuthGuard — декоратор для защиты эндпоинтов, требующих авторизации
// Использование: @UseGuards(JwtAuthGuard) над контроллером или методом
// Если токен невалиден или отсутствует — автоматически возвращает 401
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
