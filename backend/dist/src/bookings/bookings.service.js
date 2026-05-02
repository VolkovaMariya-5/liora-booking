"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const bookings_constants_1 = require("./bookings.constants");
let BookingsService = class BookingsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(clientId, dto) {
        const services = await this.prisma.service.findMany({
            where: { id: { in: dto.serviceIds }, isActive: true },
        });
        if (services.length !== dto.serviceIds.length) {
            throw new common_1.BadRequestException('Одна или несколько услуг не найдены или неактивны');
        }
        const totalDuration = services.reduce((sum, s) => sum + s.duration, 0);
        const totalPrice = services.reduce((sum, s) => sum + Number(s.price), 0);
        const endTime = this.addMinutes(dto.startTime, totalDuration);
        const bookingDate = new Date(dto.date);
        bookingDate.setHours(0, 0, 0, 0);
        return this.prisma.$transaction(async (tx) => {
            const conflict = await tx.booking.findFirst({
                where: {
                    staffId: dto.staffId,
                    date: bookingDate,
                    status: { in: [client_1.BookingStatus.PENDING, client_1.BookingStatus.CONFIRMED] },
                    AND: [
                        { startTime: { lt: endTime } },
                        { endTime: { gt: dto.startTime } },
                    ],
                },
            });
            if (conflict) {
                throw new common_1.ConflictException('Этот временной слот уже занят. Выберите другое время.');
            }
            const booking = await tx.booking.create({
                data: {
                    clientId,
                    staffId: dto.staffId,
                    businessId: dto.businessId,
                    date: bookingDate,
                    startTime: dto.startTime,
                    endTime,
                    totalPrice,
                    totalDuration,
                    status: client_1.BookingStatus.PENDING,
                    notes: dto.notes,
                    items: {
                        create: services.map((s) => ({
                            serviceId: s.id,
                            price: s.price,
                            duration: s.duration,
                        })),
                    },
                },
                include: { items: { include: { service: true } }, staff: { include: { user: true } } },
            });
            return booking;
        });
    }
    async findAll(userId, userRole, statusFilter) {
        let where = {};
        if (userRole === client_1.Role.CLIENT) {
            where = { clientId: userId };
        }
        else if (userRole === client_1.Role.STAFF) {
            const staff = await this.prisma.staff.findUnique({ where: { userId } });
            if (!staff)
                return [];
            where = { staffId: staff.id };
        }
        else if (userRole === client_1.Role.BUSINESS_ADMIN) {
            const business = await this.prisma.business.findUnique({ where: { ownerId: userId } });
            if (!business)
                return [];
            where = { businessId: business.id };
        }
        if (statusFilter) {
            where.status = statusFilter;
        }
        return this.prisma.booking.findMany({
            where,
            orderBy: [{ date: 'desc' }, { startTime: 'desc' }],
            include: {
                items: { include: { service: { select: { name: true } } } },
                staff: { include: { user: { select: { name: true, avatarUrl: true } } } },
                client: { select: { name: true, phone: true } },
                business: { select: { name: true, slug: true } },
                review: { select: { id: true, rating: true } },
            },
        });
    }
    async findById(id, userId, userRole) {
        const booking = await this.prisma.booking.findUnique({
            where: { id },
            include: {
                items: { include: { service: true } },
                staff: { include: { user: { select: { name: true, avatarUrl: true } } } },
                client: { select: { name: true, phone: true, email: true } },
                business: true,
                review: true,
            },
        });
        if (!booking)
            throw new common_1.NotFoundException('Запись не найдена');
        await this.assertAccess(booking, userId, userRole);
        return booking;
    }
    async updateStatus(id, newStatus, userId, userRole) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking)
            throw new common_1.NotFoundException('Запись не найдена');
        await this.assertAccess(booking, userId, userRole);
        this.validateStatusTransition(booking.status, newStatus, userRole);
        if (userRole === client_1.Role.CLIENT &&
            newStatus === client_1.BookingStatus.CANCELLED &&
            booking.status === client_1.BookingStatus.CONFIRMED) {
            this.assertCancellationAllowed(booking.date, booking.startTime);
        }
        return this.prisma.booking.update({
            where: { id },
            data: { status: newStatus },
        });
    }
    validateStatusTransition(current, next, role) {
        const allowed = {
            [client_1.BookingStatus.PENDING]: {
                [client_1.Role.STAFF]: [client_1.BookingStatus.CONFIRMED, client_1.BookingStatus.CANCELLED],
                [client_1.Role.BUSINESS_ADMIN]: [client_1.BookingStatus.CONFIRMED, client_1.BookingStatus.CANCELLED],
                [client_1.Role.CLIENT]: [client_1.BookingStatus.CANCELLED],
            },
            [client_1.BookingStatus.CONFIRMED]: {
                [client_1.Role.STAFF]: [client_1.BookingStatus.COMPLETED, client_1.BookingStatus.CANCELLED],
                [client_1.Role.BUSINESS_ADMIN]: [client_1.BookingStatus.COMPLETED, client_1.BookingStatus.CANCELLED],
                [client_1.Role.CLIENT]: [client_1.BookingStatus.CANCELLED],
            },
        };
        const allowedForRole = allowed[current]?.[role] || [];
        if (!allowedForRole.includes(next)) {
            throw new common_1.ForbiddenException(`Переход статуса ${current} → ${next} недопустим для вашей роли`);
        }
    }
    assertCancellationAllowed(bookingDate, startTime) {
        const [hours, minutes] = startTime.split(':').map(Number);
        const visitDateTime = new Date(bookingDate);
        visitDateTime.setHours(hours, minutes, 0, 0);
        const now = new Date();
        const diffMs = visitDateTime.getTime() - now.getTime();
        const diffHours = diffMs / (1000 * 60 * 60);
        if (diffHours < bookings_constants_1.CANCELLATION_HOURS_LIMIT) {
            throw new common_1.BadRequestException(`Отменить запись можно не позднее чем за ${bookings_constants_1.CANCELLATION_HOURS_LIMIT} часа до начала`);
        }
    }
    async assertAccess(booking, userId, userRole) {
        if (userRole === client_1.Role.SUPER_ADMIN)
            return;
        if (userRole === client_1.Role.CLIENT && booking.clientId !== userId) {
            throw new common_1.ForbiddenException('Нет доступа к этой записи');
        }
        if (userRole === client_1.Role.STAFF) {
            const staff = await this.prisma.staff.findUnique({ where: { userId } });
            if (!staff || staff.id !== booking.staffId) {
                throw new common_1.ForbiddenException('Нет доступа к этой записи');
            }
        }
        if (userRole === client_1.Role.BUSINESS_ADMIN) {
            const business = await this.prisma.business.findUnique({ where: { ownerId: userId } });
            if (!business || business.id !== booking.businessId) {
                throw new common_1.ForbiddenException('Нет доступа к этой записи');
            }
        }
    }
    async cancel(id, userId, userRole) {
        const booking = await this.prisma.booking.findUnique({ where: { id } });
        if (!booking)
            throw new common_1.NotFoundException('Запись не найдена');
        await this.assertAccess(booking, userId, userRole);
        if (booking.status !== client_1.BookingStatus.PENDING &&
            booking.status !== client_1.BookingStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Нельзя отменить запись в статусе ' + booking.status);
        }
        if (userRole === client_1.Role.CLIENT && booking.status === client_1.BookingStatus.CONFIRMED) {
            this.assertCancellationAllowed(booking.date, booking.startTime);
        }
        return this.prisma.booking.update({
            where: { id },
            data: { status: client_1.BookingStatus.CANCELLED },
        });
    }
    addMinutes(time, minutes) {
        const [h, m] = time.split(':').map(Number);
        const total = h * 60 + m + minutes;
        const nh = Math.floor(total / 60);
        const nm = total % 60;
        return `${String(nh).padStart(2, '0')}:${String(nm).padStart(2, '0')}`;
    }
};
exports.BookingsService = BookingsService;
exports.BookingsService = BookingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BookingsService);
//# sourceMappingURL=bookings.service.js.map