import { Controller, Post, Body } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private webhooksService: WebhooksService) {}

  @Post('meta')
  async handleMetaWebhook(@Body() payload: any) {
    return this.webhooksService.handleMetaWebhook(payload);
  }

  @Post('tiktok')
  async handleTikTokWebhook(@Body() payload: any) {
    return this.webhooksService.handleTikTokWebhook(payload);
  }

  @Post('youtube')
  async handleYoutubeWebhook(@Body() payload: any) {
    return this.webhooksService.handleYoutubeWebhook(payload);
  }
}
