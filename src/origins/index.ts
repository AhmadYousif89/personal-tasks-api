import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

const allowedOrigins = [
  'http://localhost:5173',
  'https://personal-tasks.vercel.app',
];

export const corsOptions: CorsOptions = {
  origin: (origin: string, cb: any) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      cb(null, true);
    } else {
      return cb(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};
