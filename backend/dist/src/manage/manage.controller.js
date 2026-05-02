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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ManageController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../auth/guards/roles.guard");
const roles_decorator_1 = require("../auth/decorators/roles.decorator");
const current_user_decorator_1 = require("../auth/decorators/current-user.decorator");
const client_1 = require("@prisma/client");
const businesses_service_1 = require("../businesses/businesses.service");
const staff_service_1 = require("../staff/staff.service");
const services_service_1 = require("../services/services.service");
const create_staff_dto_1 = require("../staff/dto/create-staff.dto");
const create_service_dto_1 = require("../services/dto/create-service.dto");
let ManageController = class ManageController {
    businessesService;
    staffService;
    servicesService;
    constructor(businessesService, staffService, servicesService) {
        this.businessesService = businessesService;
        this.staffService = staffService;
        this.servicesService = servicesService;
    }
    async getStaff(userId) {
        const business = await this.businessesService.findMyBusiness(userId);
        return this.staffService.findByBusinessForAdmin(business.id);
    }
    async createStaff(userId, dto) {
        const business = await this.businessesService.findMyBusiness(userId);
        return this.staffService.create(business.id, dto, userId);
    }
    updateStaff(id, userId, data) {
        if (data.isActive === false) {
            return this.staffService.deactivate(id, userId);
        }
        if (data.isActive === true) {
            return this.staffService.activate(id, userId);
        }
        return this.staffService.update(id, data, userId);
    }
    getStaffSchedule(staffId, userId) {
        return this.staffService.getScheduleByStaffId(staffId, userId);
    }
    updateStaffSchedule(staffId, userId, schedule) {
        return this.staffService.updateSchedule(staffId, schedule, userId, client_1.Role.BUSINESS_ADMIN);
    }
    async getServices(userId) {
        const business = await this.businessesService.findMyBusiness(userId);
        return this.servicesService.findByBusinessForAdmin(business.id);
    }
    async createService(userId, dto) {
        const business = await this.businessesService.findMyBusiness(userId);
        return this.servicesService.create(business.id, dto, userId);
    }
    updateService(id, userId, dto) {
        return this.servicesService.update(id, dto, userId);
    }
    removeService(id, userId) {
        return this.servicesService.remove(id, userId);
    }
    getSettings(userId) {
        return this.businessesService.findMyBusiness(userId);
    }
    async updateSettings(userId, dto) {
        const business = await this.businessesService.findMyBusiness(userId);
        return this.businessesService.update(business.id, dto, userId, client_1.Role.BUSINESS_ADMIN);
    }
};
exports.ManageController = ManageController;
__decorate([
    (0, common_1.Get)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Список мастеров своего бизнеса' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManageController.prototype, "getStaff", null);
__decorate([
    (0, common_1.Post)('staff'),
    (0, swagger_1.ApiOperation)({ summary: 'Добавить мастера в свой бизнес' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_staff_dto_1.CreateStaffDto]),
    __metadata("design:returntype", Promise)
], ManageController.prototype, "createStaff", null);
__decorate([
    (0, common_1.Patch)('staff/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить данные или статус мастера' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "updateStaff", null);
__decorate([
    (0, common_1.Get)('staff/:id/schedule'),
    (0, swagger_1.ApiOperation)({ summary: 'Получить расписание мастера' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "getStaffSchedule", null);
__decorate([
    (0, common_1.Put)('staff/:id/schedule'),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить расписание мастера' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)('schedule')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Array]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "updateStaffSchedule", null);
__decorate([
    (0, common_1.Get)('services'),
    (0, swagger_1.ApiOperation)({ summary: 'Список услуг своего бизнеса' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ManageController.prototype, "getServices", null);
__decorate([
    (0, common_1.Post)('services'),
    (0, swagger_1.ApiOperation)({ summary: 'Создать услугу' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_service_dto_1.CreateServiceDto]),
    __metadata("design:returntype", Promise)
], ManageController.prototype, "createService", null);
__decorate([
    (0, common_1.Patch)('services/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить услугу' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "updateService", null);
__decorate([
    (0, common_1.Delete)('services/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Деактивировать услугу' }),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "removeService", null);
__decorate([
    (0, common_1.Get)('settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Настройки своего бизнеса' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ManageController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Patch)('settings'),
    (0, swagger_1.ApiOperation)({ summary: 'Обновить настройки бизнеса' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ManageController.prototype, "updateSettings", null);
exports.ManageController = ManageController = __decorate([
    (0, swagger_1.ApiTags)('Manage (BUSINESS_ADMIN)'),
    (0, common_1.Controller)('manage'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(client_1.Role.BUSINESS_ADMIN),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [businesses_service_1.BusinessesService,
        staff_service_1.StaffService,
        services_service_1.ServicesService])
], ManageController);
//# sourceMappingURL=manage.controller.js.map