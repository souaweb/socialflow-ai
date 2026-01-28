import { Controller, Get, Post, UseGuards, Req } from '@nestjs/common';
import { PostsService } from './posts.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('posts')
export class PostsController {
  constructor(private postsService: PostsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createPost(@Req() req, @Body() postData: any) {
    return this.postsService.createPost(req.user.id, postData);
  }

  @Post(':id/schedule')
  @UseGuards(JwtAuthGuard)
  async schedulePost(
    @Param('id') postId: string,
    @Body() body: { scheduledFor: Date; accounts: string[] },
  ) {
    return this.postsService.schedulePost(postId, body.scheduledFor, body.accounts);
  }

  @Post(':id/publish')
  @UseGuards(JwtAuthGuard)
  async publishPost(
    @Param('id') postId: string,
    @Body() body: { accounts: string[] },
  ) {
    return this.postsService.publishPost(postId, body.accounts);
  }

  @Post(':id/replicate')
  @UseGuards(JwtAuthGuard)
  async replicatePost(
    @Param('id') postId: string,
    @Body() body: { accounts: string[] },
  ) {
    return this.postsService.replicatePostToAccounts(postId, body.accounts);
  }

  @Get(':id/stats')
  @UseGuards(JwtAuthGuard)
  async getStats(
    @Param('id') postId: string,
    @Query('accountId') accountId: string,
  ) {
    return this.postsService.getPostStats(postId, accountId);
  }
}
