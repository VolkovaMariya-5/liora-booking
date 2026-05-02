import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { RegisterBusinessDto } from './dto/register-business.dto';
import { Role } from '@prisma/client';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    private readonly prisma;
    constructor(usersService: UsersService, jwtService: JwtService, prisma: PrismaService);
    validateUser(email: string, password: string): Promise<Omit<{
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
    }, "passwordHash"> | null>;
    login(user: {
        id: string;
        email: string;
        role: Role;
    }): {
        user: {
            id: string;
            email: string;
            role: Role;
        };
        accessToken: string;
    };
    register(dto: RegisterDto): Promise<{
        user: {
            id: string;
            email: string;
            role: Role;
        };
        accessToken: string;
    }>;
    registerBusiness(dto: RegisterBusinessDto): Promise<{
        user: {
            id: string;
            email: string;
            role: Role;
        };
        accessToken: string;
    }>;
    loginWithGoogle(data: {
        email: string;
        name: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
            role: Role;
        };
        accessToken: string;
    }>;
}
