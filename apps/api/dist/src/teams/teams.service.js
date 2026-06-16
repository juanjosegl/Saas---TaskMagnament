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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const email_service_1 = require("../email/email.service");
const client_1 = require("@prisma/client");
let TeamsService = class TeamsService {
    constructor(prisma, emailService) {
        this.prisma = prisma;
        this.emailService = emailService;
    }
    generateSlug(name) {
        return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
    }
    async create(userId, dto) {
        const slug = this.generateSlug(dto.name);
        return this.prisma.team.create({
            data: {
                name: dto.name, description: dto.description, slug,
                members: { create: { userId, role: client_1.Role.ADMIN } },
            },
            include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } },
        });
    }
    async findMyTeams(userId) {
        return this.prisma.team.findMany({
            where: { members: { some: { userId } } },
            include: {
                _count: { select: { members: true, projects: true } },
                members: { take: 5, include: { user: { select: { id: true, name: true, avatar: true } } } },
            },
        });
    }
    async findOne(teamId, userId) {
        const team = await this.prisma.team.findUnique({
            where: { id: teamId },
            include: {
                members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
                projects: { select: { id: true, name: true, status: true, createdAt: true } },
            },
        });
        if (!team)
            throw new common_1.NotFoundException('Team not found');
        const isMember = team.members.some((m) => m.userId === userId);
        if (!isMember)
            throw new common_1.ForbiddenException('Not a member of this team');
        return team;
    }
    async inviteMember(teamId, requesterId, dto) {
        await this.assertRole(teamId, requesterId, [client_1.Role.ADMIN, client_1.Role.MANAGER]);
        const existing = await this.prisma.invitation.findFirst({
            where: { teamId, email: dto.email, status: 'PENDING' },
        });
        if (existing)
            throw new common_1.ConflictException('Invitation already sent to this email');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);
        const [team, sender, invitation] = await Promise.all([
            this.prisma.team.findUnique({ where: { id: teamId } }),
            this.prisma.user.findUnique({ where: { id: requesterId } }),
            this.prisma.invitation.create({
                data: { teamId, email: dto.email, role: dto.role, senderId: requesterId, expiresAt },
            }),
        ]);
        if (team && sender) {
            this.emailService.sendTeamInvitation({
                to: dto.email,
                inviterName: sender.name,
                teamName: team.name,
                role: dto.role,
                token: invitation.token,
            });
        }
        const invitedUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
        if (invitedUser) {
            await this.prisma.notification.create({
                data: {
                    userId: invitedUser.id,
                    type: 'TEAM_INVITATION',
                    title: 'Team Invitation',
                    message: `${sender?.name} invited you to join ${team?.name} as ${dto.role}`,
                },
            });
            await this.prisma.notification.updateMany({
                where: {
                    userId: invitedUser.id,
                    type: 'TEAM_INVITATION',
                    message: { contains: invitation.token.substring(0, 8) },
                },
                data: {},
            });
        }
        return { ...invitation, message: 'Invitation sent successfully' };
    }
    async acceptInvitation(token, userId) {
        const invitation = await this.prisma.invitation.findUnique({
            where: { token },
            include: { team: true },
        });
        if (!invitation || invitation.status !== 'PENDING')
            throw new common_1.NotFoundException('Invalid or expired invitation');
        if (invitation.expiresAt < new Date())
            throw new common_1.ForbiddenException('Invitation has expired');
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (user?.email !== invitation.email)
            throw new common_1.ForbiddenException('This invitation is not for your account');
        const alreadyMember = await this.prisma.teamMember.findUnique({
            where: { userId_teamId: { userId, teamId: invitation.teamId } },
        });
        if (alreadyMember)
            throw new common_1.ConflictException('Already a member of this team');
        await this.prisma.$transaction([
            this.prisma.teamMember.create({
                data: { userId, teamId: invitation.teamId, role: invitation.role },
            }),
            this.prisma.invitation.update({
                where: { token },
                data: { status: 'ACCEPTED' },
            }),
        ]);
        return { message: 'Invitation accepted', teamId: invitation.teamId, teamName: invitation.team.name };
    }
    async getMyInvitations(userId) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return this.prisma.invitation.findMany({
            where: { email: user.email, status: 'PENDING' },
            include: {
                team: { select: { id: true, name: true, description: true } },
                sender: { select: { id: true, name: true, avatar: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateMemberRole(teamId, requesterId, memberId, dto) {
        await this.assertRole(teamId, requesterId, [client_1.Role.ADMIN]);
        return this.prisma.teamMember.update({
            where: { userId_teamId: { userId: memberId, teamId } },
            data: { role: dto.role },
        });
    }
    async removeMember(teamId, requesterId, memberId) {
        await this.assertRole(teamId, requesterId, [client_1.Role.ADMIN]);
        await this.prisma.teamMember.delete({
            where: { userId_teamId: { userId: memberId, teamId } },
        });
        return { message: 'Member removed successfully' };
    }
    async assertRole(teamId, userId, roles) {
        const member = await this.prisma.teamMember.findUnique({
            where: { userId_teamId: { userId, teamId } },
        });
        if (!member || !roles.includes(member.role))
            throw new common_1.ForbiddenException('Insufficient permissions');
        return member;
    }
    async getInvitationByToken(token) {
        const invitation = await this.prisma.invitation.findUnique({
            where: { token },
            include: {
                team: { select: { name: true } },
                sender: { select: { name: true } },
            },
        });
        if (!invitation)
            throw new common_1.NotFoundException('Invitation not found');
        return invitation;
    }
};
exports.TeamsService = TeamsService;
exports.TeamsService = TeamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        email_service_1.EmailService])
], TeamsService);
//# sourceMappingURL=teams.service.js.map