import { PrismaService } from '../prisma/prisma.service';
import { BusinessesService } from '../businesses/businesses.service';
import { Role } from '@prisma/client';
export declare class AdminController {
    private readonly prisma;
    private readonly businessesService;
    constructor(prisma: PrismaService, businessesService: BusinessesService);
    getStats(): Promise<{
        users: number;
        businesses: number;
        bookings: number;
        reviews: number;
        bookingsByStatus: {
            [k: string]: number;
        };
    }>;
    getBusinesses(page?: string, limit?: string): Promise<{
        data: ({
            owner: {
                email: string;
                name: string;
            };
        } & {
            id: string;
            name: string;
            phone: string | null;
            country: string;
            city: string;
            createdAt: Date;
            slug: string;
            description: string | null;
            address: string | null;
            logoUrl: string | null;
            category: import("@prisma/client").$Enums.BusinessCategory;
            isActive: boolean;
            isVisible: boolean;
            isFeatured: boolean;
            maxAdvanceBookingDays: number;
            ownerId: string;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    toggleBusiness(id: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        country: string;
        city: string;
        createdAt: Date;
        slug: string;
        description: string | null;
        address: string | null;
        logoUrl: string | null;
        category: import("@prisma/client").$Enums.BusinessCategory;
        isActive: boolean;
        isVisible: boolean;
        isFeatured: boolean;
        maxAdvanceBookingDays: number;
        ownerId: string;
    }>;
    toggleFeatured(id: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        country: string;
        city: string;
        createdAt: Date;
        slug: string;
        description: string | null;
        address: string | null;
        logoUrl: string | null;
        category: import("@prisma/client").$Enums.BusinessCategory;
        isActive: boolean;
        isVisible: boolean;
        isFeatured: boolean;
        maxAdvanceBookingDays: number;
        ownerId: string;
    }>;
    getUsers(page?: string, limit?: string, role?: Role): Promise<{
        data: {
            id: string;
            email: string;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            country: string | null;
            city: string | null;
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    createUser(body: {
        name: string;
        email: string;
        password: string;
        role: Role;
        city?: string;
        country?: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        country: string | null;
        city: string | null;
        createdAt: Date;
    }>;
    updateUser(id: string, body: {
        name?: string;
        email?: string;
        role?: Role;
        city?: string;
        country?: string;
    }): Promise<{
        id: string;
        email: string;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        country: string | null;
        city: string | null;
        createdAt: Date;
    }>;
    deleteUser(id: string): import("@prisma/client").Prisma.Prisma__UserClient<{
        id: string;
        isDeleted: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, import("@prisma/client").Prisma.PrismaClientOptions>;
}
