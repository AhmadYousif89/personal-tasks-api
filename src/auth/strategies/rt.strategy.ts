import { Request } from 'express';
import { JwtPayload } from '../types';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, HttpException } from '@nestjs/common';

// Authorize refresh token strategy
@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([RtStrategy.getJwtFromCookie]),
      secretOrKey: config.get('REFRESH_SECRET_TOKEN'),
    });
  }

  private static getJwtFromCookie(req: Request): string {
    console.log(req.cookies);
    if (req.cookies && 'jwt' in req.cookies) return req.cookies.jwt;
    if (!('jwt' in req.cookies))
      throw new HttpException('Access Forbidden', 403);
  }

  validate(payload: JwtPayload) {
    return payload;
  }
}
