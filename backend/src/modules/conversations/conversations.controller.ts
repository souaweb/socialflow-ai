import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { ConversationsService } from './conversations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('conversations')
export class ConversationsController {
  constructor(private conversationsService: ConversationsService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getConversations(@Req() req, @Query('platform') platform?: string) {
    return this.conversationsService.getConversations(req.user.id, platform);
  }

  @Get(':id/messages')
  @UseGuards(JwtAuthGuard)
  async getMessages(@Param('id') conversationId: string) {
    return this.conversationsService.getMessages(conversationId);
  }

  @Post(':id/messages')
  @UseGuards(JwtAuthGuard)
  async sendMessage(
    @Param('id') conversationId: string,
    @Body() body: { message: string; platform: string },
  ) {
    return this.conversationsService.sendMessage(
      conversationId,
      body.message,
      body.platform,
    );
  }

  @Post('sync')
  @UseGuards(JwtAuthGuard)
  async syncConversations(@Req() req) {
    return this.conversationsService.syncConversations(req.user.id);
  }
}
