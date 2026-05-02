import { PrismaService } from '../prisma/prisma.service';
import { Role } from '@prisma/client';
export declare class ReviewsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    create(clientId: string, data: {
        bookingId: string;
        rating: number;
        comment?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        businessId: string;
        clientId: string;
        staffId: string;
        bookingId: string;
        rating: number;
        comment: string | null;
    }>;
    findByBusiness(businessId: string): Promise<({
        client: {
            name: string;
            avatarUrl: string | null;
        };
        booking: {
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
    })[]>;
    remove(id: string, userRole: Role): Promise<{
        id: string;
        createdAt: Date;
        businessId: string;
        clientId: string;
        staffId: string;
        bookingId: string;
        rating: number;
        comment: string | null;
    }>;
}
