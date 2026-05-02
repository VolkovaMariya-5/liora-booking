import { PrismaService } from '../prisma/prisma.service';
import { User, Role } from '@prisma/client';
export declare class UsersService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    create(data: {
        email: string;
        password: string;
        name: string;
        phone?: string;
        country?: string;
        city?: string;
        role?: Role;
    }): Promise<User>;
    sanitize(user: User): Omit<User, 'passwordHash'>;
}
