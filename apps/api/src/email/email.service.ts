import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Resend } from 'resend';

@Injectable()
export class EmailService {
  private resend: Resend;
  private readonly logger = new Logger(EmailService.name);
  private readonly appUrl: string;
  private readonly from = 'ProjectFlow <onboarding@resend.dev>';

  constructor(private config: ConfigService) {
    this.resend = new Resend(config.get('RESEND_API_KEY'));
    this.appUrl = config.get('APP_URL') ?? 'http://localhost:3000'\;
  }

  async sendTeamInvitation(params: {
    to: string;
    inviterName: string;
    teamName: string;
    role: string;
    token: string;
  }) {
    const acceptUrl = `${this.appUrl}/invitations/${params.token}`;
    try {
      await this.resend.emails.send({
        from: this.from,
        to: params.to,
        subject: `You have been invited to join ${params.teamName} on ProjectFlow`,
        html: `
          <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;">
            <h1 style="font-size:20px;font-weight:600;color:#0f172a;margin-bottom:8px;">Team Invitation</h1>
            <p style="color:#475569;font-size:15px;line-height:1.6;margin-bottom:24px;">
              <strong>${params.inviterName}</strong> invited you to join
              <strong>${params.teamName}</strong> as <strong>${params.role}</strong>.
            </p>
            <a href="${acceptUrl}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:500;">
              Accept Invitation
            </a>
            <p style="color:#94a3b8;font-size:13px;margin-top:32px;">
              This invitation expires in 7 days. If you did not expect this, ignore this email.
            </p>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;" />
            <p style="color:#cbd5e1;font-size:12px;">ProjectFlow — Team Project Management</p>
          </div>
        `,
      });
    } catch (error) {
      this.logger.error('Failed to send invitation email', error);
    }
  }

  async sendWelcomeEmail(params: { to: string; name: string }) {
    try {
      await this.resend.emails.send({
        from: this.from,
        to: params.to,
        subject: 'Welcome to ProjectFlow',
        html: `
          <div style="font-family:-apple-system,sans-serif;max-width:480px;margin:0 auto;padding:40px 24px;">
            <h1 style="font-size:20px;font-weight:600;color:#0f172a;">Welcome, ${params.name}!</h1>
            <p style="color:#475569;font-size:15px;line-height:1.6;">
              Your ProjectFlow account is ready. Start by creating a team and inviting your colleagues.
            </p>
            <a href="${this.appUrl}/dashboard" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 24px;border-radius:8px;font-size:14px;font-weight:500;">
              Go to Dashboard
            </a>
            <hr style="border:none;border-top:1px solid #e2e8f0;margin:32px 0;" />
            <p style="color:#cbd5e1;font-size:12px;">ProjectFlow — Team Project Management</p>
          </div>
        `,
      });
    } catch (error) {
      this.logger.error('Failed to send welcome email', error);
    }
  }
}
