import { Response } from 'express';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import { AuthServices } from './auth.service';
export declare class AuthController {
    private readonly authServices;
    private timeToExpire;
    constructor(authServices: AuthServices);
    register(dto: AuthRegisterDto, res: Response): Promise<Response<any, Record<string, any>>>;
    login(dto: AuthLoginDto, res: Response): Promise<Response<any, Record<string, any>>>;
    refreshToken(id: string, jwt: string): Promise<{
        accessToken: string;
    }>;
    resetPassword(dto: AuthLoginDto): Promise<{
        message: string;
    }>;
    logout(res: Response, id: string, jwt: string): Promise<void>;
    private attachCookie;
}
