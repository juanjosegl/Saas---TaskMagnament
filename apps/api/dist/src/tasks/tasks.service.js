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
exports.TasksService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let TasksService = class TasksService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertProjectAccess(projectId, userId) {
        const project = await this.prisma.project.findUnique({
            where: { id: projectId },
            include: { team: { include: { members: true } } },
        });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        const isMember = project.team.members.some((m) => m.userId === userId);
        if (!isMember)
            throw new common_1.ForbiddenException('Access denied');
        return project;
    }
    async create(projectId, userId, dto) {
        await this.assertProjectAccess(projectId, userId);
        const lastTask = await this.prisma.task.findFirst({
            where: { projectId },
            orderBy: { position: 'desc' },
            select: { position: true },
        });
        const position = (lastTask?.position ?? -1) + 1;
        return this.prisma.task.create({
            data: { ...dto, projectId, creatorId: userId, position },
            include: {
                assignee: { select: { id: true, name: true, avatar: true } },
                creator: { select: { id: true, name: true } },
            },
        });
    }
    async findByProject(projectId, userId) {
        await this.assertProjectAccess(projectId, userId);
        return this.prisma.task.findMany({
            where: { projectId },
            include: {
                assignee: { select: { id: true, name: true, avatar: true } },
                creator: { select: { id: true, name: true } },
                _count: { select: { comments: true } },
            },
            orderBy: { position: 'asc' },
        });
    }
    async findOne(taskId, userId) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: {
                assignee: { select: { id: true, name: true, avatar: true } },
                creator: { select: { id: true, name: true } },
                comments: {
                    include: { author: { select: { id: true, name: true, avatar: true } } },
                    orderBy: { createdAt: 'asc' },
                },
                project: { include: { team: { include: { members: true } } } },
            },
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        const isMember = task.project.team.members.some((m) => m.userId === userId);
        if (!isMember)
            throw new common_1.ForbiddenException('Access denied');
        return task;
    }
    async update(taskId, userId, dto) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: { project: { include: { team: { include: { members: true } } } } },
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        const isMember = task.project.team.members.some((m) => m.userId === userId);
        if (!isMember)
            throw new common_1.ForbiddenException('Access denied');
        return this.prisma.task.update({
            where: { id: taskId },
            data: dto,
            include: { assignee: { select: { id: true, name: true, avatar: true } } },
        });
    }
    async remove(taskId, userId) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: { project: { include: { team: { include: { members: true } } } } },
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        const member = task.project.team.members.find((m) => m.userId === userId);
        if (!member)
            throw new common_1.ForbiddenException('Access denied');
        if (task.creatorId !== userId && member.role === 'DEVELOPER') {
            throw new common_1.ForbiddenException('Only the creator, managers or admins can delete tasks');
        }
        await this.prisma.task.delete({ where: { id: taskId } });
        return { message: 'Task deleted successfully' };
    }
    async getMyTasks(userId) {
        return this.prisma.task.findMany({
            where: { assigneeId: userId, status: { not: 'DONE' } },
            include: {
                project: { select: { id: true, name: true } },
                _count: { select: { comments: true } },
            },
            orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
        });
    }
};
exports.TasksService = TasksService;
exports.TasksService = TasksService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], TasksService);
//# sourceMappingURL=tasks.service.js.map