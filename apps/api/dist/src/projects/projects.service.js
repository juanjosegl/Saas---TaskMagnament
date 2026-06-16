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
exports.ProjectsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const teams_service_1 = require("../teams/teams.service");
const client_1 = require("@prisma/client");
let ProjectsService = class ProjectsService {
    constructor(prisma, teamsService) {
        this.prisma = prisma;
        this.teamsService = teamsService;
    }
    async create(teamId, userId, dto) {
        await this.teamsService.assertRole(teamId, userId, [client_1.Role.ADMIN, client_1.Role.MANAGER]);
        return this.prisma.project.create({
            data: { ...dto, teamId },
            include: { _count: { select: { tasks: true } } },
        });
    }
    async findByTeam(teamId, userId) {
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
    async findOne(projectId, userId) {
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
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        const isMember = project.team.members.some((m) => m.userId === userId);
        if (!isMember)
            throw new common_1.ForbiddenException('Access denied');
        return project;
    }
    async update(projectId, userId, dto) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        await this.teamsService.assertRole(project.teamId, userId, [client_1.Role.ADMIN, client_1.Role.MANAGER]);
        return this.prisma.project.update({ where: { id: projectId }, data: dto });
    }
    async remove(projectId, userId) {
        const project = await this.prisma.project.findUnique({ where: { id: projectId } });
        if (!project)
            throw new common_1.NotFoundException('Project not found');
        await this.teamsService.assertRole(project.teamId, userId, [client_1.Role.ADMIN]);
        await this.prisma.project.delete({ where: { id: projectId } });
        return { message: 'Project deleted successfully' };
    }
};
exports.ProjectsService = ProjectsService;
exports.ProjectsService = ProjectsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        teams_service_1.TeamsService])
], ProjectsService);
//# sourceMappingURL=projects.service.js.map