import { StaffService } from './staff.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { ScheduleDayDto } from './dto/update-schedule.dto';
import type { User } from '@prisma/client';
export declare class StaffController {
    private readonly staffService;
    constructor(staffService: StaffService);
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
    create(businessId: string, dto: CreateStaffDto, userId: string): Promise<({
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
    }, userId: string): Promise<{
        id: string;
        isActive: boolean;
        businessId: string;
        bio: string | null;
        photoUrl: string | null;
        userId: string;
    }>;
    deactivate(id: string, userId: string): Promise<{
        activeBookingsCount: number;
        id: string;
        isActive: boolean;
        businessId: string;
        bio: string | null;
        photoUrl: string | null;
        userId: string;
    }>;
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
    updateSchedule(staffId: string, schedule: ScheduleDayDto[], user: User): Promise<{
        id: string;
        startTime: string;
        endTime: string;
        staffId: string;
        dayOfWeek: number;
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
