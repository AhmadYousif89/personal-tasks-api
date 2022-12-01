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
var RtStrategy_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.RtStrategy = void 0;
const config_1 = require("@nestjs/config");
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const common_1 = require("@nestjs/common");
let RtStrategy = RtStrategy_1 = class RtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-refresh') {
    constructor(config) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromExtractors([RtStrategy_1.getJwtFromCookie]),
            secretOrKey: config.get('REFRESH_SECRET_TOKEN'),
        });
    }
    static getJwtFromCookie(req) {
        if (req.cookies && 'jwt' in req.cookies)
            return req.cookies.jwt;
        else
            throw new common_1.HttpException('Access Forbidden', 403);
    }
    validate(payload) {
        return payload;
    }
};
RtStrategy = RtStrategy_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], RtStrategy);
exports.RtStrategy = RtStrategy;
//# sourceMappingURL=refreshToken.strategy.js.map