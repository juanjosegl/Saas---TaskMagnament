import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new team' })
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateTeamDto) {
    return this.teamsService.create(user.id, dto);
  }

  @Get()
  @ApiOperation({ summary: 'Get my teams' })
  findMyTeams(@CurrentUser() user: { id: string }) {
    return this.teamsService.findMyTeams(user.id);
  }

  @Get(':teamId')
  @ApiOperation({ summary: 'Get team details' })
  findOne(@Param('teamId') teamId: string, @CurrentUser() user: { id: string }) {
    return this.teamsService.findOne(teamId, user.id);
  }

  @Post(':teamId/invite')
  @ApiOperation({ summary: 'Invite a member to the team' })
  invite(@Param('teamId') teamId: string, @CurrentUser() user: { id: string }, @Body() dto: InviteMemberDto) {
    return this.teamsService.inviteMember(teamId, user.id, dto);
  }

  @Post('invitations/:token/accept')
  @ApiOperation({ summary: 'Accept a team invitation' })
  acceptInvitation(@Param('token') token: string, @CurrentUser() user: { id: string }) {
    return this.teamsService.acceptInvitation(token, user.id);
  }

  @Patch(':teamId/members/:memberId/role')
  @ApiOperation({ summary: 'Update member role' })
  updateRole(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.teamsService.updateMemberRole(teamId, user.id, memberId, dto);
  }

  @Delete(':teamId/members/:memberId')
  @ApiOperation({ summary: 'Remove a member from the team' })
  removeMember(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.teamsService.removeMember(teamId, user.id, memberId);
  }
}
