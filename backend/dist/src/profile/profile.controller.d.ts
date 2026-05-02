import { ProfileService } from './profile.service';
export declare class ProfileController {
    private readonly profileService;
    constructor(profileService: ProfileService);
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
    changePassword(userId: string, body: {
        currentPassword: string;
        newPassword: string;
    }): Promise<{
        message: string;
    }>;
    deleteAccount(userId: string): Promise<{
        message: string;
    }>;
}
