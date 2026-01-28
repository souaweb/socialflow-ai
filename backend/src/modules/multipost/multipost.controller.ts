import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MultiPostService } from './multipost.service';
import { CreateMultiPostDto, GenerateAIContentDto, AdaptContentDto } from './dtos/create-multipost.dto';

@Controller('multipost')
@UseGuards(JwtAuthGuard)
export class MultiPostController {
  constructor(private readonly multiPostService: MultiPostService) {}

  @Post(':businessId/create')
  async createMultiPost(
    @Param('businessId') businessId: string,
    @Body() dto: CreateMultiPostDto,
  ) {
    return this.multiPostService.createMultiPost(
      businessId,
      dto.content,
      dto.channels,
      dto.contentType,
      {
        aiGenerate: dto.aiGenerate,
        aiImagePrompt: dto.aiImagePrompt,
        aiVideoPrompt: dto.aiVideoPrompt,
        imageUrl: dto.imageUrl,
        videoUrl: dto.videoUrl,
        scheduledAt: dto.scheduledAt,
      },
    );
  }

  @Post(':businessId/preview')
  async previewPost(
    @Param('businessId') businessId: string,
    @Body() dto: {
      content: string;
      channels: string[];
      contentType: string;
    },
  ) {
    return this.multiPostService.previewPost(
      businessId,
      dto.content,
      dto.channels,
      dto.contentType,
    );
  }

  @Post(':businessId/publish/:postId')
  async publishPost(
    @Param('businessId') businessId: string,
    @Param('postId') postId: string,
  ) {
    return this.multiPostService.publishMultiPost(postId, businessId);
  }

  @Post(':businessId/schedule/:postId')
  async schedulePost(
    @Param('businessId') businessId: string,
    @Param('postId') postId: string,
    @Body() body: { scheduledAt: Date },
  ) {
    return this.multiPostService.scheduleMultiPost(postId, new Date(body.scheduledAt));
  }

  @Post(':businessId/adapt-content')
  async adaptContent(
    @Param('businessId') businessId: string,
    @Body() dto: AdaptContentDto,
  ) {
    // Retornar conteúdo adaptado para cada canal
    return {
      businessId,
      adaptations: {
        instagram: {
          text: 'Conteúdo adaptado para Instagram',
          hashtags: ['#instagram', '#viral'],
          format: 'reel',
        },
        tiktok: {
          text: 'Conteúdo adaptado para TikTok',
          hashtags: ['#tiktok', '#trending'],
          format: 'video',
        },
        facebook: {
          text: 'Conteúdo adaptado para Facebook',
          hashtags: ['#facebook'],
          format: 'post',
        },
      },
    };
  }

  @Post(':businessId/generate-ai-image')
  async generateAIImage(
    @Param('businessId') businessId: string,
    @Body() dto: GenerateAIContentDto,
  ) {
    return {
      businessId,
      imageUrl: `https://cdn.socialflow.ai/generated/img_${Date.now()}.jpg`,
      prompt: dto.prompt,
      style: dto.style,
      generatedAt: new Date(),
    };
  }

  @Post(':businessId/generate-ai-video')
  async generateAIVideo(
    @Param('businessId') businessId: string,
    @Body() dto: GenerateAIContentDto,
  ) {
    return {
      businessId,
      videoUrl: `https://cdn.socialflow.ai/generated/video_${Date.now()}.mp4`,
      prompt: dto.prompt,
      duration: 15,
      format: 'mp4',
      generatedAt: new Date(),
    };
  }

  @Get(':businessId/templates')
  async getTemplates(@Param('businessId') businessId: string) {
    return this.multiPostService.getTemplates(businessId);
  }

  @Get(':businessId/schedule-recommendations')
  async getSmartSchedule(
    @Param('businessId') businessId: string,
    @Query('channels') channels: string[],
  ) {
    return this.multiPostService.getSmartSchedule(businessId, channels);
  }

  @Get(':businessId/analytics')
  async getAnalytics(
    @Param('businessId') businessId: string,
    @Query('timeframe') timeframe: string = 'week',
  ) {
    return this.multiPostService.getAnalytics(businessId, timeframe);
  }

  @Get(':businessId/posts')
  async getUserPosts(
    @Param('businessId') businessId: string,
    @Query('status') status?: string,
    @Query('limit') limit: number = 20,
  ) {
    return {
      businessId,
      posts: [
        {
          id: 'mp_001',
          content: 'Conteúdo do post multi-canal',
          channels: ['instagram', 'facebook', 'tiktok'],
          status: 'published',
          createdAt: new Date(),
        },
      ],
      total: 1,
      limit,
    };
  }
}
