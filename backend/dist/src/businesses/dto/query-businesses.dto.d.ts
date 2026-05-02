import { BusinessCategory } from '@prisma/client';
export declare class QueryBusinessesDto {
    search?: string;
    category?: BusinessCategory;
    country?: string;
    city?: string;
    page?: number;
    limit?: number;
    featured?: boolean;
}
