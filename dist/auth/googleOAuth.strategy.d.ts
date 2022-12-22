import { ConfigService } from '@nestjs/config';
import { Strategy, Profile } from 'passport-google-oauth20';
declare const GoogleStrategy_base: new (...args: any[]) => Strategy;
export declare class GoogleStrategy extends GoogleStrategy_base {
    private config;
    constructor(config: ConfigService);
    validate(accessToken: string, refreshToken: string, profile: Profile): Promise<{
        name: string;
        image: string;
        email: string;
        provider: string;
    }>;
}
export {};
