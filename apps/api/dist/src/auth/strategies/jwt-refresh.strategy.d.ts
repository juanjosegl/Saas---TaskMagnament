import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import type { Request } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
declare const JwtRefreshStrategy_base: new (...args: [opt: import("passport-jwt").StrategyOptionsWithRequest] | [opt: import("passport-jwt").StrategyOptionsWithoutRequest]) => Strategy & {
    validate(...args: any[]): unknown;
};
export declare class JwtRefreshStrategy extends JwtRefreshStrategy_base {
    private configService;
    private prisma;
    constructor(configService: ConfigService, prisma: PrismaService);
    validate(req: Request, payload: {
        sub: string;
    }): Promise<{
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
    }>;
}
export {};
