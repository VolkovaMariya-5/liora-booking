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
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
        businessId: string;
    }[]>;
    create(businessId: string, dto: CreateServiceDto, userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
        businessId: string;
    }>;
    update(id: string, dto: Partial<CreateServiceDto>, userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
        businessId: string;
    }>;
    remove(id: string, userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
        businessId: string;
    }>;
}
