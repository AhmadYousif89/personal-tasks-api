import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { AuthServices } from './auth.service';
import { AuthLoginDto, AuthRegisterDto } from './dto';
export declare class AuthController {
    private config;
    private readonly authServices;
    private timeToExpire;
    private gUser;
    constructor(config: ConfigService, authServices: AuthServices);
    register(dto: AuthRegisterDto, res: Response): Promise<Response<any, Record<string, any>>>;
    login(dto: AuthLoginDto, res: Response): Promise<Response<any, Record<string, any>>>;
    googleAuth(): Promise<string>;
    GoogleRedirect(req: Request, res: Response): Promise<void>;
    validateGoogleUser(res: Response): Promise<Response<any, Record<string, any>>>;
    refreshToken(id: string, jwt: string): Promise<{
        accessToken: string;
    }>;
    resetPassword(dto: AuthLoginDto): Promise<{
        message: string;
    }>;
    logout(res: Response, id: string, jwt: string): Promise<void>;
    private attachCookie;
}
