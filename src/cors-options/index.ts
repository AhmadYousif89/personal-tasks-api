import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const RENDER = process.env.URL_RENDER;
const VERCEL = process.env.URL_VERCEL;
const DEVELOPMENT = process.env.URL_DEV;
const allowedOrigins = [DEVELOPMENT, VERCEL, RENDER];

export const corsOptions: CorsOptions = {
  origin: (origin: string, cb: any) => {
    if (allowedOrigins.includes(origin) || !origin) {
      cb(null, true);
    } else {
      return cb(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
