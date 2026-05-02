import { PrismaService } from '../prisma/prisma.service';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { QueryBusinessesDto } from './dto/query-businesses.dto';
import { Role } from '@prisma/client';
export declare class BusinessesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(query: QueryBusinessesDto): Promise<{
        data: {
            reviews: undefined;
            staff: undefined;
            staffCount: number;
            avgRating: number | null;
            reviewCount: number;
            id: string;
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
            createdAt: Date;
        }[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findBySlug(slug: string): Promise<{
        avgRating: number | null;
        reviewCount: number;
        staff: ({
            services: ({
                service: {
                    id: string;
                    name: string;
                    description: string | null;
                    isActive: boolean;
                    businessId: string;
                    price: import("@prisma/client-runtime-utils").Decimal;
                    duration: number;
                };
            } & {
                staffId: string;
                serviceId: string;
            })[];
            user: {
                name: string;
                avatarUrl: string | null;
            };
            schedules: {
                id: string;
                staffId: string;
                dayOfWeek: number;
                startTime: string;
                endTime: string;
                isWorking: boolean;
            }[];
        } & {
            id: string;
            isActive: boolean;
            businessId: string;
            userId: string;
            bio: string | null;
            photoUrl: string | null;
        })[];
        services: {
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
            businessId: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            duration: number;
        }[];
        reviews: ({
            client: {
                name: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            bookingId: string;
            clientId: string;
            staffId: string;
            businessId: string;
            rating: number;
            comment: string | null;
        })[];
        id: string;
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
        createdAt: Date;
    }>;
    findById(id: string): Promise<{
        id: string;
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
        createdAt: Date;
    }>;
    findMyBusiness(ownerId: string): Promise<{
        staff: {
            id: string;
            isActive: boolean;
            businessId: string;
            userId: string;
            bio: string | null;
            photoUrl: string | null;
        }[];
        services: {
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
            businessId: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            duration: number;
        }[];
    } & {
        id: string;
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
        createdAt: Date;
    }>;
    update(id: string, dto: UpdateBusinessDto, userId: string, userRole: Role): Promise<{
        id: string;
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
        createdAt: Date;
    }>;
    toggleActive(id: string): Promise<{
        id: string;
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
        createdAt: Date;
    }>;
    toggleFeatured(id: string): Promise<{
        id: string;
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
        createdAt: Date;
    }>;
    recalculateVisibility(businessId: string): Promise<boolean>;
    findAllAdmin(page?: number, limit?: number): Promise<{
        data: ({
            owner: {
                name: string;
                email: string;
            };
        } & {
            id: string;
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
            createdAt: Date;
        })[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
}
