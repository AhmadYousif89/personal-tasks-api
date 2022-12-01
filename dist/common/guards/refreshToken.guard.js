"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RtAuthGuard = void 0;
const passport_1 = require("@nestjs/passport");
class RtAuthGuard extends (0, passport_1.AuthGuard)('jwt-refresh') {
    constructor() {
        super();
    }
}
exports.RtAuthGuard = RtAuthGuard;
//# sourceMappingURL=refreshToken.guard.js.map