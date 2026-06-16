import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { Role } from '@prisma/client';
export declare class TeamsService {
    private prisma;
    private emailService;
    constructor(prisma: PrismaService, emailService: EmailService);
    private generateSlug;
    create(userId: string, dto: CreateTeamDto): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                name: string;
            };
        } & {
            id: string;
            role: import("@prisma/client").$Enums.Role;
            joinedAt: Date;
            userId: string;
            teamId: string;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
    }>;
    findMyTeams(userId: string): Promise<({
        members: ({
            user: {
                id: string;
                name: string;
                avatar: string;
            };
        } & {
            id: string;
            role: import("@prisma/client").$Enums.Role;
            joinedAt: Date;
            userId: string;
            teamId: string;
        })[];
        _count: {
            members: number;
            projects: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
    })[]>;
    findOne(teamId: string, userId: string): Promise<{
        members: ({
            user: {
                id: string;
                email: string;
                name: string;
                avatar: string;
            };
        } & {
            id: string;
            role: import("@prisma/client").$Enums.Role;
            joinedAt: Date;
            userId: string;
            teamId: string;
        })[];
        projects: {
            id: string;
            name: string;
            createdAt: Date;
            status: import("@prisma/client").$Enums.ProjectStatus;
        }[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        slug: string;
        description: string | null;
    }>;
    inviteMember(teamId: string, requesterId: string, dto: InviteMemberDto): Promise<{
        message: string;
        id: string;
        email: string;
        createdAt: Date;
        role: import("@prisma/client").$Enums.Role;
        teamId: string;
        status: import("@prisma/client").$Enums.InvitationStatus;
        token: string;
        expiresAt: Date;
        senderId: string;
    }>;
    acceptInvitation(token: string, userId: string): Promise<{
        message: string;
        teamId: string;
        teamName: string;
    }>;
    getMyInvitations(userId: string): Promise<({
        team: {
            id: string;
            name: string;
            description: string;
        };
        sender: {
            id: string;
            name: string;
            avatar: string;
        };
    } & {
        id: string;
        email: string;
        createdAt: Date;
        role: import("@prisma/client").$Enums.Role;
        teamId: string;
        status: import("@prisma/client").$Enums.InvitationStatus;
        token: string;
        expiresAt: Date;
        senderId: string;
    })[]>;
    updateMemberRole(teamId: string, requesterId: string, memberId: string, dto: UpdateMemberRoleDto): Promise<{
        id: string;
        role: import("@prisma/client").$Enums.Role;
        joinedAt: Date;
        userId: string;
        teamId: string;
    }>;
    removeMember(teamId: string, requesterId: string, memberId: string): Promise<{
        message: string;
    }>;
    assertRole(teamId: string, userId: string, roles: Role[]): Promise<{
        id: string;
        role: import("@prisma/client").$Enums.Role;
        joinedAt: Date;
        userId: string;
        teamId: string;
    }>;
    getInvitationByToken(token: string): Promise<{
        team: {
            name: string;
        };
        sender: {
            name: string;
        };
    } & {
        id: string;
        email: string;
        createdAt: Date;
        role: import("@prisma/client").$Enums.Role;
        teamId: string;
        status: import("@prisma/client").$Enums.InvitationStatus;
        token: string;
        expiresAt: Date;
        senderId: string;
    }>;
}
