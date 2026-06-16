import { PrismaService } from '../prisma/prisma.service';
import { TeamsService } from '../teams/teams.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
export declare class ProjectsService {
    private prisma;
    private teamsService;
    constructor(prisma: PrismaService, teamsService: TeamsService);
    create(teamId: string, userId: string, dto: CreateProjectDto): Promise<{
        _count: {
            tasks: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        teamId: string;
        status: import("@prisma/client").$Enums.ProjectStatus;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    findByTeam(teamId: string, userId: string): Promise<({
        tasks: {
            id: string;
            status: import("@prisma/client").$Enums.TaskStatus;
            title: string;
            priority: import("@prisma/client").$Enums.TaskPriority;
        }[];
        _count: {
            tasks: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        teamId: string;
        status: import("@prisma/client").$Enums.ProjectStatus;
        startDate: Date | null;
        endDate: Date | null;
    })[]>;
    findOne(projectId: string, userId: string): Promise<{
        team: {
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
        } & {
            id: string;
            name: string;
            createdAt: Date;
            updatedAt: Date;
            slug: string;
            description: string | null;
        };
        tasks: ({
            assignee: {
                id: string;
                name: string;
                avatar: string;
            };
            creator: {
                id: string;
                name: string;
            };
            _count: {
                comments: number;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            status: import("@prisma/client").$Enums.TaskStatus;
            title: string;
            priority: import("@prisma/client").$Enums.TaskPriority;
            dueDate: Date | null;
            position: number;
            projectId: string;
            assigneeId: string | null;
            creatorId: string;
        })[];
        _count: {
            tasks: number;
        };
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        teamId: string;
        status: import("@prisma/client").$Enums.ProjectStatus;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    update(projectId: string, userId: string, dto: UpdateProjectDto): Promise<{
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        teamId: string;
        status: import("@prisma/client").$Enums.ProjectStatus;
        startDate: Date | null;
        endDate: Date | null;
    }>;
    remove(projectId: string, userId: string): Promise<{
        message: string;
    }>;
}
