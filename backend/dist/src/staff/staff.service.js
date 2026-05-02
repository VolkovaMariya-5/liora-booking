"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const businesses_service_1 = require("../businesses/businesses.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
let StaffService = class StaffService {
    prisma;
    businessesService;
    constructor(prisma, businessesService) {
        this.prisma = prisma;
        this.businessesService = businessesService;
    }
    async findByBusiness(businessId) {
        return this.prisma.staff.findMany({
            where: { businessId, isActive: true },
            include: {
                user: { select: { name: true, avatarUrl: true, email: true } },
                services: { include: { service: { select: { id: true, name: true, price: true, duration: true } } } },
                schedules: true,
            },
        });
    }
    async findByBusinessForAdmin(businessId) {
        return this.prisma.staff.findMany({
            where: { businessId },
            include: {
                user: { select: { name: true, avatarUrl: true, email: true } },
                services: { include: { service: { select: { id: true, name: true } } } },
            },
            orderBy: { id: 'asc' },
        });
    }
    async findById(id) {
        const staff = await this.prisma.staff.findUnique({
            where: { id },
            include: {
                user: { select: { name: true, avatarUrl: true } },
                services: { include: { service: true } },
                schedules: true,
                business: { select: { maxAdvanceBookingDays: true } },
            },
        });
        if (!staff)
            throw new common_1.NotFoundException('Мастер не найден');
        return staff;
    }
    async create(businessId, dto, ownerId) {
        await this.assertOwner(businessId, ownerId);
        const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (existing)
            throw new common_1.ConflictException('Пользователь с таким email уже существует');
        const result = await this.prisma.$transaction(async (tx) => {
            const passwordHash = await bcrypt.hash(dto.password, 10);
            const user = await tx.user.create({
                data: {
                    email: dto.email,
                    passwordHash,
                    name: dto.name,
                    role: client_1.Role.STAFF,
                },
            });
            const staff = await tx.staff.create({
                data: {
                    userId: user.id,
                    businessId,
                    bio: dto.bio,
                },
            });
            if (dto.serviceIds?.length) {
                await tx.staffService.createMany({
                    data: dto.serviceIds.map((serviceId) => ({ staffId: staff.id, serviceId })),
                });
            }
            return staff;
        });
        await this.businessesService.recalculateVisibility(businessId);
        return this.prisma.staff.findUnique({
            where: { id: result.id },
            include: {
                user: { select: { name: true, email: true, avatarUrl: true } },
                services: { include: { service: { select: { id: true, name: true } } } },
            },
        });
    }
    async update(id, data, ownerId) {
        const staff = await this.prisma.staff.findUnique({ where: { id } });
        if (!staff)
            throw new common_1.NotFoundException('Мастер не найден');
        await this.assertOwner(staff.businessId, ownerId);
        return this.prisma.$transaction(async (tx) => {
            const updated = await tx.staff.update({
                where: { id },
                data: { bio: data.bio, photoUrl: data.photoUrl },
            });
            if (data.serviceIds !== undefined) {
                await tx.staffService.deleteMany({ where: { staffId: id } });
                if (data.serviceIds.length) {
                    await tx.staffService.createMany({
                        data: data.serviceIds.map((serviceId) => ({ staffId: id, serviceId })),
                    });
                }
            }
            return updated;
        });
    }
    async activate(id, ownerId) {
        const staff = await this.prisma.staff.findUnique({ where: { id } });
        if (!staff)
            throw new common_1.NotFoundException('Мастер не найден');
        await this.assertOwner(staff.businessId, ownerId);
        const updated = await this.prisma.staff.update({
            where: { id },
            data: { isActive: true },
        });
        await this.businessesService.recalculateVisibility(staff.businessId);
        return updated;
    }
    async deactivate(id, ownerId) {
        const staff = await this.prisma.staff.findUnique({ where: { id } });
        if (!staff)
            throw new common_1.NotFoundException('Мастер не найден');
        await this.assertOwner(staff.businessId, ownerId);
        const activeBookings = await this.prisma.booking.count({
            where: { staffId: id, status: { in: ['PENDING', 'CONFIRMED'] } },
        });
        const updated = await this.prisma.staff.update({
            where: { id },
            data: { isActive: false },
        });
        await this.businessesService.recalculateVisibility(staff.businessId);
        return { ...updated, activeBookingsCount: activeBookings };
    }
    async getScheduleByStaffId(staffId, ownerId) {
        const staff = await this.prisma.staff.findUnique({ where: { id: staffId } });
        if (!staff)
            throw new common_1.NotFoundException('Мастер не найден');
        await this.assertOwner(staff.businessId, ownerId);
        return this.prisma.schedule.findMany({
            where: { staffId },
            orderBy: { dayOfWeek: 'asc' },
        });
    }
    async getMySchedule(userId) {
        const staff = await this.prisma.staff.findUnique({ where: { userId } });
        if (!staff)
            throw new common_1.NotFoundException('Профиль мастера не найден');
        return this.prisma.schedule.findMany({
            where: { staffId: staff.id },
            orderBy: { dayOfWeek: 'asc' },
        });
    }
    async updateMySchedule(userId, schedule) {
        const staff = await this.prisma.staff.findUnique({ where: { userId } });
        if (!staff)
            throw new common_1.NotFoundException('Профиль мастера не найден');
        return this.updateSchedule(staff.id, schedule, userId, client_1.Role.STAFF);
    }
    async updateSchedule(staffId, schedule, requesterId, requesterRole) {
        const staff = await this.prisma.staff.findUnique({
            where: { id: staffId },
            include: { business: true },
        });
        if (!staff)
            throw new common_1.NotFoundException('Мастер не найден');
        const isOwner = staff.business.ownerId === requesterId;
        const isOwnStaff = staff.userId === requesterId;
        if (!isOwner && !isOwnStaff) {
            throw new common_1.ForbiddenException('Недостаточно прав');
        }
        return this.prisma.$transaction(async (tx) => {
            await tx.schedule.deleteMany({ where: { staffId } });
            await tx.schedule.createMany({
                data: schedule.map((day) => ({ ...day, staffId })),
            });
            return tx.schedule.findMany({ where: { staffId }, orderBy: { dayOfWeek: 'asc' } });
        });
    }
    async getAvailableSlots(staffId, date, serviceIds) {
        const staff = await this.findById(staffId);
        const requestedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const maxDate = new Date(today);
        maxDate.setDate(maxDate.getDate() + staff.business.maxAdvanceBookingDays);
        if (requestedDate < today) {
            throw new common_1.BadRequestException('Нельзя записаться на прошедшую дату');
        }
        if (requestedDate > maxDate) {
            throw new common_1.BadRequestException(`Запись доступна только на ${staff.business.maxAdvanceBookingDays} дней вперёд`);
        }
        const dayOfWeek = requestedDate.getDay();
        const daySchedule = staff.schedules.find((s) => s.dayOfWeek === dayOfWeek);
        if (!daySchedule || !daySchedule.isWorking) {
            return { date, slots: [], message: 'В этот день мастер не работает' };
        }
        let totalDuration = 0;
        if (serviceIds.length > 0) {
            const services = await this.prisma.service.findMany({
                where: { id: { in: serviceIds } },
                select: { duration: true },
            });
            totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
        }
        if (totalDuration === 0) {
            throw new common_1.BadRequestException('Не выбраны услуги для расчёта слотов');
        }
        const bookings = await this.prisma.booking.findMany({
            where: {
                staffId,
                date: requestedDate,
                status: { in: ['PENDING', 'CONFIRMED'] },
            },
            select: { startTime: true, endTime: true },
        });
        const slots = this.generateSlots(daySchedule.startTime, daySchedule.endTime, totalDuration, bookings);
        return { date, slots, totalDuration };
    }
    generateSlots(startWork, endWork, duration, occupied) {
        const slots = [];
        const toMinutes = (time) => {
            const [h, m] = time.split(':').map(Number);
            return h * 60 + m;
        };
        const fromMinutes = (minutes) => {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        };
        const workStart = toMinutes(startWork);
        const workEnd = toMinutes(endWork);
        const busyIntervals = occupied.map((b) => ({
            start: toMinutes(b.startTime),
            end: toMinutes(b.endTime),
        }));
        for (let time = workStart; time + duration <= workEnd; time += 30) {
            const slotEnd = time + duration;
            const isOccupied = busyIntervals.some((busy) => time < busy.end && slotEnd > busy.start);
            if (!isOccupied) {
                slots.push(fromMinutes(time));
            }
        }
        return slots;
    }
    async assertOwner(businessId, ownerId) {
        const business = await this.prisma.business.findUnique({ where: { id: businessId } });
        if (!business || business.ownerId !== ownerId) {
            throw new common_1.ForbiddenException('Недостаточно прав');
        }
    }
};
exports.StaffService = StaffService;
exports.StaffService = StaffService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        businesses_service_1.BusinessesService])
], StaffService);
//# sourceMappingURL=staff.service.js.map