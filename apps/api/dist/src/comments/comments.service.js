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
exports.CommentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let CommentsService = class CommentsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async assertTaskAccess(taskId, userId) {
        const task = await this.prisma.task.findUnique({
            where: { id: taskId },
            include: { project: { include: { team: { include: { members: true } } } } },
        });
        if (!task)
            throw new common_1.NotFoundException('Task not found');
        const isMember = task.project.team.members.some((m) => m.userId === userId);
        if (!isMember)
            throw new common_1.ForbiddenException('Access denied');
        return task;
    }
    async create(taskId, userId, dto) {
        await this.assertTaskAccess(taskId, userId);
        const comment = await this.prisma.comment.create({
            data: { content: dto.content, taskId, authorId: userId },
            include: { author: { select: { id: true, name: true, avatar: true } } },
        });
        const task = await this.prisma.task.findUnique({ where: { id: taskId } });
        if (task?.assigneeId && task.assigneeId !== userId) {
            await this.prisma.notification.create({
                data: {
                    userId: task.assigneeId,
                    taskId,
                    type: 'COMMENT_ADDED',
                    title: 'New comment on your task',
                    message: `Someone commented on "${task.title}"`,
                },
            });
        }
        return comment;
    }
    async findByTask(taskId, userId) {
        await this.assertTaskAccess(taskId, userId);
        return this.prisma.comment.findMany({
            where: { taskId },
            include: { author: { select: { id: true, name: true, avatar: true } } },
            orderBy: { createdAt: 'asc' },
        });
    }
    async update(commentId, userId, dto) {
        const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (comment.authorId !== userId)
            throw new common_1.ForbiddenException('You can only edit your own comments');
        return this.prisma.comment.update({
            where: { id: commentId },
            data: { content: dto.content },
            include: { author: { select: { id: true, name: true, avatar: true } } },
        });
    }
    async remove(commentId, userId) {
        const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
        if (!comment)
            throw new common_1.NotFoundException('Comment not found');
        if (comment.authorId !== userId)
            throw new common_1.ForbiddenException('You can only delete your own comments');
        await this.prisma.comment.delete({ where: { id: commentId } });
        return { message: 'Comment deleted successfully' };
    }
};
exports.CommentsService = CommentsService;
exports.CommentsService = CommentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CommentsService);
//# sourceMappingURL=comments.service.js.map