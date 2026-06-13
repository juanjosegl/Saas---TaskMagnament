import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

@Injectable()
export class TasksService {
  constructor(private prisma: PrismaService) {}

  private async assertProjectAccess(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: { team: { include: { members: true } } },
    });
    if (!project) throw new NotFoundException('Project not found');
    const isMember = project.team.members.some((m) => m.userId === userId);
    if (!isMember) throw new ForbiddenException('Access denied');
    return project;
  }

  async create(projectId: string, userId: string, dto: CreateTaskDto) {
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

  async findByProject(projectId: string, userId: string) {
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

  async findOne(taskId: string, userId: string) {
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
    if (!task) throw new NotFoundException('Task not found');
    const isMember = task.project.team.members.some((m) => m.userId === userId);
    if (!isMember) throw new ForbiddenException('Access denied');
    return task;
  }

  async update(taskId: string, userId: string, dto: UpdateTaskDto) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: { include: { team: { include: { members: true } } } } },
    });
    if (!task) throw new NotFoundException('Task not found');
    const isMember = task.project.team.members.some((m) => m.userId === userId);
    if (!isMember) throw new ForbiddenException('Access denied');
    return this.prisma.task.update({
      where: { id: taskId },
      data: dto,
      include: { assignee: { select: { id: true, name: true, avatar: true } } },
    });
  }

  async remove(taskId: string, userId: string) {
    const task = await this.prisma.task.findUnique({
      where: { id: taskId },
      include: { project: { include: { team: { include: { members: true } } } } },
    });
    if (!task) throw new NotFoundException('Task not found');
    const member = task.project.team.members.find((m) => m.userId === userId);
    if (!member) throw new ForbiddenException('Access denied');
    if (task.creatorId !== userId && member.role === 'DEVELOPER') {
      throw new ForbiddenException('Only the creator, managers or admins can delete tasks');
    }
    await this.prisma.task.delete({ where: { id: taskId } });
    return { message: 'Task deleted successfully' };
  }

  async getMyTasks(userId: string) {
    return this.prisma.task.findMany({
      where: { assigneeId: userId, status: { not: 'DONE' } },
      include: {
        project: { select: { id: true, name: true } },
        _count: { select: { comments: true } },
      },
      orderBy: [{ priority: 'desc' }, { dueDate: 'asc' }],
    });
  }
}
