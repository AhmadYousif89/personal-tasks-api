"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const RENDER = process.env.URL_RENDER;
const VERCEL = process.env.URL_VERCEL;
const DEVELOPMENT = process.env.URL_DEV;
const allowedOrigins = [DEVELOPMENT, VERCEL, RENDER];
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