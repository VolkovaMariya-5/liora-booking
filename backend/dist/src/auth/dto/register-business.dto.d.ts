import { BusinessCategory } from '@prisma/client';
export declare class RegisterBusinessDto {
    email: string;
    password: string;
    name: string;
    businessName: string;
    slug: string;
    category: BusinessCategory;
    country: string;
    city: string;
    description?: string;
    address?: string;
}
