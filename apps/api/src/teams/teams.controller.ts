import { Controller, Get, Post, Patch, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { TeamsService } from './teams.service';
import { CreateTeamDto } from './dto/create-team.dto';
import { InviteMemberDto } from './dto/invite-member.dto';
import { UpdateMemberRoleDto } from './dto/update-member-role.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('Teams')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('teams')
export class TeamsController {
  constructor(private teamsService: TeamsService) {}

  @Post()
  create(@CurrentUser() user: { id: string }, @Body() dto: CreateTeamDto) {
    return this.teamsService.create(user.id, dto);
  }

  @Get()
  findMyTeams(@CurrentUser() user: { id: string }) {
    return this.teamsService.findMyTeams(user.id);
  }

  @Get('my-invitations')
  getMyInvitations(@CurrentUser() user: { id: string }) {
    return this.teamsService.getMyInvitations(user.id);
  }

  @Get(':teamId')
  findOne(@Param('teamId') teamId: string, @CurrentUser() user: { id: string }) {
    return this.teamsService.findOne(teamId, user.id);
  }

  @Post(':teamId/invite')
  invite(@Param('teamId') teamId: string, @CurrentUser() user: { id: string }, @Body() dto: InviteMemberDto) {
    return this.teamsService.inviteMember(teamId, user.id, dto);
  }

  @Public()
  @Get('invitations/:token')
  getInvitation(@Param('token') token: string) {
    return this.teamsService.getInvitationByToken(token);
  }

  @Post('invitations/:token/accept')
  acceptInvitation(@Param('token') token: string, @CurrentUser() user: { id: string }) {
    return this.teamsService.acceptInvitation(token, user.id);
  }

  @Patch(':teamId/members/:memberId/role')
  updateRole(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: UpdateMemberRoleDto,
  ) {
    return this.teamsService.updateMemberRole(teamId, user.id, memberId, dto);
  }

  @Delete(':teamId/members/:memberId')
  removeMember(
    @Param('teamId') teamId: string,
    @Param('memberId') memberId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.teamsService.removeMember(teamId, user.id, memberId);
  }
}
