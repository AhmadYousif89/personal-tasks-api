import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { jwtDecode } from 'jwt-js-decode';

export const GetGoogleUser = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const result = jwtDecode(request.body.credential).payload;
    const user = {
      name: result.name,
      email: result.email,
      image: result.picture,
      provider: 'google',
    };
    return user;
  },
);
