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
exports.RegisterBusinessDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
class RegisterBusinessDto {
    email;
    password;
    name;
    businessName;
    slug;
    category;
    country;
    city;
    description;
    address;
}
exports.RegisterBusinessDto = RegisterBusinessDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'owner@mybusiness.ru' }),
    (0, class_validator_1.IsEmail)(),
    __metadata("design:type", String)
], RegisterBusinessDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Secure123!' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(6),
    __metadata("design:type", String)
], RegisterBusinessDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Наталья Белова' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    __metadata("design:type", String)
], RegisterBusinessDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Belle Beauty Studio' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(2),
    (0, class_validator_1.MaxLength)(100),
    __metadata("design:type", String)
], RegisterBusinessDto.prototype, "businessName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        example: 'belle-beauty',
        description: 'Уникальный slug: liora.app/belle-beauty (только строчные буквы, цифры, дефис)',
    }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MinLength)(3),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], RegisterBusinessDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: client_1.BusinessCategory, example: 'BEAUTY_SALON' }),
    (0, class_validator_1.IsEnum)(client_1.BusinessCategory),
    __metadata("design:type", String)
], RegisterBusinessDto.prototype, "category", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'RU' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterBusinessDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Москва' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterBusinessDto.prototype, "city", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'Премиальный салон красоты' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterBusinessDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 'ул. Тверская, 15' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RegisterBusinessDto.prototype, "address", void 0);
//# sourceMappingURL=register-business.dto.js.map