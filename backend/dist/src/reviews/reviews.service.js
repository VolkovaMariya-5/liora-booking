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
exports.ReviewsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let ReviewsService = class ReviewsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(clientId, data) {
        const booking = await this.prisma.booking.findUnique({
            where: { id: data.bookingId },
            include: { review: true },
        });
        if (!booking)
            throw new common_1.NotFoundException('Запись не найдена');
        if (booking.clientId !== clientId)
            throw new common_1.ForbiddenException('Нет доступа');
        if (booking.status !== client_1.BookingStatus.COMPLETED) {
            throw new common_1.BadRequestException('Отзыв можно оставить только после завершённого визита');
        }
        if (booking.review) {
            throw new common_1.ConflictException('Вы уже оставили отзыв на эту запись');
        }
        if (data.rating < 1 || data.rating > 5) {
            throw new common_1.BadRequestException('Оценка должна быть от 1 до 5');
        }
        return this.prisma.review.create({
            data: {
                bookingId: data.bookingId,
                clientId,
                staffId: booking.staffId,
                businessId: booking.businessId,
                rating: data.rating,
                comment: data.comment,
            },
        });
    }
    async findByBusiness(businessId) {
        return this.prisma.review.findMany({
            where: { businessId },
            orderBy: { createdAt: 'desc' },
            take: 50,
            include: {
                client: { select: { name: true, avatarUrl: true } },
                booking: { select: { items: { include: { service: { select: { name: true } } } } } },
            },
        });
    }
    async remove(id, userRole) {
        if (userRole !== client_1.Role.SUPER_ADMIN)
            throw new common_1.ForbiddenException('Только SUPER_ADMIN');
        const review = await this.prisma.review.findUnique({ where: { id } });
        if (!review)
            throw new common_1.NotFoundException('Отзыв не найден');
        return this.prisma.review.delete({ where: { id } });
    }
};
exports.ReviewsService = ReviewsService;
exports.ReviewsService = ReviewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ReviewsService);
//# sourceMappingURL=reviews.service.js.map