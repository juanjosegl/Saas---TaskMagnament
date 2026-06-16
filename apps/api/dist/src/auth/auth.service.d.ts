import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthService {
    private prisma;
    private jwtService;
    private configService;
    private emailService;
    constructor(prisma: PrismaService, jwtService: JwtService, configService: ConfigService, emailService: EmailService);
    register(dto: RegisterDto): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            name: string;
            avatar: string;
            jobTitle: string;
            location: string;
            createdAt: Date;
        };
    }>;
    login(dto: LoginDto): Promise<{
        accessToken: string;
        refreshToken: string;
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
    }>;
    googleLogin(googleUser: {
        googleId: string;
        email: string;
        name: string;
        avatar?: string;
    }): Promise<{
        isNew: boolean;
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string;
            googleId: string | null;
            name: string;
            password: string | null;
            avatar: string | null;
            phone: string | null;
            birthDate: Date | null;
            bio: string | null;
            jobTitle: string | null;
            location: string | null;
            provider: import("@prisma/client").$Enums.AuthProvider;
            isActive: boolean;
            refreshToken: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    }>;
    logout(userId: string): Promise<{
        message: string;
    }>;
    refresh(userId: string): Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
    private generateTokens;
    private saveRefreshToken;
}
