import { ReviewsService } from './reviews.service';
import type { User } from '@prisma/client';
export declare class ReviewsController {
    private readonly reviewsService;
    constructor(reviewsService: ReviewsService);
    create(userId: string, body: {
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
    remove(id: string, user: User): Promise<{
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
