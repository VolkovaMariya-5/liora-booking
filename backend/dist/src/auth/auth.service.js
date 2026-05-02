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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
const bcrypt = __importStar(require("bcryptjs"));
let AuthService = class AuthService {
    usersService;
    jwtService;
    prisma;
    constructor(usersService, jwtService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.prisma = prisma;
    }
    async validateUser(email, password) {
        const user = await this.usersService.findByEmail(email);
        if (!user)
            return null;
        const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
        if (!isPasswordValid)
            return null;
        return this.usersService.sanitize(user);
    }
    login(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };
        return {
            user,
            accessToken: this.jwtService.sign(payload),
        };
    }
    async register(dto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new common_1.ConflictException('Пользователь с таким email уже существует');
        }
        const user = await this.usersService.create({
            email: dto.email,
            password: dto.password,
            name: dto.name,
            phone: dto.phone,
            country: dto.country,
            city: dto.city,
            role: client_1.Role.CLIENT,
        });
        return this.login(user);
    }
    async registerBusiness(dto) {
        const existing = await this.usersService.findByEmail(dto.email);
        if (existing) {
            throw new common_1.ConflictException('Пользователь с таким email уже существует');
        }
        const existingBusiness = await this.prisma.business.findUnique({
            where: { slug: dto.slug },
        });
        if (existingBusiness) {
            throw new common_1.ConflictException('Адрес (slug) уже занят другим бизнесом');
        }
        const result = await this.prisma.$transaction(async (tx) => {
            const passwordHash = await bcrypt.hash(dto.password, 10);
            const user = await tx.user.create({
                data: {
                    email: dto.email,
                    passwordHash,
                    name: dto.name,
                    country: dto.country,
                    city: dto.city,
                    role: client_1.Role.BUSINESS_ADMIN,
                },
            });
            const business = await tx.business.create({
                data: {
                    name: dto.businessName,
                    slug: dto.slug,
                    description: dto.description,
                    address: dto.address,
                    category: dto.category,
                    country: dto.country,
                    city: dto.city,
                    ownerId: user.id,
                },
            });
            return { user, business };
        });
        const { passwordHash: _, ...safeUser } = result.user;
        return this.login(safeUser);
    }
    async loginWithGoogle(data) {
        let user = await this.usersService.findByEmail(data.email);
        if (!user) {
            const randomPassword = Math.random().toString(36).slice(-12);
            user = await this.usersService.create({
                email: data.email,
                password: randomPassword,
                name: data.name,
                role: client_1.Role.CLIENT,
            });
        }
        const safeUser = this.usersService.sanitize(user);
        return this.login(safeUser);
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map