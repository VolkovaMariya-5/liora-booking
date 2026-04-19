import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@prisma/client';

// @CurrentUser() — декоратор для получения текущего пользователя прямо в параметре метода
// Работает только с @UseGuards(JwtAuthGuard) — там req.user устанавливается JwtStrategy
// Пример: async getProfile(@CurrentUser() user: User)
export const CurrentUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as User;

    // Если передано имя поля — возвращаем только его: @CurrentUser('id')
    // Иначе возвращаем весь объект пользователя
    return data ? user?.[data] : user;
  },
);
