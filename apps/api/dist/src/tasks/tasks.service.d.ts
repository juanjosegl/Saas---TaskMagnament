import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
export declare class TasksService {
    private prisma;
    constructor(prisma: PrismaService);
    private assertProjectAccess;
    create(projectId: string, userId: string, dto: CreateTaskDto): Promise<{
        assignee: {
            id: string;
            name: string;
            avatar: string;
        };
        creator: {
            id: string;
            name: string;
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
    }>;
    findByProject(projectId: string, userId: string): Promise<({
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
    })[]>;
    findOne(taskId: string, userId: string): Promise<{
        comments: ({
            author: {
                id: string;
                name: string;
                avatar: string;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            taskId: string;
            content: string;
            authorId: string;
        })[];
        project: {
            team: {
                members: {
                    id: string;
                    role: import("@prisma/client").$Enums.Role;
                    joinedAt: Date;
                    userId: string;
                    teamId: string;
                }[];
            } & {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                slug: string;
                description: string | null;
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
        };
        assignee: {
            id: string;
            name: string;
            avatar: string;
        };
        creator: {
            id: string;
            name: string;
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
    }>;
    update(taskId: string, userId: string, dto: UpdateTaskDto): Promise<{
        assignee: {
            id: string;
            name: string;
            avatar: string;
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
    }>;
    remove(taskId: string, userId: string): Promise<{
        message: string;
    }>;
    getMyTasks(userId: string): Promise<({
        project: {
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
    })[]>;
}
