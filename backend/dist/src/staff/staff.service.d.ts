import { PrismaService } from '../prisma/prisma.service';
import { BusinessesService } from '../businesses/businesses.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { ScheduleDayDto } from './dto/update-schedule.dto';
import { Role } from '@prisma/client';
export declare class StaffService {
    private readonly prisma;
    private readonly businessesService;
    constructor(prisma: PrismaService, businessesService: BusinessesService);
    findByBusiness(businessId: string): Promise<({
        user: {
            email: string;
            name: string;
            avatarUrl: string | null;
        };
        services: ({
            service: {
                id: string;
                name: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                duration: number;
            };
        } & {
            staffId: string;
            serviceId: string;
        })[];
        schedules: {
            id: string;
            startTime: string;
            endTime: string;
            staffId: string;
            dayOfWeek: number;
            isWorking: boolean;
        }[];
    } & {
        id: string;
        isActive: boolean;
        businessId: string;
        bio: string | null;
        photoUrl: string | null;
        userId: string;
    })[]>;
    findByBusinessForAdmin(businessId: string): Promise<({
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
    findById(id: string): Promise<{
        user: {
            name: string;
            avatarUrl: string | null;
        };
        services: ({
            service: {
                id: string;
                name: string;
                description: string | null;
                isActive: boolean;
                price: import("@prisma/client-runtime-utils").Decimal;
                duration: number;
                businessId: string;
            };
        } & {
            staffId: string;
            serviceId: string;
        })[];
        business: {
            maxAdvanceBookingDays: number;
        };
        schedules: {
            id: string;
            startTime: string;
            endTime: string;
            staffId: string;
            dayOfWeek: number;
            isWorking: boolean;
        }[];
    } & {
        id: string;
        isActive: boolean;
        businessId: string;
        bio: string | null;
        photoUrl: string | null;
        userId: string;
    }>;
    create(businessId: string, dto: CreateStaffDto, ownerId: string): Promise<({
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
    update(id: string, data: {
        bio?: string;
        photoUrl?: string;
        serviceIds?: string[];
    }, ownerId: string): Promise<{
        id: string;
        isActive: boolean;
        businessId: string;
        bio: string | null;
        photoUrl: string | null;
        userId: string;
    }>;
    activate(id: string, ownerId: string): Promise<{
        id: string;
        isActive: boolean;
        businessId: string;
        bio: string | null;
        photoUrl: string | null;
        userId: string;
    }>;
    deactivate(id: string, ownerId: string): Promise<{
        activeBookingsCount: number;
        id: string;
        isActive: boolean;
        businessId: string;
        bio: string | null;
        photoUrl: string | null;
        userId: string;
    }>;
    getScheduleByStaffId(staffId: string, ownerId: string): Promise<{
        id: string;
        startTime: string;
        endTime: string;
        staffId: string;
        dayOfWeek: number;
        isWorking: boolean;
    }[]>;
    getMySchedule(userId: string): Promise<{
        id: string;
        startTime: string;
        endTime: string;
        staffId: string;
        dayOfWeek: number;
        isWorking: boolean;
    }[]>;
    updateMySchedule(userId: string, schedule: ScheduleDayDto[]): Promise<{
        id: string;
        startTime: string;
        endTime: string;
        staffId: string;
        dayOfWeek: number;
        isWorking: boolean;
    }[]>;
    updateSchedule(staffId: string, schedule: ScheduleDayDto[], requesterId: string, requesterRole: Role): Promise<{
        id: string;
        startTime: string;
        endTime: string;
        staffId: string;
        dayOfWeek: number;
        isWorking: boolean;
    }[]>;
    getAvailableSlots(staffId: string, date: string, serviceIds: string[]): Promise<{
        date: string;
        slots: never[];
        message: string;
        totalDuration?: undefined;
    } | {
        date: string;
        slots: string[];
        totalDuration: number;
        message?: undefined;
    }>;
    private generateSlots;
    private assertOwner;
}
