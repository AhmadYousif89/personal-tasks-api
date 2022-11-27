import { AuthGuard } from '@nestjs/passport';

// Refresh token AuthGuard
export class RtAuthGuard extends AuthGuard('jwt-refresh') {
  constructor() {
    super();
  }
}
