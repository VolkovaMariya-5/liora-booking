import { BusinessCategory } from '@prisma/client';
export declare class CreateBusinessDto {
    name: string;
    slug: string;
    category: BusinessCategory;
    country: string;
    city: string;
    description?: string;
    address?: string;
    phone?: string;
}
