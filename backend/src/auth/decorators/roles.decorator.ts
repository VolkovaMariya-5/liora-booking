import { SetMetadata } from '@nestjs/common';
import { Role } from '@prisma/client';

// Ключ для хранения ролей в метаданных — используется в RolesGuard
export const ROLES_KEY = 'roles';

// @Roles() — декоратор для указания разрешённых ролей на эндпоинте
// Пример: @Roles(Role.BUSINESS_ADMIN, Role.SUPER_ADMIN)
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);
