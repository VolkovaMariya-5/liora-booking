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
exports.BusinessesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let BusinessesService = class BusinessesService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll(query) {
        const { search, category, country, city, page = 1, limit = 12, featured } = query;
        const skip = (page - 1) * limit;
        const where = {
            isActive: true,
            isVisible: true,
            ...(featured && { isFeatured: true }),
            ...(category && { category }),
            ...(country && { country }),
            ...(city && { city }),
            ...(search && {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { description: { contains: search, mode: 'insensitive' } },
                ],
            }),
        };
        const [businesses, total] = await Promise.all([
            this.prisma.business.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: {
                    reviews: { select: { rating: true } },
                    staff: { where: { isActive: true }, select: { id: true } },
                },
            }),
            this.prisma.business.count({ where }),
        ]);
        const result = businesses.map((b) => {
            const ratings = b.reviews.map((r) => r.rating);
            const avgRating = ratings.length
                ? Math.round((ratings.reduce((a, c) => a + c, 0) / ratings.length) * 10) / 10
                : null;
            return {
                ...b,
                reviews: undefined,
                staff: undefined,
                staffCount: b.staff.length,
                avgRating,
                reviewCount: ratings.length,
            };
        });
        return {
            data: result,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findBySlug(slug) {
        const business = await this.prisma.business.findUnique({
            where: { slug },
            include: {
                staff: {
                    where: { isActive: true },
                    include: {
                        user: { select: { name: true, avatarUrl: true } },
                        services: { include: { service: true } },
                        schedules: true,
                    },
                },
                services: { where: { isActive: true } },
                reviews: {
                    orderBy: { createdAt: 'desc' },
                    take: 20,
                    include: { client: { select: { name: true, avatarUrl: true } } },
                },
            },
        });
        if (!business || (!business.isActive && !business.isVisible)) {
            throw new common_1.NotFoundException('Бизнес не найден');
        }
        const ratings = business.reviews.map((r) => r.rating);
        const avgRating = ratings.length
            ? Math.round((ratings.reduce((a, c) => a + c, 0) / ratings.length) * 10) / 10
            : null;
        return { ...business, avgRating, reviewCount: ratings.length };
    }
    async findById(id) {
        const business = await this.prisma.business.findUnique({ where: { id } });
        if (!business)
            throw new common_1.NotFoundException('Бизнес не найден');
        return business;
    }
    async findMyBusiness(ownerId) {
        const business = await this.prisma.business.findUnique({
            where: { ownerId },
            include: { staff: true, services: true },
        });
        if (!business)
            throw new common_1.NotFoundException('У вас ещё нет зарегистрированного бизнеса');
        return business;
    }
    async update(id, dto, userId, userRole) {
        const business = await this.findById(id);
        if (userRole !== client_1.Role.SUPER_ADMIN && business.ownerId !== userId) {
            throw new common_1.ForbiddenException('Вы не являетесь владельцем этого бизнеса');
        }
        if (dto.slug && dto.slug !== business.slug) {
            const existing = await this.prisma.business.findUnique({ where: { slug: dto.slug } });
            if (existing)
                throw new common_1.ConflictException('Этот адрес (slug) уже занят');
        }
        return this.prisma.business.update({ where: { id }, data: dto });
    }
    async toggleActive(id) {
        const business = await this.findById(id);
        return this.prisma.business.update({
            where: { id },
            data: { isActive: !business.isActive },
        });
    }
    async toggleFeatured(id) {
        const business = await this.findById(id);
        return this.prisma.business.update({
            where: { id },
            data: { isFeatured: !business.isFeatured },
        });
    }
    async recalculateVisibility(businessId) {
        const [staffCount, serviceCount] = await Promise.all([
            this.prisma.staff.count({ where: { businessId, isActive: true } }),
            this.prisma.service.count({ where: { businessId, isActive: true } }),
        ]);
        const isVisible = staffCount > 0 && serviceCount > 0;
        await this.prisma.business.update({
            where: { id: businessId },
            data: { isVisible },
        });
        return isVisible;
    }
    async findAllAdmin(page = 1, limit = 20) {
        const skip = (page - 1) * limit;
        const [businesses, total] = await Promise.all([
            this.prisma.business.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' },
                include: { owner: { select: { name: true, email: true } } },
            }),
            this.prisma.business.count(),
        ]);
        return { data: businesses, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
    }
};
exports.BusinessesService = BusinessesService;
exports.BusinessesService = BusinessesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BusinessesService);
//# sourceMappingURL=businesses.service.js.map