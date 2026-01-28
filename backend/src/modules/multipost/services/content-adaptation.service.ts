import { Injectable } from '@nestjs/common';

@Injectable()
export class ContentAdaptationService {
  
  private channelSpecs = {
    instagram: {
      postMaxLength: 2200,
      reelMaxLength: 90,
      storyMaxLength: 500,
      carouselMaxSlides: 10,
      imageSize: '1080x1080',
      videoSize: '1080x1350',
      hashtags: 30,
      mentions: 20,
      supportedFormats: ['image', 'video', 'carousel', 'reel', 'story'],
    },
    facebook: {
      postMaxLength: 63206,
      imageSize: '1200x628',
      videoSize: '1920x1080',
      hashtags: 10,
      mentions: 20,
      supportedFormats: ['image', 'video', 'carousel'],
    },
    tiktok: {
      videoMaxLength: 600,
      textMaxLength: 2200,
      videoSize: '1080x1920',
      hashtags: 20,
      supportedFormats: ['video', 'image'],
    },
    youtube: {
      videoMaxLength: 60000,
      descriptionMaxLength: 5000,
      titleMaxLength: 100,
      videoSize: '1920x1080',
      hashtags: 30,
      supportedFormats: ['video'],
    },
    whatsapp: {
      messageMaxLength: 1024,
      imageSize: '800x800',
      videoSize: '800x600',
      supportedFormats: ['image', 'video', 'text'],
    },
  };

  async adaptContent(
    originalContent: string,
    channels: string[],
    contentType: string,
    tone?: string,
    keywords?: string
  ): Promise<{
    [channel: string]: {
      text: string;
      format: string;
      hashtags: string[];
      mediaType: string;
      dimensions: string;
      ctas: string[];
      emojis?: string[];
    };
  }> {
    const adapted = {};

    for (const channel of channels) {
      adapted[channel] = await this.adaptForChannel(
        originalContent,
        channel,
        contentType,
        tone,
        keywords
      );
    }

    return adapted;
  }

  private async adaptForChannel(
    content: string,
    channel: string,
    contentType: string,
    tone?: string,
    keywords?: string
  ) {
    const specs = this.channelSpecs[channel];

    // Adaptar texto
    let adaptedText = this.truncateContent(content, specs.postMaxLength);
    adaptedText = this.applyTone(adaptedText, tone);
    adaptedText = this.optimizeForSEO(adaptedText, keywords);

    // Gerar hashtags específicas do canal
    const hashtags = this.generateHashtags(content, channel, specs.hashtags);

    // Determinar formato e dimensões
    const format = this.determineFormat(contentType, channel);
    const dimensions = this.getDimensions(contentType, channel);
    const mediaType = this.getMediaType(contentType);

    // Gerar CTAs (Call-to-Actions)
    const ctas = this.generateCTAs(channel, contentType);

    // Adicionar emojis se apropriado
    const emojis = this.addEmojis(adaptedText, channel);

    return {
      text: adaptedText,
      format,
      hashtags,
      mediaType,
      dimensions,
      ctas,
      emojis,
    };
  }

