import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  private async assertTaskAccess(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: { include: { team: { include: { members: true } } } } },
    });
    if (!task) throw new NotFoundException('Task not found');
    const isMember = task.project.team.members.some((m) => m.userId === userId);
    if (!isMember) throw new ForbiddenException('Access denied');
    return task;
  }

  async create(taskId: string, userId: string, dto: CreateCommentDto) {
    await this.assertTaskAccess(taskId, userId);
    const comment = await this.prisma.comment.create({
      data: { content: dto.content, taskId, authorId: userId },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });

    // Create notification for task assignee
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

  async findByTask(taskId: string, userId: string) {
    await this.assertTaskAccess(taskId, userId);
    return this.prisma.comment.findMany({
      where: { taskId },
      include: { author: { select: { id: true, name: true, avatar: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async update(commentId: string, userId: string, dto: CreateCommentDto) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== userId) throw new ForbiddenException('You can only edit your own comments');
    return this.prisma.comment.update({
      where: { id: commentId },
      data: { content: dto.content },
      include: { author: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async remove(commentId: string, userId: string) {
    const comment = await this.prisma.comment.findUnique({ where: { id: commentId } });
    if (!comment) throw new NotFoundException('Comment not found');
    if (comment.authorId !== userId) throw new ForbiddenException('You can only delete your own comments');
    await this.prisma.comment.delete({ where: { id: commentId } });
    return { message: 'Comment deleted successfully' };
  }
}
