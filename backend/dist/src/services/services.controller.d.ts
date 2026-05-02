import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
export declare class ServicesController {
    private readonly servicesService;
    constructor(servicesService: ServicesService);
    findAll(businessId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        businessId: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
    }[]>;
    create(businessId: string, dto: CreateServiceDto, userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        businessId: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
    }>;
    update(id: string, dto: Partial<CreateServiceDto>, userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        businessId: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        businessId: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
    }>;
}
