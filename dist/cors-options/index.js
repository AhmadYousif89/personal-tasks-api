"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const DEVELOPMENT_URL = process.env.DEV_URL;
const VERCEL_URL = process.env.PROD_URL_VERCEL;
const RENDER_URL = process.env.PROD_URL_RENDER;
const allowedOrigins = [DEVELOPMENT_URL, VERCEL_URL, RENDER_URL];
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