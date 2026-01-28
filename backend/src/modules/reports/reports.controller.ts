import { Controller, Get, Post, Body, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReportsService } from './reports.service';

@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard/:businessId')
  async getDashboardReport(@Param('businessId') businessId: string) {
    return this.reportsService.getDashboardMetrics(businessId);
  }

  @Get('engagement/:businessId')
  async getEngagementReport(
    @Param('businessId') businessId: string,
    @Query('period') period: 'day' | 'week' | 'month' | 'year' = 'month',
  ) {
    return this.reportsService.getEngagementReport(businessId, period);
  }

  @Get('leads/:businessId')
  async getLeadsReport(
    @Param('businessId') businessId: string,
    @Query('status') status?: string,
  ) {
    return this.reportsService.getLeadsReport(businessId, status);
  }

  @Get('revenue/:businessId')
  async getRevenueReport(@Param('businessId') businessId: string) {
    return this.reportsService.getRevenueReport(businessId);
  }

  @Get('ai-interactions/:businessId')
  async getAiReport(
    @Param('businessId') businessId: string,
    @Query('period') period: 'day' | 'week' | 'month' = 'month',
  ) {
    return this.reportsService.getAiInteractionsReport(businessId, period);
  }

  @Get('platform-performance/:businessId')
  async getPlatformPerformance(@Param('businessId') businessId: string) {
    return this.reportsService.getPlatformPerformanceReport(businessId);
  }

  @Post('export/:businessId')
  async exportReport(
    @Param('businessId') businessId: string,
    @Body() body: { format: 'csv' | 'pdf' | 'json'; reportType: string },
  ) {
    return this.reportsService.exportReport(businessId, body.reportType, body.format);
  }
}
