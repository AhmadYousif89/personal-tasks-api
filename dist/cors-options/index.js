"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsOptions = void 0;
const VERCEL = process.env.VERCEL_URL;
console.log(VERCEL);
const RENDER = process.env.RENDER_URL;
const DEVELOPMENT = process.env.DEV_URL;
const allowedOrigins = [DEVELOPMENT, 'https://taski5y.vercel.app', RENDER];
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