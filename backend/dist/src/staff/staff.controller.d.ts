import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { ScheduleDayDto } from './dto/update-schedule.dto';
import type { User } from '@prisma/client';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
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
    create(businessId: string, dto: CreateStaffDto, userId: string): Promise<({
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
    }, userId: string): Promise<{
        id: string;
        isActive: boolean;
        businessId: string;
        userId: string;
        bio: string | null;
        photoUrl: string | null;
    }>;
    deactivate(id: string, userId: string): Promise<{
        activeBookingsCount: number;
        id: string;
        isActive: boolean;
        businessId: string;
        userId: string;
        bio: string | null;
        photoUrl: string | null;
    }>;
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
    updateSchedule(staffId: string, schedule: ScheduleDayDto[], user: User): Promise<{
        id: string;
        staffId: string;
        dayOfWeek: number;
        startTime: string;
        endTime: string;
        isWorking: boolean;
    }[]>;
    getAvailableSlots(id: string, date: string, serviceIds: string): Promise<{
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
}
