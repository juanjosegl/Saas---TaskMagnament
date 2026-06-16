import { ConfigService } from '@nestjs/config';
export declare class EmailService {
    private config;
    private resend;
    private readonly logger;
    private readonly appUrl;
    private readonly from;
    constructor(config: ConfigService);
    sendTeamInvitation(params: {
        to: string;
        inviterName: string;
        teamName: string;
        role: string;
        token: string;
    }): Promise<void>;
    sendWelcomeEmail(params: {
        to: string;
        name: string;
    }): Promise<void>;
}
