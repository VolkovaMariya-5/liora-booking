import { BusinessesService } from '../businesses/businesses.service';
import { StaffService } from '../staff/staff.service';
import { ServicesService } from '../services/services.service';
import { CreateStaffDto } from '../staff/dto/create-staff.dto';
import { CreateServiceDto } from '../services/dto/create-service.dto';
import { ScheduleDayDto } from '../staff/dto/update-schedule.dto';
export declare class ManageController {
    private readonly businessesService;
    private readonly staffService;
    private readonly servicesService;
    constructor(businessesService: BusinessesService, staffService: StaffService, servicesService: ServicesService);
    getStaff(userId: string): Promise<({
        user: {
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        services: ({
            service: {
                id: string;
                name: string;
            };
        } & {
            staffId: string;
            serviceId: string;
        })[];
    } & {
        id: string;
        isActive: boolean;
        businessId: string;
        bio: string | null;
        photoUrl: string | null;
        userId: string;
    })[]>;
    createStaff(userId: string, dto: CreateStaffDto): Promise<({
        user: {
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        services: ({
            service: {
                id: string;
                name: string;
            };
        } & {
            staffId: string;
            serviceId: string;
        })[];
    } & {
        id: string;
        isActive: boolean;
        businessId: string;
        bio: string | null;
        photoUrl: string | null;
        userId: string;
    }) | null>;
    updateStaff(id: string, userId: string, data: {
        bio?: string;
        photoUrl?: string;
        serviceIds?: string[];
        isActive?: boolean;
    }): Promise<{
        id: string;
        isActive: boolean;
        businessId: string;
        bio: string | null;
        photoUrl: string | null;
        userId: string;
    }>;
    getStaffSchedule(staffId: string, userId: string): Promise<{
        id: string;
        startTime: string;
        endTime: string;
        staffId: string;
        dayOfWeek: number;
        isWorking: boolean;
    }[]>;
    updateStaffSchedule(staffId: string, userId: string, schedule: ScheduleDayDto[]): Promise<{
        id: string;
        startTime: string;
        endTime: string;
        staffId: string;
        dayOfWeek: number;
        isWorking: boolean;
    }[]>;
    getServices(userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
        businessId: string;
    }[]>;
    createService(userId: string, dto: CreateServiceDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
        businessId: string;
    }>;
    updateService(id: string, userId: string, dto: Partial<CreateServiceDto>): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
        businessId: string;
    }>;
    removeService(id: string, userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
        businessId: string;
    }>;
    getSettings(userId: string): Promise<{
        staff: {
            id: string;
            isActive: boolean;
            businessId: string;
            bio: string | null;
            photoUrl: string | null;
            userId: string;
        }[];
        services: {
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
            price: import("@prisma/client-runtime-utils").Decimal;
            duration: number;
            businessId: string;
        }[];
    } & {
        id: string;
        name: string;
        phone: string | null;
        country: string;
        city: string;
        createdAt: Date;
        slug: string;
        description: string | null;
        address: string | null;
        logoUrl: string | null;
        category: import("@prisma/client").$Enums.BusinessCategory;
        isActive: boolean;
        isVisible: boolean;
        isFeatured: boolean;
        maxAdvanceBookingDays: number;
        ownerId: string;
    }>;
    updateSettings(userId: string, dto: Record<string, unknown>): Promise<{
        id: string;
        name: string;
        phone: string | null;
        country: string;
        city: string;
        createdAt: Date;
        slug: string;
        description: string | null;
        address: string | null;
        logoUrl: string | null;
        category: import("@prisma/client").$Enums.BusinessCategory;
        isActive: boolean;
        isVisible: boolean;
        isFeatured: boolean;
        maxAdvanceBookingDays: number;
        ownerId: string;
    }>;
}
