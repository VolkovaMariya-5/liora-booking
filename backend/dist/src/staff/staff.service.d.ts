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
        user: {
            name: string;
            email: string;
            avatarUrl: string | null;
        };
        schedules: {
            id: string;
            staffId: string;
            dayOfWeek: number;
            startTime: string;
            endTime: string;
            isWorking: boolean;
        }[];
    } & {
        id: string;
        isActive: boolean;
        businessId: string;
        userId: string;
        bio: string | null;
        photoUrl: string | null;
    })[]>;
    findByBusinessForAdmin(businessId: string): Promise<({
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
    findById(id: string): Promise<{
        business: {
            maxAdvanceBookingDays: number;
        };
        services: ({
            service: {
                id: string;
                name: string;
                description: string | null;
                isActive: boolean;
                businessId: string;
                price: import("@prisma/client-runtime-utils").Decimal;
                duration: number;
            };
        } & {
            staffId: string;
            serviceId: string;
        })[];
        user: {
            name: string;
            avatarUrl: string | null;
        };
        schedules: {
            id: string;
            staffId: string;
            dayOfWeek: number;
            startTime: string;
            endTime: string;
            isWorking: boolean;
        }[];
    } & {
        id: string;
        isActive: boolean;
        businessId: string;
        userId: string;
        bio: string | null;
        photoUrl: string | null;
    }>;
    create(businessId: string, dto: CreateStaffDto, ownerId: string): Promise<({
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
    update(id: string, data: {
        bio?: string;
        photoUrl?: string;
        serviceIds?: string[];
    }, ownerId: string): Promise<{
        id: string;
        isActive: boolean;
        businessId: string;
        userId: string;
        bio: string | null;
        photoUrl: string | null;
    }>;
    activate(id: string, ownerId: string): Promise<{
        id: string;
        isActive: boolean;
        businessId: string;
        userId: string;
        bio: string | null;
        photoUrl: string | null;
    }>;
    deactivate(id: string, ownerId: string): Promise<{
        activeBookingsCount: number;
        id: string;
        isActive: boolean;
        businessId: string;
        userId: string;
        bio: string | null;
        photoUrl: string | null;
    }>;
    getScheduleByStaffId(staffId: string, ownerId: string): Promise<{
        id: string;
        staffId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isWorking: boolean;
    }[]>;
    getMySchedule(userId: string): Promise<{
        id: string;
        staffId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isWorking: boolean;
    }[]>;
    updateMySchedule(userId: string, schedule: ScheduleDayDto[]): Promise<{
        id: string;
        staffId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isWorking: boolean;
    }[]>;
    updateSchedule(staffId: string, schedule: ScheduleDayDto[], requesterId: string, requesterRole: Role): Promise<{
        id: string;
        staffId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
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
