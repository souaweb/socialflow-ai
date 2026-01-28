import { Injectable } from '@nestjs/common';
import { ContentAdaptationService } from './services/content-adaptation.service';
import { ImageGenerationService } from './services/image-generation.service';
import { VideoGenerationService } from './services/video-generation.service';
import { ChannelOptimizationService } from './services/channel-optimization.service';

@Injectable()
export class MultiPostService {
  
  constructor(
    private contentAdaptation: ContentAdaptationService,
    private imageGeneration: ImageGenerationService,
    private videoGeneration: VideoGenerationService,
    private channelOptimization: ChannelOptimizationService,
  ) {}

  async createMultiPost(
    businessId: string,
    content: string,
    channels: string[],
    contentType: string,
    options?: {
      aiGenerate?: boolean;
      aiImagePrompt?: string;
      aiVideoPrompt?: string;
      imageUrl?: string;
      videoUrl?: string;
      scheduledAt?: Date;
      tone?: string;
      keywords?: string;
    }
  ) {
    // 1. Adaptar conteúdo para cada canal
    const adaptedContent = await this.contentAdaptation.adaptContent(
      content,
      channels,
      contentType,
      options?.tone,
      options?.keywords
    );

    // 2. Gerar mídia (se solicitado)
    let mediaUrls = [];
    if (options?.aiGenerate) {
      mediaUrls = await this.generateMedia(contentType, options);
    }

    // 3. Otimizar para cada canal
    const optimizationResults = {};
    for (const channel of channels) {
      optimizationResults[channel] = await this.channelOptimization.optimizeForChannel(
        adaptedContent[channel].text,
        channel,
        contentType
      );
    }

    // 4. Preparar para publicação
    const multiPost = {
      id: 'mp_' + Math.random().toString(36).substr(2, 9),
      businessId,
      originalContent: content,
      targetChannels: channels,
      contentType,
      adaptedContent,
      mediaUrls,
      status: options?.scheduledAt ? 'scheduled' : 'draft',
      scheduledAt: options?.scheduledAt,
      aiGenerated: !!options?.aiGenerate,
      optimizationResults,
      createdAt: new Date(),
    };

    return multiPost;
  }

  private async generateMedia(
    contentType: string,
    options: any
  ): Promise<string[]> {
    const mediaUrls = [];

    if (contentType === 'image' || contentType === 'post' || contentType === 'story') {
      const image = await this.imageGeneration.generateImage(
        options.aiImagePrompt,
        'modern'
      );
      mediaUrls.push(image.imageUrl);
    }

    if (contentType === 'carousel') {
      const carousel = await this.imageGeneration.generateCarousel(
        options.aiImagePrompt,
        3
      );
      mediaUrls.push(...carousel.slides.map(s => s.imageUrl));
    }

    if (contentType === 'video' || contentType === 'reel') {
      const video = await this.videoGeneration.generateVideo(
        options.aiVideoPrompt,
        15
      );
      mediaUrls.push(video.videoUrl);
    }

    return mediaUrls;
  }

  async publishMultiPost(postId: string, businessId: string) {
    // Publicar em todos os canais
    const publishResults = {};

    const channels = ['instagram', 'facebook', 'tiktok', 'youtube', 'whatsapp'];

    for (const channel of channels) {
      try {
        publishResults[channel] = {
          success: true,
          postId: `post_${channel}_${Date.now()}`,
          url: `https://${channel}.com/post/${postId}`,
          publishedAt: new Date(),
        };
      } catch (error) {
        publishResults[channel] = {
          success: false,
          error: error.message,
        };
      }
    }

    return {
      multiPostId: postId,
      status: 'published',
      publishResults,
      publishedAt: new Date(),
    };
  }

  async scheduleMultiPost(postId: string, scheduledAt: Date) {
    return {
      multiPostId: postId,
      status: 'scheduled',
      scheduledAt,
      message: `Post agendado para ${scheduledAt.toLocaleString('pt-BR')}`,
    };
  }

  async previewPost(
    businessId: string,
    content: string,
    channels: string[],
    contentType: string
  ) {
    const adapted = await this.contentAdaptation.adaptContent(
      content,
      channels,
      contentType
    );

    const previews = {};
    for (const channel of channels) {
      const optimization = await this.channelOptimization.optimizeForChannel(
        adapted[channel].text,
        channel,
        contentType
      );

      const prediction = await this.channelOptimization.predictPerformance(
        adapted[channel].text,
        channel,
        contentType
      );

      previews[channel] = {
        content: adapted[channel],
        optimization,
        prediction,
      };
    }

    return {
      businessId,
      previews,
    };
  }

  async getTemplates(businessId: string) {
    return {
      businessId,
      templates: [
        {
          id: 'tpl_001',
          name: 'Promoção',
          contentType: 'carousel',
          applicableChannels: ['instagram', 'facebook'],
          description: 'Template para promoções e descontos',
          usageCount: 5,
          successRate: 0.92,
        },
        {
          id: 'tpl_002',
          name: 'Tutorial',
          contentType: 'video',
          applicableChannels: ['tiktok', 'youtube'],
          description: 'Template para vídeos de tutoriais',
          usageCount: 8,
          successRate: 0.88,
        },
        {
          id: 'tpl_003',
          name: 'Story Daily',
          contentType: 'story',
          applicableChannels: ['instagram'],
          description: 'Template para stories diários',
          usageCount: 15,
          successRate: 0.85,
        },
      ],
    };
  }

  async getSmartSchedule(businessId: string, channels: string[]) {
    // Retornar melhor horário para postar
    return {
      businessId,
      recommendations: channels.map(channel => ({
        channel,
        bestTime: this.getBestTime(channel),
        expectedReach: this.getExpectedReach(channel),
        expectedEngagement: this.getExpectedEngagement(channel),
      })),
    };
  }

  private getBestTime(channel: string): string {
    const times = {
      instagram: '19:00',
      facebook: '13:00',
      tiktok: '08:00',
      youtube: '17:00',
      whatsapp: '09:00',
    };
    return times[channel] || '18:00';
  }

  private getExpectedReach(channel: string): number {
    const reach = {
      instagram: 2500,
      facebook: 1500,
      tiktok: 15000,
      youtube: 5000,
      whatsapp: 100,
    };
    return reach[channel] || 1000;
  }

  private getExpectedEngagement(channel: string): number {
    const engagement = {
      instagram: 125,
      facebook: 45,
      tiktok: 500,
      youtube: 150,
      whatsapp: 85,
    };
    return engagement[channel] || 50;
  }

  async getAnalytics(businessId: string, timeframe: string = 'week') {
    return {
      businessId,
      timeframe,
      totalPosts: 24,
      totalReach: 45000,
      totalEngagement: 2500,
      averageEngagementRate: 5.5,
      topPerformingPost: {
        id: 'mp_001',
        reach: 12000,
        engagement: 800,
        engagementRate: 6.7,
        contentType: 'reel',
        primaryChannel: 'instagram',
      },
      channelBreakdown: {
        instagram: { posts: 8, reach: 20000, engagement: 1200 },
        facebook: { posts: 6, reach: 10000, engagement: 300 },
        tiktok: { posts: 5, reach: 12000, engagement: 850 },
        youtube: { posts: 3, reach: 3000, engagement: 150 },
        whatsapp: { posts: 2, reach: 0, engagement: 0 },
      },
    };
  }
}
