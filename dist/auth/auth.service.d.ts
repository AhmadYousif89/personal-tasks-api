import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { PrismaService } from './../prisma/prisma.service';
import { AuthLoginDto, AuthRegisterDto } from './dto';
import { GoogleUser } from './types';
import { User } from '@prisma/client';
export declare class AuthServices {
    private prisma;
    private config;
    private jwt;
    constructor(prisma: PrismaService, config: ConfigService, jwt: JwtService);
    register(dto: AuthRegisterDto): Promise<{
        user: User;
        refreshToken: string;
    }>;
    login(dto: AuthLoginDto): Promise<{
        user: User;
        refreshToken: string;
    }>;
    googleRedirect(gUser: GoogleUser, res: Response): Promise<void>;
    loginWithGoogle(gUser: GoogleUser): Promise<{
        user: User;
        refreshToken: string;
    }>;
    refreshToken(id: string, jwt: string): Promise<{
        accessToken: string;
    }>;
    resetPassword(dto: AuthLoginDto): Promise<{
        message: string;
    }>;
    logout(id: string, jwt: string, res: Response): Promise<Response<any, Record<string, any>>>;
    private hashRefreshToken;
    private generateTokens;
    private deleteUserHash;
}
