import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

// Access token AuthGuard - Globally available
@Injectable()
export class AtAuthGuard extends AuthGuard('jwt') implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }
  // Implementing protected routes
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isProtected = this.reflector.getAllAndOverride('isProtectedRoute', [
      context.getHandler(), // check for metadata 'isProtectedRoute' on the handlers
      context.getClass(), // check for metadata 'isProtectedRoute' on the main controller class
    ]);

    if (isProtected) return super.canActivate(context); // if metadata was found then activate AuthGuard protection over desired routes
    return true; // else don't activate AuthGuard so all routes are publiclly accessable by default
  }
}
