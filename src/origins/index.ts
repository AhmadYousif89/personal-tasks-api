import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const DEVELOPMENT_URL = process.env.DEVELOPMENT_URL;
const PRODUCTION_URL = process.env.PRODUCTION_URL;
const allowedOrigins = [DEVELOPMENT_URL, PRODUCTION_URL];

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
