import { Controller, Get, Post, Put, Body, Param, UseGuards, Query } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AffiliateService } from './affiliate.service';
import { CreateAffiliateDto } from './dtos/create-affiliate.dto';

@Controller('affiliate')
@UseGuards(JwtAuthGuard)
export class AffiliateController {
  constructor(private readonly affiliateService: AffiliateService) {}

  @Get('dashboard')
  async getAffiliateDashboard() {
    return this.affiliateService.getAffiliateDashboard();
  }

  @Get('stats/:affiliateCode')
  async getAffiliateStats(@Param('affiliateCode') affiliateCode: string) {
    return this.affiliateService.getAffiliateStats(affiliateCode);
  }

  @Post('register')
  async registerAffiliate(@Body() dto: CreateAffiliateDto) {
    return this.affiliateService.registerAffiliate(dto);
  }

  @Get('referrals/:affiliateCode')
  async getReferrals(
    @Param('affiliateCode') affiliateCode: string,
    @Query('page') page: number = 1,
  ) {
    return this.affiliateService.getReferrals(affiliateCode, page);
  }

  @Get('payouts/:affiliateCode')
  async getPayouts(@Param('affiliateCode') affiliateCode: string) {
    return this.affiliateService.getPayouts(affiliateCode);
  }

  @Post('request-payout')
  async requestPayout(@Body() body: { amount: number }) {
    return this.affiliateService.requestPayout(body.amount);
  }

  @Get('top-affiliates')
  async getTopAffiliates(@Query('limit') limit: number = 10) {
    return this.affiliateService.getTopAffiliates(limit);
  }

  @Put('profile/:affiliateCode')
  async updateAffiliateProfile(
    @Param('affiliateCode') affiliateCode: string,
    @Body() body: { bankAccount?: string; bankCode?: string },
  ) {
    return this.affiliateService.updateAffiliateProfile(affiliateCode, body);
  }
}
