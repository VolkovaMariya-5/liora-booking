import { FavoritesService } from './favorites.service';
export declare class FavoritesController {
    private readonly favoritesService;
    constructor(favoritesService: FavoritesService);
    findAll(userId: string): Promise<({
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
    add(userId: string, staffId: string): Promise<{
        id: string;
        createdAt: Date;
        clientId: string;
        staffId: string;
    }>;
    remove(userId: string, staffId: string): Promise<{
        id: string;
        createdAt: Date;
        clientId: string;
        staffId: string;
    }>;
    check(userId: string, staffId: string): Promise<{
        isFavorite: boolean;
    }>;
}
