import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const VERCEL = process.env.VERCEL_URL;
const RENDER = process.env.RENDER_URL;
const DEVELOPMENT = process.env.DEV_URL;
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
