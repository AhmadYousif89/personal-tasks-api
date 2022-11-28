import {
  createParamDecorator,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

type KeyBody = 'name' | 'email' | 'password';
export const ValidateBody = createParamDecorator(
  (key: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const body = request.body;
    let newBody: Record<KeyBody, string>;
    for (const key of Object.keys(body)) {
      newBody[key] = body[key].trim();
    }

    if ('password' in newBody) {
      const isPassValid = /^((?!.*[\s])(?=.*\d).{3,})/.test(newBody.password);
      if (!isPassValid) {
        throw new HttpException(
          'required 3 characters at least with numbers and no spaces',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    if ('email' in newBody) {
      const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newBody.email);
      if (!isEmailValid) {
        throw new HttpException(
          'email is not a valid email',
          HttpStatus.BAD_REQUEST,
        );
      }
    }

    return newBody;
  },
);
