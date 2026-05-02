"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const businesses_module_1 = require("./businesses/businesses.module");
const staff_module_1 = require("./staff/staff.module");
const services_module_1 = require("./services/services.module");
const bookings_module_1 = require("./bookings/bookings.module");
const reviews_module_1 = require("./reviews/reviews.module");
const favorites_module_1 = require("./favorites/favorites.module");
const profile_module_1 = require("./profile/profile.module");
const admin_module_1 = require("./admin/admin.module");
const manage_module_1 = require("./manage/manage.module");
const upload_module_1 = require("./upload/upload.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            prisma_module_1.PrismaModule,
            users_module_1.UsersModule,
            auth_module_1.AuthModule,
            businesses_module_1.BusinessesModule,
            staff_module_1.StaffModule,
            services_module_1.ServicesModule,
            bookings_module_1.BookingsModule,
            reviews_module_1.ReviewsModule,
            favorites_module_1.FavoritesModule,
            profile_module_1.ProfileModule,
            admin_module_1.AdminModule,
            manage_module_1.ManageModule,
            upload_module_1.UploadModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map