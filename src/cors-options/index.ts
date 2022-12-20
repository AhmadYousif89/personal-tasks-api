import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const DEVELOPMENT_URL = process.env.DEV_URL;
const VERCEL_URL = process.env.PROD_URL_VERCEL;
const RENDER_URL = process.env.PROD_URL_RENDER;
const allowedOrigins = [DEVELOPMENT_URL, VERCEL_URL, RENDER_URL];

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
