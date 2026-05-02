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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const prisma_service_1 = require("../prisma/prisma.service");
const businesses_service_1 = require("../businesses/businesses.service");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
let AdminController = class AdminController {
    prisma;
    businessesService;
    constructor(prisma, businessesService) {
        this.prisma = prisma;
        this.businessesService = businessesService;
    }
    async getStats() {
        const [users, businesses, bookings, reviews] = await Promise.all([
            this.prisma.user.count({ where: { isDeleted: false } }),
            this.prisma.business.count(),
            this.prisma.booking.count(),
            this.prisma.review.count(),
        ]);
        const bookingsByStatus = await this.prisma.booking.groupBy({
            by: ['status'],
            _count: { status: true },
        });
        return {
            users,
            businesses,
            bookings,
            reviews,
            bookingsByStatus: Object.fromEntries(bookingsByStatus.map((b) => [b.status, b._count.status])),
        };
    }
    getBusinesses(page = '1', limit = '20') {
        return this.businessesService.findAllAdmin(Number(page), Number(limit));
    }
    toggleBusiness(id) {
        return this.businessesService.toggleActive(id);
    }
    toggleFeatured(id) {
        return this.businessesService.toggleFeatured(id);
    }
    async getUsers(page = '1', limit = '20', role) {
        const skip = (Number(page) - 1) * Number(limit);
        const where = { isDeleted: false, ...(role && { role }) };
        const [users, total] = await Promise.all([
            this.prisma.user.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true, email: true, name: true, role: true,
                    country: true, city: true, createdAt: true,
                },
            }),
            this.prisma.user.count({ where }),
        ]);
        return {
            data: users,
            meta: { total, page: Number(page), limit: Number(limit), totalPages: Math.ceil(total / Number(limit)) },
        };
    }
    async createUser(body) {
        const existing = await this.prisma.user.findUnique({ where: { email: body.email } });
        if (existing)
            throw new common_1.BadRequestException('Email уже занят');
        const passwordHash = await bcrypt.hash(body.password, 10);
        return this.prisma.user.create({
            data: {
                name: body.name,
                email: body.email,
                passwordHash,
                role: body.role,
                city: body.city,
                country: body.country,
            },
            select: { id: true, name: true, email: true, role: true, city: true, country: true, createdAt: true },
        });
    }
    async updateUser(id, body) {
        if (body.email) {
            const conflict = await this.prisma.user.findFirst({
                where: { email: body.email, id: { not: id } },
            });
            if (conflict)
                throw new common_1.BadRequestException('Email уже занят');
        }
        return this.prisma.user.update({
            where: { id },
            data: body,
            select: { id: true, name: true, email: true, role: true, city: true, country: true, createdAt: true },
        });
    }
    deleteUser(id) {
        return this.prisma.user.update({
            where: { id },
            data: { isDeleted: true, deletedAt: new Date() },
            select: { id: true, isDeleted: true },
        });
    }
};
exports.AdminController = AdminController;
__decorate([
    (0, common_1.Get)('stats'),
    (0, swagger_1.ApiOperation)({ summary: 'Статистика платформы (SUPER_ADMIN)' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)('businesses'),
    (0, swagger_1.ApiOperation)({ summary: 'Все бизнесы (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "getBusinesses", null);
__decorate([
    (0, common_1.Patch)('businesses/:id/toggle'),
    (0, swagger_1.ApiOperation)({ summary: 'Блокировать/разблокировать бизнес' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "toggleBusiness", null);
__decorate([
    (0, common_1.Patch)('businesses/:id/featured'),
    (0, swagger_1.ApiOperation)({ summary: 'Добавить/убрать бизнес из ТОП' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "toggleFeatured", null);
__decorate([
    (0, common_1.Get)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Все пользователи (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __param(2, (0, common_1.Query)('role')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, String]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "getUsers", null);
__decorate([
    (0, common_1.Post)('users'),
    (0, swagger_1.ApiOperation)({ summary: 'Создать пользователя (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "createUser", null);
__decorate([
    (0, common_1.Patch)('users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить пользователя (SUPER_ADMIN)' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AdminController.prototype, "updateUser", null);
__decorate([
    (0, common_1.Delete)('users/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Удалить пользователя (soft delete, SUPER_ADMIN)' }),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminController.prototype, "deleteUser", null);
exports.AdminController = AdminController = __decorate([
    (0, swagger_1.ApiTags)('Admin'),
    (0, common_1.Controller)('admin'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.SUPER_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        businesses_service_1.BusinessesService])
], AdminController);
//# sourceMappingURL=admin.controller.js.map