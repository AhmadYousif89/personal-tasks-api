"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const class_validator_1 = require("class-validator");
const cookieParser = require("cookie-parser");
const express_1 = require("express");
const helmet_1 = require("helmet");
const app_module_1 = require("./app.module");
const cors_options_1 = require("./cors-options");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    app.use((0, helmet_1.default)());
    app.use(cookieParser());
    app.enableCors(cors_options_1.corsOptions);
    app.use((0, express_1.urlencoded)({ extended: true, limit: '50mb' }));
    (0, class_validator_1.useContainer)(app.select(app_module_1.AppModule), { fallbackOnErrors: true });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    await app.listen(process.env.PORT || 8520);
}
bootstrap();
//# sourceMappingURL=main.js.map