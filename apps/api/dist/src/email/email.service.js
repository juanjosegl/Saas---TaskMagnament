"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EmailService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const resend_1 = require("resend");
let EmailService = EmailService_1 = class EmailService {
    constructor(config) {
        this.config = config;
        this.logger = new common_1.Logger(EmailService_1.name);
        this.from = 'ProjectFlow <onboarding@resend.dev>';
        this.resend = new resend_1.Resend(config.get('RESEND_API_KEY'));
        this.appUrl = config.get('APP_URL') ?? 'http://localhost:3000';
    }
    async sendTeamInvitation(params) {
        const acceptUrl = `${this.appUrl}/invitations/${params.token}`;
        try {
            await this.resend.emails.send({
                from: this.from,
                to: params.to,
                subject: `You have been invited to join ${params.teamName} on ProjectFlow`,
                html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:48px 32px;background:#ffffff;">
            <div style="margin-bottom:32px;">
              <span style="font-size:18px;font-weight:700;color:#0f172a;letter-spacing:-0.5px;">ProjectFlow</span>
            </div>
            <h1 style="font-size:22px;font-weight:600;color:#0f172a;margin:0 0 12px;">You have been invited</h1>
            <p style="color:#64748b;font-size:15px;line-height:1.7;margin:0 0 28px;">
              <strong style="color:#334155;">${params.inviterName}</strong> has invited you to join
              <strong style="color:#334155;">${params.teamName}</strong> as <strong style="color:#334155;">${params.role}</strong> on ProjectFlow.
            </p>
            <a href="${acceptUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.2px;">
              Accept Invitation
            </a>
            <p style="color:#94a3b8;font-size:13px;margin-top:36px;line-height:1.6;">
              This invitation expires in 7 days.<br/>
              If you did not expect this invitation, you can safely ignore this email.
            </p>
            <hr style="border:none;border-top:1px solid #f1f5f9;margin:36px 0 24px;" />
            <p style="color:#cbd5e1;font-size:12px;margin:0;">ProjectFlow &mdash; Team Project Management</p>
          </div>
        `,
            });
        }
        catch (error) {
            this.logger.error('Failed to send invitation email', error);
        }
    }
    async sendWelcomeEmail(params) {
        const loginUrl = `${this.appUrl}/login`;
        try {
            await this.resend.emails.send({
                from: this.from,
                to: params.to,
                subject: 'Welcome to ProjectFlow',
                html: `
          <div style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;max-width:520px;margin:0 auto;padding:48px 32px;background:#ffffff;">
            <div style="margin-bottom:32px;">
              <span style="font-size:18px;font-weight:700;color:#0f172a;letter-spacing:-0.5px;">ProjectFlow</span>
            </div>
            <h1 style="font-size:22px;font-weight:600;color:#0f172a;margin:0 0 12px;">Welcome, ${params.name}!</h1>
            <p style="color:#64748b;font-size:15px;line-height:1.7;margin:0 0 28px;">
              Your ProjectFlow account has been created successfully.<br/>
              Sign in to start managing your team projects, tasks, and workflows.
            </p>
            <a href="${loginUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;text-decoration:none;padding:13px 28px;border-radius:8px;font-size:14px;font-weight:600;letter-spacing:0.2px;">
              Sign in to ProjectFlow
            </a>
            <div style="margin-top:36px;padding:20px;background:#f8fafc;border-radius:8px;border:1px solid #f1f5f9;">
              <p style="color:#475569;font-size:13px;margin:0 0 8px;font-weight:600;">Get started quickly:</p>
              <ul style="color:#64748b;font-size:13px;margin:0;padding-left:20px;line-height:2;">
                <li>Create or join a team</li>
                <li>Set up your first project</li>
                <li>Invite your colleagues</li>
                <li>Start tracking tasks on the Kanban board</li>
              </ul>
            </div>
            <hr style="border:none;border-top:1px solid #f1f5f9;margin:36px 0 24px;" />
            <p style="color:#cbd5e1;font-size:12px;margin:0;">ProjectFlow &mdash; Team Project Management</p>
          </div>
        `,
            });
        }
        catch (error) {
            this.logger.error('Failed to send welcome email', error);
        }
    }
};
exports.EmailService = EmailService;
exports.EmailService = EmailService = EmailService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], EmailService);
//# sourceMappingURL=email.service.js.map