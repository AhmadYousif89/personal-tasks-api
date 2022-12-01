"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const DEVELOPMENT_URL = process.env.DEVELOPMENT_URL;
const PRODUCTION_URL = process.env.PRODUCTION_URL;
const allowedOrigins = [DEVELOPMENT_URL, PRODUCTION_URL];
exports.corsOptions = {
    origin: (origin, cb) => {
        if (allowedOrigins.includes(origin) || !origin) {
            cb(null, true);
        }
        else {
            return cb(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    optionsSuccessStatus: 200,
};
//# sourceMappingURL=index.js.map