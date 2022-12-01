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
exports.ValidateEmailOnSignUp = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const prisma_service_1 = require("../../prisma/prisma.service");
let ValidateEmailOnSignUp = class ValidateEmailOnSignUp {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async validate(value) {
        const user = await this.prisma.user.findUnique({ where: { email: value } });
        return user ? false : true;
    }
    defaultMessage() {
        throw new common_1.HttpException('Email already exist', common_1.HttpStatus.CONFLICT);
    }
};
ValidateEmailOnSignUp = __decorate([
    (0, common_1.Injectable)(),
    (0, class_validator_1.ValidatorConstraint)({ name: 'validateEmail', async: true }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ValidateEmailOnSignUp);
exports.ValidateEmailOnSignUp = ValidateEmailOnSignUp;
//# sourceMappingURL=email.register.validator.js.map