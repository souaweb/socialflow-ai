import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { PlatformsService } from './platforms.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('platforms')
export class PlatformsController {
  constructor(private platformsService: PlatformsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getConnectedPlatforms(@Req() req) {
    return this.platformsService.getConnectedPlatforms(req.user.id);
  }

  @Post('disconnect/:accountId')
  @UseGuards(JwtAuthGuard)
  async disconnectPlatform(@Req() req, @Param('accountId') accountId: string) {
    return this.platformsService.disconnectPlatform(req.user.id, accountId);
  }
}
