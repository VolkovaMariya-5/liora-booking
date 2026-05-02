import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterBusinessDto } from './dto/register-business.dto';
export declare class AuthController {
    private readonly authService;
    private readonly usersService;
    constructor(authService: AuthService, usersService: UsersService);
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").Role;
        };
        accessToken: string;
    }>;
    registerBusiness(dto: RegisterBusinessDto): Promise<{
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").Role;
        };
        accessToken: string;
    }>;
    login(req: {
        user: Parameters<AuthService['login']>[0];
    }): Promise<{
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").Role;
        };
        accessToken: string;
    }>;
    googleLogin(body: {
        email: string;
        name: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            role: import("@prisma/client").Role;
        };
        accessToken: string;
    }>;
    getMe(user: Parameters<UsersService['sanitize']>[0]): Omit<{
        id: string;
        email: string;
        passwordHash: string;
        name: string;
        phone: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        country: string | null;
        city: string | null;
        isDeleted: boolean;
        deletedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, "passwordHash">;
}
