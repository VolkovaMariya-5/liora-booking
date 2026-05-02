import { PrismaService } from '../prisma/prisma.service';
export declare class ProfileService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProfile(userId: string): Promise<{
        bookings: undefined;
        stats: {
            total: number;
            completed: number;
            upcoming: number;
        };
        id: string;
        email: string;
        name: string;
        phone: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        country: string | null;
        city: string | null;
        createdAt: Date;
    }>;
    updateProfile(userId: string, data: {
        name?: string;
        phone?: string;
        country?: string;
        city?: string;
        avatarUrl?: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        phone: string | null;
        avatarUrl: string | null;
        role: import("@prisma/client").$Enums.Role;
        country: string | null;
        city: string | null;
    }>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<{
        message: string;
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
}
