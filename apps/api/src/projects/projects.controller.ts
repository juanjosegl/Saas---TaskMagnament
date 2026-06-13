import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Projects')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post('teams/:teamId/projects')
  @ApiOperation({ summary: 'Create a project in a team' })
  create(@Param('teamId') teamId: string, @CurrentUser() user: { id: string }, @Body() dto: CreateProjectDto) {
    return this.projectsService.create(teamId, user.id, dto);
  }

  @Get('teams/:teamId/projects')
  @ApiOperation({ summary: 'Get all projects in a team' })
  findByTeam(@Param('teamId') teamId: string, @CurrentUser() user: { id: string }) {
    return this.projectsService.findByTeam(teamId, user.id);
  }

  @Get('projects/:projectId')
  @ApiOperation({ summary: 'Get project details' })
  findOne(@Param('projectId') projectId: string, @CurrentUser() user: { id: string }) {
    return this.projectsService.findOne(projectId, user.id);
  }

  @Patch('projects/:projectId')
  @ApiOperation({ summary: 'Update a project' })
  update(@Param('projectId') projectId: string, @CurrentUser() user: { id: string }, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(projectId, user.id, dto);
  }

  @Delete('projects/:projectId')
  @ApiOperation({ summary: 'Delete a project' })
  remove(@Param('projectId') projectId: string, @CurrentUser() user: { id: string }) {
    return this.projectsService.remove(projectId, user.id);
  }
}
