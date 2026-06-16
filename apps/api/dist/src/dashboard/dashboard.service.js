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
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let DashboardService = class DashboardService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getMyStats(userId) {
        const [assignedTasks, completedThisWeek, overdueTasksCount, myTeams, recentActivity,] = await Promise.all([
            this.prisma.task.groupBy({
                by: ['status'],
                where: { assigneeId: userId },
                _count: { status: true },
            }),
            this.prisma.task.count({
                where: {
                    assigneeId: userId,
                    status: client_1.TaskStatus.DONE,
                    updatedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
                },
            }),
            this.prisma.task.count({
                where: {
                    assigneeId: userId,
                    status: { not: client_1.TaskStatus.DONE },
                    dueDate: { lt: new Date() },
                },
            }),
            this.prisma.teamMember.count({ where: { userId } }),
            this.prisma.task.findMany({
                where: { assigneeId: userId },
                include: { project: { select: { id: true, name: true } } },
                orderBy: { updatedAt: 'desc' },
                take: 5,
            }),
        ]);
        const tasksByStatus = Object.values(client_1.TaskStatus).map((status) => ({
            status,
            count: assignedTasks.find((t) => t.status === status)?._count.status ?? 0,
        }));
        return {
            tasksByStatus,
            completedThisWeek,
            overdueTasksCount,
            teamsCount: myTeams,
            recentActivity,
        };
    }
    async getTeamStats(teamId) {
        const [totalTasks, tasksByStatus, tasksByPriority, membersCount, projectsCount, topContributors,] = await Promise.all([
            this.prisma.task.count({ where: { project: { teamId } } }),
            this.prisma.task.groupBy({
                by: ['status'],
                where: { project: { teamId } },
                _count: { status: true },
            }),
            this.prisma.task.groupBy({
                by: ['priority'],
                where: { project: { teamId } },
                _count: { priority: true },
            }),
            this.prisma.teamMember.count({ where: { teamId } }),
            this.prisma.project.count({ where: { teamId } }),
            this.prisma.task.groupBy({
                by: ['assigneeId'],
                where: { project: { teamId }, status: client_1.TaskStatus.DONE, assigneeId: { not: null } },
                _count: { assigneeId: true },
                orderBy: { _count: { assigneeId: 'desc' } },
                take: 5,
            }),
        ]);
        const statusStats = Object.values(client_1.TaskStatus).map((status) => ({
            status,
            count: tasksByStatus.find((t) => t.status === status)?._count.status ?? 0,
        }));
        const priorityStats = Object.values(client_1.TaskPriority).map((priority) => ({
            priority,
            count: tasksByPriority.find((t) => t.priority === priority)?._count.priority ?? 0,
        }));
        const enrichedContributors = await Promise.all(topContributors.map(async (c) => {
            const user = await this.prisma.user.findUnique({
                where: { id: c.assigneeId },
                select: { id: true, name: true, avatar: true },
            });
            return { user, tasksCompleted: c._count.assigneeId };
        }));
        return {
            totalTasks,
            tasksByStatus: statusStats,
            tasksByPriority: priorityStats,
            membersCount,
            projectsCount,
            topContributors: enrichedContributors,
        };
    }
};
exports.DashboardService = DashboardService;
exports.DashboardService = DashboardService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], DashboardService);
//# sourceMappingURL=dashboard.service.js.map