import { Controller, Get, Post, Put, Delete, UseGuards, Req } from '@nestjs/common';
import { AutomationsService } from './automations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('automations')
export class AutomationsController {
  constructor(private automationsService: AutomationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getRules(@Req() req) {
    return this.automationsService.getRules(req.user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createRule(@Req() req, @Body() ruleData: any) {
    return this.automationsService.createRule(req.user.id, ruleData);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  async updateRule(@Param('id') ruleId: string, @Body() updates: any) {
    return this.automationsService.updateRule(ruleId, updates);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteRule(@Param('id') ruleId: string) {
    return this.automationsService.deleteRule(ruleId);
  }

  @Post(':id/trigger')
  @UseGuards(JwtAuthGuard)
  async triggerRule(@Param('id') ruleId: string, @Body() event: any) {
    return this.automationsService.triggerRule(ruleId, event);
  }
}
