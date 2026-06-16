import { PrismaService } from '../prisma/prisma.service';
export declare class DashboardService {
    private prisma;
    constructor(prisma: PrismaService);
    getMyStats(userId: string): Promise<{
        tasksByStatus: {
            status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
            count: number;
        }[];
        completedThisWeek: number;
        overdueTasksCount: number;
        teamsCount: number;
        recentActivity: ({
            project: {
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
        })[];
    }>;
    getTeamStats(teamId: string): Promise<{
        totalTasks: number;
        tasksByStatus: {
            status: "BACKLOG" | "TODO" | "IN_PROGRESS" | "IN_REVIEW" | "DONE";
            count: number;
        }[];
        tasksByPriority: {
            priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
            count: number;
        }[];
        membersCount: number;
        projectsCount: number;
        topContributors: {
            user: {
                id: string;
                name: string;
                avatar: string;
            };
            tasksCompleted: number;
        }[];
    }>;
}
