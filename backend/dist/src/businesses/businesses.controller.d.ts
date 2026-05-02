import { BusinessesService } from './businesses.service';
import { UpdateBusinessDto } from './dto/update-business.dto';
import { QueryBusinessesDto } from './dto/query-businesses.dto';
import type { User } from '@prisma/client';
export declare class BusinessesController {
    private readonly businessesService;
    constructor(businessesService: BusinessesService);
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
    getMyBusiness(userId: string): Promise<{
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
    update(id: string, dto: UpdateBusinessDto, user: User): Promise<{
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
    toggle(id: string): Promise<{
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
}
