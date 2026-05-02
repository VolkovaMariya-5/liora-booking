import { PrismaService } from '../prisma/prisma.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { BookingStatus, Role } from '@prisma/client';
export declare class BookingsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(clientId: string, dto: CreateBookingDto): Promise<{
        staff: {
            user: {
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
            };
        } & {
            id: string;
            isActive: boolean;
            businessId: string;
            bio: string | null;
            photoUrl: string | null;
            userId: string;
        };
        items: ({
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
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            duration: number;
            bookingId: string;
            serviceId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        businessId: string;
        date: Date;
        startTime: string;
        endTime: string;
        totalPrice: import("@prisma/client-runtime-utils").Decimal;
        totalDuration: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        notes: string | null;
        clientId: string;
        staffId: string;
    }>;
    findAll(userId: string, userRole: Role, statusFilter?: BookingStatus): Promise<({
        staff: {
            user: {
                name: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            businessId: string;
            bio: string | null;
            photoUrl: string | null;
            userId: string;
        };
        business: {
            name: string;
            slug: string;
        };
        client: {
            name: string;
            phone: string | null;
        };
        items: ({
            service: {
                name: string;
            };
        } & {
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            duration: number;
            bookingId: string;
            serviceId: string;
        })[];
        review: {
            id: string;
            rating: number;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        businessId: string;
        date: Date;
        startTime: string;
        endTime: string;
        totalPrice: import("@prisma/client-runtime-utils").Decimal;
        totalDuration: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        notes: string | null;
        clientId: string;
        staffId: string;
    })[]>;
    findById(id: string, userId: string, userRole: Role): Promise<{
        staff: {
            user: {
                name: string;
                avatarUrl: string | null;
            };
        } & {
            id: string;
            isActive: boolean;
            businessId: string;
            bio: string | null;
            photoUrl: string | null;
            userId: string;
        };
        business: {
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
        };
        client: {
            email: string;
            name: string;
            phone: string | null;
        };
        items: ({
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
            id: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            duration: number;
            bookingId: string;
            serviceId: string;
        })[];
        review: {
            id: string;
            createdAt: Date;
            businessId: string;
            clientId: string;
            staffId: string;
            bookingId: string;
            rating: number;
            comment: string | null;
        } | null;
    } & {
        id: string;
        createdAt: Date;
        businessId: string;
        date: Date;
        startTime: string;
        endTime: string;
        totalPrice: import("@prisma/client-runtime-utils").Decimal;
        totalDuration: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        notes: string | null;
        clientId: string;
        staffId: string;
    }>;
    updateStatus(id: string, newStatus: BookingStatus, userId: string, userRole: Role): Promise<{
        id: string;
        createdAt: Date;
        businessId: string;
        date: Date;
        startTime: string;
        endTime: string;
        totalPrice: import("@prisma/client-runtime-utils").Decimal;
        totalDuration: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        notes: string | null;
        clientId: string;
        staffId: string;
    }>;
    private validateStatusTransition;
    private assertCancellationAllowed;
    private assertAccess;
    cancel(id: string, userId: string, userRole: Role): Promise<{
        id: string;
        createdAt: Date;
        businessId: string;
        date: Date;
        startTime: string;
        endTime: string;
        totalPrice: import("@prisma/client-runtime-utils").Decimal;
        totalDuration: number;
        status: import("@prisma/client").$Enums.BookingStatus;
        notes: string | null;
        clientId: string;
        staffId: string;
    }>;
    private addMinutes;
}
