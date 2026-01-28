import { Controller, Get, Post, Put, UseGuards, Req } from '@nestjs/common';
import { CrmService } from './crm.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('crm/leads')
export class CrmController {
  constructor(private crmService: CrmService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getLeads(@Req() req, @Query('quality') quality?: string) {
    return this.crmService.getLeads(req.user.id, quality);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createLead(@Req() req, @Body() leadData: any) {
    return this.crmService.createLead(req.user.id, leadData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateLead(@Param('id') leadId: string, @Body() updates: any) {
    return this.crmService.updateLead(leadId, updates);
  }

  @Post(':id/tags')
  @UseGuards(JwtAuthGuard)
  async tagLead(@Param('id') leadId: string, @Body() body: { tags: string[] }) {
    return this.crmService.tagLead(leadId, body.tags);
  }

  @Post(':id/followup')
  @UseGuards(JwtAuthGuard)
  async scheduleFollowUp(
    @Param('id') leadId: string,
    @Body() body: { scheduledFor: Date; message: string },
  ) {
    return this.crmService.scheduleFollowUp(leadId, body.scheduledFor, body.message);
  }

  @Get(':id/score')
  @UseGuards(JwtAuthGuard)
  async getLeadScore(@Param('id') leadId: string) {
    return { score: await this.crmService.getLeadScore(leadId) };
  }
}
