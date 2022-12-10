import { JwtPayload } from '../types';
import { ConfigService } from '@nestjs/config';
import { Strategy } from 'passport-jwt';
declare const RtStrategy_base: new (...args: any[]) => Strategy;
export declare class RtStrategy extends RtStrategy_base {
    constructor(config: ConfigService);
    private static getJwtFromCookie;
    validate(payload: JwtPayload): JwtPayload;
}
export {};
