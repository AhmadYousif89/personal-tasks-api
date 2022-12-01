"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Protected = void 0;
const common_1 = require("@nestjs/common");
const Protected = () => (0, common_1.SetMetadata)('isProtectedRoute', true);
exports.Protected = Protected;
//# sourceMappingURL=protect.decorator.js.map