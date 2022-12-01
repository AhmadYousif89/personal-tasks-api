"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cookies = void 0;
const common_1 = require("@nestjs/common");
exports.Cookies = (0, common_1.createParamDecorator)((key, ctx) => {
    var _a;
    const request = ctx.switchToHttp().getRequest();
    return key ? (_a = request.cookies) === null || _a === void 0 ? void 0 : _a[key] : request.cookies;
});
//# sourceMappingURL=getCookies.decorator.js.map