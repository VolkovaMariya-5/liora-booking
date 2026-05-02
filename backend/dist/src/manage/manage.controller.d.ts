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
        services: ({
            service: {
                id: string;
                name: string;
            };
        } & {
            staffId: string;
            serviceId: string;
        })[];
        user: {
            name: string;
            email: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        isActive: boolean;
        businessId: string;
        userId: string;
        bio: string | null;
        photoUrl: string | null;
    })[]>;
    createStaff(userId: string, dto: CreateStaffDto): Promise<({
        services: ({
            service: {
                id: string;
                name: string;
            };
        } & {
            staffId: string;
            serviceId: string;
        })[];
        user: {
            name: string;
            email: string;
            avatarUrl: string | null;
        };
    } & {
        id: string;
        isActive: boolean;
        businessId: string;
        userId: string;
        bio: string | null;
        photoUrl: string | null;
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
        userId: string;
        bio: string | null;
        photoUrl: string | null;
    }>;
    getStaffSchedule(staffId: string, userId: string): Promise<{
        id: string;
        staffId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isWorking: boolean;
    }[]>;
    updateStaffSchedule(staffId: string, userId: string, schedule: ScheduleDayDto[]): Promise<{
        id: string;
        staffId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isWorking: boolean;
    }[]>;
    getServices(userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        businessId: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
    }[]>;
    createService(userId: string, dto: CreateServiceDto): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        businessId: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
    }>;
    updateService(id: string, userId: string, dto: Partial<CreateServiceDto>): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        businessId: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
    }>;
    removeService(id: string, userId: string): Promise<{
        id: string;
        name: string;
        description: string | null;
        isActive: boolean;
        businessId: string;
        price: import("@prisma/client-runtime-utils").Decimal;
        duration: number;
    }>;
    getSettings(userId: string): Promise<{
        staff: {
            id: string;
            isActive: boolean;
            businessId: string;
            userId: string;
            bio: string | null;
            photoUrl: string | null;
        }[];
        services: {
            id: string;
            name: string;
            description: string | null;
            isActive: boolean;
            businessId: string;
            price: import("@prisma/client-runtime-utils").Decimal;
            duration: number;
        }[];
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        address: string | null;
        phone: string | null;
        logoUrl: string | null;
        category: import("@prisma/client").$Enums.BusinessCategory;
        country: string;
        city: string;
        isActive: boolean;
        isVisible: boolean;
        maxAdvanceBookingDays: number;
        ownerId: string;
        createdAt: Date;
    }>;
    updateSettings(userId: string, dto: Record<string, unknown>): Promise<{
        id: string;
        name: string;
        slug: string;
        description: string | null;
        address: string | null;
        phone: string | null;
        logoUrl: string | null;
        category: import("@prisma/client").$Enums.BusinessCategory;
        country: string;
        city: string;
        isActive: boolean;
        isVisible: boolean;
        maxAdvanceBookingDays: number;
        ownerId: string;
        createdAt: Date;
    }>;
}
