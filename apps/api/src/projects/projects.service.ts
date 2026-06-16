import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TeamsService } from '../teams/teams.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
    private teamsService: TeamsService,
  ) {}

  async create(teamId: string, userId: string, dto: CreateProjectDto) {
    await this.teamsService.assertRole(teamId, userId, [Role.ADMIN, Role.MANAGER]);
    return this.prisma.project.create({
      data: { ...dto, teamId },
      include: { _count: { select: { tasks: true } } },
    });
  }

  async findByTeam(teamId: string, userId: string) {
    await this.teamsService.findOne(teamId, userId);
    return this.prisma.project.findMany({
      where: { teamId },
      include: {
        _count: { select: { tasks: true } },
        tasks: {
          where: { status: { not: 'DONE' } },
          select: { id: true, title: true, status: true, priority: true },
          take: 5,
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({
      where: { id: projectId },
      include: {
        team: {
          include: {
            members: {
              include: {
                user: { select: { id: true, name: true, email: true, avatar: true } },
              },
            },
          },
        },
        tasks: {
          include: {
            assignee: { select: { id: true, name: true, avatar: true } },
            creator: { select: { id: true, name: true } },
            _count: { select: { comments: true } },
          },
          orderBy: { position: 'asc' },
        },
        _count: { select: { tasks: true } },
      },
    });
    if (!project) throw new NotFoundException('Project not found');
    const isMember = project.team.members.some((m) => m.userId === userId);
    if (!isMember) throw new ForbiddenException('Access denied');
    return project;
  }

  async update(projectId: string, userId: string, dto: UpdateProjectDto) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    await this.teamsService.assertRole(project.teamId, userId, [Role.ADMIN, Role.MANAGER]);
    return this.prisma.project.update({ where: { id: projectId }, data: dto });
  }

  async remove(projectId: string, userId: string) {
    const project = await this.prisma.project.findUnique({ where: { id: projectId } });
    if (!project) throw new NotFoundException('Project not found');
    await this.teamsService.assertRole(project.teamId, userId, [Role.ADMIN]);
    await this.prisma.project.delete({ where: { id: projectId } });
    return { message: 'Project deleted successfully' };
  }
}
