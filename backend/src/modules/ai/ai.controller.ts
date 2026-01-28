import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('ai')
export class AiController {
  constructor(private aiService: AiService) {}

  @Post('analyze')
  @UseGuards(JwtAuthGuard)
  async analyzeMessage(@Body() body: { message: string; context?: any }) {
    return this.aiService.analyzeMessage(body.message, body.context);
  }

  @Post('generate-response')
  @UseGuards(JwtAuthGuard)
  async generateResponse(
    @Body()
    body: {
      message: string;
      businessContext: any;
      conversationHistory?: any[];
    },
  ) {
    return this.aiService.generateSalesResponse(
      body.message,
      body.businessContext,
      body.conversationHistory,
    );
  }

  @Post('purchase-intent')
  @UseGuards(JwtAuthGuard)
  async detectIntent(@Body() body: { message: string }) {
    return this.aiService.detectPurchaseIntent(body.message);
  }

  @Post('extract-facts')
  @UseGuards(JwtAuthGuard)
  async extractFacts(@Body() body: { text: string }) {
    return this.aiService.extractFacts(body.text);
  }

  @Post('generate-hashtags')
  @UseGuards(JwtAuthGuard)
  async generateHashtags(
    @Body() body: { content: string; platform: string },
  ) {
    return this.aiService.generateHashtags(body.content, body.platform);
  }
}
