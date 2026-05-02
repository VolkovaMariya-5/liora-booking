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
        reviews: ({
            client: {
                name: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            businessId: string;
            clientId: string;
            staffId: string;
            bookingId: string;
            rating: number;
            comment: string | null;
        })[];
        staff: ({
            user: {
                name: string;
                avatarUrl: string | null;
            };
            services: ({
                service: {
                    id: string;
                    name: string;
                    description: string | null;
                    isActive: boolean;
                    price: import("@prisma/client-runtime-utils").Decimal;
                    duration: number;
                    businessId: string;
                };
            } & {
                staffId: string;
                serviceId: string;
            })[];
            schedules: {
                id: string;
                startTime: string;
                endTime: string;
                staffId: string;
                dayOfWeek: number;
                isWorking: boolean;
            }[];
        } & {
            id: string;
            isActive: boolean;
            businessId: string;
            bio: string | null;
            photoUrl: string | null;
            userId: string;
        })[];
        services: {
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
            price: import("@prisma/client-runtime-utils").Decimal;
            duration: number;
            businessId: string;
        }[];
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
    findById(id: string): Promise<{
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
    findMyBusiness(ownerId: string): Promise<{
        staff: {
            id: string;
            isActive: boolean;
            businessId: string;
            bio: string | null;
            photoUrl: string | null;
            userId: string;
        }[];
        services: {
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
            price: import("@prisma/client-runtime-utils").Decimal;
            duration: number;
            businessId: string;
        }[];
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
    }>;
    update(id: string, dto: UpdateBusinessDto, userId: string, userRole: Role): Promise<{
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
    toggleActive(id: string): Promise<{
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
    recalculateVisibility(businessId: string): Promise<boolean>;
    findAllAdmin(page?: number, limit?: number): Promise<{
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
}
