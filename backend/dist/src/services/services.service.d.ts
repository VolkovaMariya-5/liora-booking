import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { BusinessesService } from '../businesses/businesses.service';
export declare class ServicesService {
    private readonly prisma;
    private readonly businessesService;
    constructor(prisma: PrismaService, businessesService: BusinessesService);
    findByBusiness(businessId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
        businessId: string;
    }[]>;
    findByBusinessForAdmin(businessId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
        businessId: string;
    }[]>;
    create(businessId: string, dto: CreateServiceDto, ownerId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
        businessId: string;
    }>;
    update(id: string, dto: Partial<CreateServiceDto>, ownerId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
        businessId: string;
    }>;
    remove(id: string, ownerId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
        businessId: string;
    }>;
    private findById;
    private assertOwner;
}
