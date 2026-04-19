import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { ROLES_KEY } from '../decorators/roles.decorator';

// RolesGuard — проверяет роль пользователя после JwtAuthGuard
// Использование: @UseGuards(JwtAuthGuard, RolesGuard) + @Roles(Role.BUSINESS_ADMIN)
// Возвращает 403 если роль пользователя не входит в разрешённые
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Читаем список разрешённых ролей из метаданных декоратора @Roles()
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),   // метаданные метода контроллера
      context.getClass(),     // метаданные класса контроллера
    ]);

    // Если @Roles() не указан — маршрут доступен всем авторизованным
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }

    // req.user устанавливается JwtAuthGuard после проверки токена
    const { user } = context.switchToHttp().getRequest();

    if (!requiredRoles.includes(user?.role)) {
      throw new ForbiddenException('У вас недостаточно прав для этого действия');
    }

    return true;
  }
}
