"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GetUserId = void 0;
const common_1 = require("@nestjs/common");
exports.GetUserId = (0, common_1.createParamDecorator)((key, ctx) => {
    var _a;
    const request = ctx.switchToHttp().getRequest();
    const userId = (_a = request === null || request === void 0 ? void 0 : request.user) === null || _a === void 0 ? void 0 : _a.id;
    return userId;
});
//# sourceMappingURL=getUserId.decorator.js.map