  private truncateContent(content: string, maxLength: number): string {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength - 3) + '...';
  }

  private applyTone(content: string, tone?: string): string {
    if (!tone) return content;

    const toneTransforms = {
      formal: (text: string) => text.replace(/tá/g, 'está').replace(/vc/g, 'você'),
      friendly: (text: string) => text + ' 😊',
      technical: (text: string) => text.replace(/coisa/g, 'funcionalidade'),
      casual: (text: string) => text.toLowerCase(),
    };

    return toneTransforms[tone]?.(content) || content;
  }

  private optimizeForSEO(content: string, keywords?: string): string {
    if (!keywords) return content;

    const keywordList = keywords.split(',').map(k => k.trim());
    let optimized = content;

    // Garantir que keywords apareçam no início
    if (keywordList.length > 0 && !content.toLowerCase().includes(keywordList[0].toLowerCase())) {
      optimized = `${keywordList[0]}: ${content}`;
    }

    return optimized;
  }

  private generateHashtags(content: string, channel: string, maxHashtags: number): string[] {
    const words = content.split(' ').filter(w => w.length > 4);
    const hashtags = words
      .slice(0, maxHashtags)
      .map(w => `#${w.toLowerCase().replace(/[^a-z0-9]/g, '')}`);

    // Adicionar hashtags populares do canal
    const popularHashtags = {
      instagram: ['#reelsinstagram', '#exploremore', '#viral'],
      tiktok: ['#foryou', '#trending', '#viral'],
      facebook: ['#sharetolove'],
      youtube: ['#subscribe'],
    };

    return [...new Set([...hashtags, ...(popularHashtags[channel] || [])])].slice(0, maxHashtags);
  }

  private determineFormat(contentType: string, channel: string): string {
    const formatMap = {
      instagram: {
        post: 'feed',
        reel: 'reel',
        story: 'story',
        carousel: 'carousel',
        video: 'reel',
      },
      tiktok: {
        post: 'video',
        reel: 'video',
        video: 'video',
      },
      youtube: {
        post: 'short',
        reel: 'short',
        video: 'video',
      },
      facebook: {
        post: 'feed',
        carousel: 'carousel',
        video: 'video',
      },
    };

    return formatMap[channel]?.[contentType] || contentType;
  }

  private getDimensions(contentType: string, channel: string): string {
    const dimensionsMap = {
      instagram: {
        post: '1080x1080',
        reel: '1080x1920',
        story: '1080x1920',
        carousel: '1080x1080',
        video: '1080x1350',
      },
      tiktok: {
        post: '1080x1920',
        reel: '1080x1920',
        video: '1080x1920',
      },
      youtube: {
        post: '1280x720',
        reel: '1280x720',
        video: '1920x1080',
      },
      facebook: {
        post: '1200x628',
        carousel: '1200x628',
        video: '1920x1080',
      },
      whatsapp: {
        post: '800x800',
        video: '800x600',
      },
    };

    return dimensionsMap[channel]?.[contentType] || '1080x1080';
  }

  private getMediaType(contentType: string): string {
    const mediaTypes = {
      post: 'image',
      reel: 'video',
      story: 'image',
      carousel: 'image',
      video: 'video',
    };

    return mediaTypes[contentType] || 'image';
  }

  private generateCTAs(channel: string, contentType: string): string[] {
    const ctas = {
      instagram: ['Comente sua opinião!', 'Clique no link do perfil!', 'Compartilhe com um amigo!'],
      tiktok: ['Like se concorda!', 'Siga para mais!', 'Comente abaixo!'],
      youtube: ['Se inscreva!', 'Deixe um like!', 'Ative as notificações!'],
      facebook: ['Compartilhe com amigos!', 'Comente aqui!', 'Reaja com um emoji!'],
      whatsapp: ['Responda aqui!', 'Reaja à mensagem!'],
    };

    return ctas[channel] || [];
  }

  private addEmojis(content: string, channel: string): string[] {
    if (channel === 'whatsapp') return [];

    const emojiMap = {
      'Olá': '👋',
      'Obrigado': '🙏',
      'Parabéns': '🎉',
      'Dúvida': '❓',
      'Venda': '💰',
      'Oferta': '🎁',
      'Novo': '✨',
      'Melhor': '⭐',
    };

    const emojis = [];
    Object.entries(emojiMap).forEach(([word, emoji]) => {
      if (content.includes(word)) emojis.push(emoji);
    });

    return emojis;
  }

  async optimizeForMobileReading(text: string, channel: string): Promise<string> {
    // Quebrar em linhas menores para melhor leitura mobile
    const lines = text.split('\n');
    const optimized = lines
      .map(line => {
        if (line.length > 60) {
          return line.substring(0, 60) + '\n' + line.substring(60);
        }
        return line;
      })
      .join('\n');

    return optimized;
  }

  async getChannelRecommendations(content: string): Promise<{
    recommendedChannels: Array<{
      channel: string;
      score: number;
      reason: string;
      suggestedFormat: string;
    }>;
  }> {
    // Analisar conteúdo e recomendar melhores canais
    return {
      recommendedChannels: [
        {
          channel: 'instagram',
          score: 95,
          reason: 'Conteúdo visual é ideal para Instagram',
          suggestedFormat: 'reel',
        },
        {
          channel: 'facebook',
          score: 80,
          reason: 'Bom para compartilhamento e alcance',
          suggestedFormat: 'post',
        },
        {
          channel: 'tiktok',
          score: 85,
          reason: 'Ótimo para conteúdo viral',
          suggestedFormat: 'video',
        },
      ],
    };
  }
}
