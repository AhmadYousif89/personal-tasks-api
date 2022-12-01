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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const decorators_1 = require("./../common/decorators");
const decorators_2 = require("./../common/decorators");
const dto_1 = require("./dto");
const guards_1 = require("./../common/guards");
const auth_service_1 = require("./auth.service");
let AuthController = class AuthController {
    constructor(authServices) {
        this.authServices = authServices;
        this.timeToExpire = 24 * 60 * 60 * 1000;
    }
    async register(dto, res) {
        const { user, refreshToken } = await this.authServices.register(dto);
        this.attachCookie(res, refreshToken);
        return res.json(user);
    }
    async login(dto, res) {
        const { user, refreshToken } = await this.authServices.login(dto);
        this.attachCookie(res, refreshToken);
        return res.json(user);
    }
    async refreshToken(id, jwt) {
        return this.authServices.refreshToken(id, jwt);
    }
    async resetPassword(dto) {
        return this.authServices.resetPassword(dto);
    }
    async logout(res, id, jwt) {
        await this.authServices.logout(id, jwt, res);
    }
    attachCookie(res, token) {
        res.cookie('jwt', token, {
            secure: process.env.NODE_ENV === 'production',
            httpOnly: true,
            sameSite: 'none',
            maxAge: this.timeToExpire,
        });
    }
};
__decorate([
    (0, common_1.Post)('register'),
    (0, common_1.HttpCode)(common_1.HttpStatus.CREATED),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AuthRegisterDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AuthLoginDto, Object]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, common_1.Get)('refresh'),
    (0, common_1.UseGuards)(guards_1.RtAuthGuard),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, decorators_2.GetUserId)()),
    __param(1, (0, decorators_1.Cookies)('jwt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refreshToken", null);
__decorate([
    (0, common_1.Post)('reset'),
    (0, common_1.HttpCode)(common_1.HttpStatus.OK),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.AuthLoginDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "resetPassword", null);
__decorate([
    (0, decorators_2.Protected)(),
    (0, common_1.Post)('logout'),
    __param(0, (0, common_1.Res)()),
    __param(1, (0, decorators_2.GetUserId)()),
    __param(2, (0, decorators_1.Cookies)('jwt')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthServices])
], AuthController);
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map