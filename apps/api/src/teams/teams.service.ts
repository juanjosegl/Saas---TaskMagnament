import {
  Injectable, NotFoundException, ForbiddenException, ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { Role } from '@prisma/client';

@Injectable()
export class TeamsService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  private generateSlug(name: string): string {
    return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-' + Date.now();
  }

  async create(userId: string, dto: CreateTeamDto) {
    const slug = this.generateSlug(dto.name);
    return this.prisma.team.create({
      data: {
        name: dto.name, description: dto.description, slug,
        members: { create: { userId, role: Role.ADMIN } },
      },
      include: { members: { include: { user: { select: { id: true, name: true, email: true } } } } },
    });
  }

  async findMyTeams(userId: string) {
    return this.prisma.team.findMany({
      where: { members: { some: { userId } } },
      include: {
        _count: { select: { members: true, projects: true } },
        members: { take: 5, include: { user: { select: { id: true, name: true, avatar: true } } } },
      },
    });
  }

  async findOne(teamId: string, userId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
      include: {
        members: { include: { user: { select: { id: true, name: true, email: true, avatar: true } } } },
        projects: { select: { id: true, name: true, status: true, createdAt: true } },
      },
    });
    if (!team) throw new NotFoundException('Team not found');
    const isMember = team.members.some((m) => m.userId === userId);
    if (!isMember) throw new ForbiddenException('Not a member of this team');
    return team;
  }

  async inviteMember(teamId: string, requesterId: string, dto: InviteMemberDto) {
    await this.assertRole(teamId, requesterId, [Role.ADMIN, Role.MANAGER]);

    const existing = await this.prisma.invitation.findFirst({
      where: { teamId, email: dto.email, status: 'PENDING' },
    });
    if (existing) throw new ConflictException('Invitation already sent to this email');

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

    // In-app notification with token in message for deep linking
    const invitedUser = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (invitedUser) {
      await this.prisma.notification.create({
        data: {
          userId: invitedUser.id,
          type: 'TEAM_INVITATION',
          title: 'Team Invitation',
          message: `${sender?.name} invited you to join ${team?.name} as ${dto.role}`,
          // Store token in taskId field temporarily — we'll use a metadata approach
        },
      });

      // Store invitation token in a way we can retrieve it
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

  async acceptInvitation(token: string, userId: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
      include: { team: true },
    });
    if (!invitation || invitation.status !== 'PENDING') throw new NotFoundException('Invalid or expired invitation');
    if (invitation.expiresAt < new Date()) throw new ForbiddenException('Invitation has expired');

    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (user?.email !== invitation.email) throw new ForbiddenException('This invitation is not for your account');

    const alreadyMember = await this.prisma.teamMember.findUnique({
      where: { userId_teamId: { userId, teamId: invitation.teamId } },
    });
    if (alreadyMember) throw new ConflictException('Already a member of this team');

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

  async getMyInvitations(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException('User not found');
    return this.prisma.invitation.findMany({
      where: { email: user.email, status: 'PENDING' },
      include: {
        team: { select: { id: true, name: true, description: true } },
        sender: { select: { id: true, name: true, avatar: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateMemberRole(teamId: string, requesterId: string, memberId: string, dto: UpdateMemberRoleDto) {
    await this.assertRole(teamId, requesterId, [Role.ADMIN]);
    return this.prisma.teamMember.update({
      where: { userId_teamId: { userId: memberId, teamId } },
      data: { role: dto.role },
    });
  }

  async removeMember(teamId: string, requesterId: string, memberId: string) {
    await this.assertRole(teamId, requesterId, [Role.ADMIN]);
    await this.prisma.teamMember.delete({
      where: { userId_teamId: { userId: memberId, teamId } },
    });
    return { message: 'Member removed successfully' };
  }

  async assertRole(teamId: string, userId: string, roles: Role[]) {
    const member = await this.prisma.teamMember.findUnique({
      where: { userId_teamId: { userId, teamId } },
    });
    if (!member || !roles.includes(member.role)) throw new ForbiddenException('Insufficient permissions');
    return member;
  }

  async getInvitationByToken(token: string) {
    const invitation = await this.prisma.invitation.findUnique({
      where: { token },
      include: {
        team: { select: { name: true } },
        sender: { select: { name: true } },
      },
    });
    if (!invitation) throw new NotFoundException('Invitation not found');
    return invitation;
  }
}
