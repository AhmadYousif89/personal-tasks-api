"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetGoogleUser = void 0;
const common_1 = require("@nestjs/common");
const jwt_js_decode_1 = require("jwt-js-decode");
exports.GetGoogleUser = (0, common_1.createParamDecorator)((key, ctx) => {
    const request = ctx.switchToHttp().getRequest();
    const result = (0, jwt_js_decode_1.jwtDecode)(request.body.credential).payload;
    const user = {
        name: result.name,
        email: result.email,
        image: result.picture,
        provider: 'google',
    };
    return user;
});
//# sourceMappingURL=getGoogleUser.decorator.js.map