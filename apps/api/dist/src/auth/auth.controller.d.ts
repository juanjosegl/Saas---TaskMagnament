import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ConfigService } from '@nestjs/config';
export declare class AuthController {
    private authService;
    private configService;
    constructor(authService: AuthService, configService: ConfigService);
    register(dto: RegisterDto, res: Response): Promise<{
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            jobTitle: string;
            location: string;
            createdAt: Date;
        };
        accessToken: string;
    }>;
    login(dto: LoginDto, res: Response): Promise<{
        user: {
            id: string;
            email: string;
            googleId: string | null;
            name: string;
            avatar: string | null;
            phone: string | null;
            birthDate: Date | null;
            bio: string | null;
            jobTitle: string | null;
            location: string | null;
            provider: import("@prisma/client").$Enums.AuthProvider;
            isActive: boolean;
            createdAt: Date;
            updatedAt: Date;
        };
        accessToken: string;
    }>;
    googleAuth(): void;
    googleCallback(req: Request, res: Response): Promise<void>;
    logout(user: {
        id: string;
    }, res: Response): Promise<{
        message: string;
    }>;
    refresh(req: Request, res: Response): Promise<{
        accessToken: string;
    }>;
    me(user: unknown): unknown;
    private setRefreshCookie;
}
