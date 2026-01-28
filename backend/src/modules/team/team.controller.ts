import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { TeamService } from './team.service';
import { InviteTeamDto } from './dtos/invite-team.dto';

@Controller('team')
@UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get(':businessId')
  async getTeamMembers(@Param('businessId') businessId: string) {
    return this.teamService.getTeamMembers(businessId);
  }

  @Post(':businessId/invite')
  async inviteTeamMember(
    @Param('businessId') businessId: string,
    @Body() dto: InviteTeamDto,
  ) {
    return this.teamService.inviteTeamMember(businessId, dto);
  }

  @Put(':businessId/members/:memberId')
  async updateTeamMember(
    @Param('businessId') businessId: string,
    @Param('memberId') memberId: string,
    @Body() body: { role: string; permissions?: string[] },
  ) {
    return this.teamService.updateTeamMember(businessId, memberId, body.role, body.permissions);
  }

  @Delete(':businessId/members/:memberId')
  async removeTeamMember(
    @Param('businessId') businessId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.teamService.removeTeamMember(businessId, memberId);
  }

  @Get(':businessId/roles')
  async getAvailableRoles() {
    return this.teamService.getAvailableRoles();
  }

  @Post(':businessId/members/:memberId/resend-invite')
  async resendInvite(
    @Param('businessId') businessId: string,
    @Param('memberId') memberId: string,
  ) {
    return this.teamService.resendInvite(businessId, memberId);
  }
}
