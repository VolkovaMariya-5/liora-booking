import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

// LocalAuthGuard — применяется только к эндпоинту POST /api/auth/login
// Вызывает LocalStrategy.validate(email, password) перед выполнением контроллера
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
