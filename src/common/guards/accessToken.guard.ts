import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

// Access token AuthGuard - Globally available
@Injectable()
export class AtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }
  // Implementing protected routes
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isProtected = this.reflector.getAllAndOverride('isProtectedRoute', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isProtected) return super.canActivate(context);
    return true;
  }
}
