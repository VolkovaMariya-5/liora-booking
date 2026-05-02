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
                name: string;
                email: string;
            };
        } & {
            id: string;
            createdAt: Date;
            name: string;
            slug: string;
            description: string | null;
            address: string | null;
            phone: string | null;
            logoUrl: string | null;
            category: import("@prisma/client").$Enums.BusinessCategory;
            country: string;
            city: string;
            isActive: boolean;
            isVisible: boolean;
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
        createdAt: Date;
        name: string;
        slug: string;
        description: string | null;
        address: string | null;
        phone: string | null;
        logoUrl: string | null;
        category: import("@prisma/client").$Enums.BusinessCategory;
        country: string;
        city: string;
        isActive: boolean;
        isVisible: boolean;
        maxAdvanceBookingDays: number;
        ownerId: string;
    }>;
    toggleFeatured(id: string): Promise<{
        id: string;
        createdAt: Date;
        name: string;
        slug: string;
        description: string | null;
        address: string | null;
        phone: string | null;
        logoUrl: string | null;
        category: import("@prisma/client").$Enums.BusinessCategory;
        country: string;
        city: string;
        isActive: boolean;
        isVisible: boolean;
        maxAdvanceBookingDays: number;
        ownerId: string;
    }>;
    getUsers(page?: string, limit?: string, role?: Role): Promise<{
        data: {
            id: string;
            createdAt: Date;
            name: string;
            country: string | null;
            city: string | null;
            email: string;
            role: import("@prisma/client").$Enums.Role;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
