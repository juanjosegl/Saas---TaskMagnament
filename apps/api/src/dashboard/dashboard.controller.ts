import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('dashboard')
export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get my personal dashboard stats' })
  getMyStats(@CurrentUser() user: { id: string }) {
    return this.dashboardService.getMyStats(user.id);
  }

  @Get('teams/:teamId')
  @ApiOperation({ summary: 'Get team dashboard stats' })
  getTeamStats(@Param('teamId') teamId: string) {
    return this.dashboardService.getTeamStats(teamId);
  }
}
