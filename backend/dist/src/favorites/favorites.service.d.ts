import { PrismaService } from '../prisma/prisma.service';
export declare class FavoritesService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    findAll(clientId: string): Promise<({
        staff: {
            user: {
                name: string;
                avatarUrl: string | null;
            };
            services: ({
                service: {
                    name: string;
                    price: import("@prisma/client-runtime-utils").Decimal;
                };
            } & {
                staffId: string;
                serviceId: string;
            })[];
            business: {
                name: string;
                slug: string;
            };
        } & {
            id: string;
            isActive: boolean;
            businessId: string;
            bio: string | null;
            photoUrl: string | null;
            userId: string;
        };
    } & {
        id: string;
        createdAt: Date;
        clientId: string;
        staffId: string;
    })[]>;
    add(clientId: string, staffId: string): Promise<{
        id: string;
        createdAt: Date;
        clientId: string;
        staffId: string;
    }>;
    remove(clientId: string, staffId: string): Promise<{
        id: string;
        createdAt: Date;
        clientId: string;
        staffId: string;
    }>;
    check(clientId: string, staffId: string): Promise<{
        isFavorite: boolean;
    }>;
}
