import { Injectable } from '@nestjs/common';

@Injectable()
export class ChannelOptimizationService {
  
  async optimizeForChannel(
    content: string,
    channel: string,
    contentType: string
  ): Promise<{
    optimizedContent: string;
    score: number;
    recommendations: string[];
    estimatedReach: number;
    bestTimeToPost: string;
  }> {
    
    const score = this.calculateOptimizationScore(content, channel, contentType);
    const recommendations = this.generateRecommendations(content, channel);
    const bestTime = this.getBestTimeToPost(channel);
    const estimatedReach = this.estimateReach(content, channel);

    return {
      optimizedContent: content,
      score,
      recommendations,
      estimatedReach,
      bestTimeToPost: bestTime,
    };
  }

  private calculateOptimizationScore(content: string, channel: string, contentType: string): number {
    let score = 50;

    // Validar tamanho
    const maxLengths = {
      instagram: 2200,
      facebook: 63206,
      tiktok: 2200,
      youtube: 5000,
      whatsapp: 1024,
    };

    if (content.length <= maxLengths[channel]) {
      score += 15;
    }

    // Validar hashtags
    const hashtagCount = (content.match(/#\w+/g) || []).length;
    const optimalHashtags = {
      instagram: 30,
      facebook: 5,
      tiktok: 15,
      youtube: 20,
      whatsapp: 0,
    };

    if (hashtagCount <= optimalHashtags[channel]) {
      score += 10;
    }

    // Validar mentions
    const mentionCount = (content.match(/@\w+/g) || []).length;
    if (mentionCount < 5) {
      score += 10;
    }

    // Validar emojis
    const emojiCount = (content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
    if (emojiCount > 0 && channel !== 'whatsapp') {
      score += 10;
    }

    // Validar CTA
    const ctaWords = ['clique', 'compartilhe', 'comente', 'inscreva', 'siga'];
    if (ctaWords.some(word => content.toLowerCase().includes(word))) {
      score += 5;
    }

    return Math.min(100, score);
  }

  private generateRecommendations(content: string, channel: string): string[] {
    const recommendations = [];

    // Verificar hashtags
    const hashtagCount = (content.match(/#\w+/g) || []).length;
    if (channel === 'instagram' && hashtagCount < 20) {
      recommendations.push('Adicione mais hashtags (20-30 recomendado)');
    }

    // Verificar CTA
    const ctaWords = ['clique', 'compartilhe', 'comente', 'inscreva'];
    if (!ctaWords.some(word => content.toLowerCase().includes(word))) {
      recommendations.push('Adicione um Call-to-Action (CTA)');
    }

    // Verificar emojis
    const emojiCount = (content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
    if (emojiCount === 0 && channel !== 'whatsapp') {
      recommendations.push('Adicione emojis para aumentar engajamento');
    }

    // Verificar comprimento
    if (content.length < 100) {
      recommendations.push('Texto muito curto, considere adicionar mais detalhes');
    }

    // Verificar capitalização
    const capitalizedWords = (content.match(/\b[A-Z][a-z]+\b/g) || []).length;
    if (capitalizedWords < content.split(' ').length * 0.1) {
      recommendations.push('Verifique a capitalização do texto');
    }

    // Sugestões específicas por canal
    if (channel === 'tiktok') {
      recommendations.push('Use trends e sons populares do TikTok');
      recommendations.push('Mantenha o vídeo entre 15-60 segundos');
    }

    if (channel === 'youtube') {
      recommendations.push('Escreva uma descrição completa (2000+ caracteres)');
      recommendations.push('Use palavras-chave relevantes no título');
    }

    if (channel === 'instagram') {
      recommendations.push('Use localização (location tags)');
      recommendations.push('Responda aos comentários nas primeiras 24h');
    }

    return recommendations.slice(0, 5);
  }

  private getBestTimeToPost(channel: string): string {
    // Horários ótimos para cada canal (baseado em estudos)
    const bestTimes = {
      instagram: '19:00 (terça a quinta)',
      facebook: '13:00 e 19:00 (quarta)',
      tiktok: '06:00-10:00 e 19:00-23:00 (todos os dias)',
      youtube: '17:00 (quinta a sábado)',
      whatsapp: '09:00-11:00 (segunda a sexta)',
    };

    return bestTimes[channel] || '18:00';
  }

  private estimateReach(content: string, channel: string): number {
    // Estimativa baseada em qualidade do conteúdo
    const baseReach = {
      instagram: 1000,
      facebook: 500,
      tiktok: 5000,
      youtube: 100,
      whatsapp: 50,
    };

    const base = baseReach[channel];
    
    // Ajustar baseado em características
    let multiplier = 1;

    // Hashtags aumentam alcance
    const hashtagCount = (content.match(/#\w+/g) || []).length;
    multiplier += hashtagCount * 0.01;

    // Emojis aumentam engajamento
    const emojiCount = (content.match(/[\u{1F300}-\u{1F9FF}]/gu) || []).length;
    multiplier += emojiCount * 0.05;

    // CTAs aumentam alcance
    if (content.toLowerCase().includes('compartilhe')) multiplier += 0.2;
    if (content.toLowerCase().includes('comente')) multiplier += 0.15;

    return Math.floor(base * multiplier);
  }

  async getChannelAnalytics(channel: string): Promise<{
    channel: string;
    averageEngagementRate: number;
    topContentTypes: string[];
    bestPostingTime: string;
    averageReach: number;
    recommendations: string[];
  }> {
    const analytics = {
      instagram: {
        averageEngagementRate: 4.5,
        topContentTypes: ['reel', 'carousel', 'story'],
        bestPostingTime: '19:00',
        averageReach: 2500,
      },
      facebook: {
        averageEngagementRate: 1.8,
        topContentTypes: ['post', 'video'],
        bestPostingTime: '13:00',
        averageReach: 1500,
      },
      tiktok: {
        averageEngagementRate: 8.2,
        topContentTypes: ['video'],
        bestPostingTime: '06:00-10:00',
        averageReach: 15000,
      },
      youtube: {
        averageEngagementRate: 3.5,
        topContentTypes: ['video'],
        bestPostingTime: '17:00',
        averageReach: 5000,
      },
      whatsapp: {
        averageEngagementRate: 45,
        topContentTypes: ['text', 'image'],
        bestPostingTime: '09:00',
        averageReach: 100,
      },
    };

    const data = analytics[channel] || analytics['instagram'];

    return {
      channel,
      ...data,
      recommendations: [
        `Poste ${data.topContentTypes[0]} para melhor engajamento`,
        `Melhor horário: ${data.bestPostingTime}`,
        `Engajamento médio: ${data.averageEngagementRate}%`,
      ],
    };
  }

  async predictPerformance(
    content: string,
    channel: string,
    contentType: string
  ): Promise<{
    expectedEngagement: number;
    expectedReach: number;
    confidenceScore: number;
    predictedComments: number;
    predictedShares: number;
    predictedLikes: number;
  }> {
    // Simular previsão de performance
    const baseMetrics = {
      instagram: { engagement: 50, reach: 1000, comments: 8, shares: 3, likes: 85 },
      facebook: { engagement: 30, reach: 500, comments: 4, shares: 2, likes: 45 },
      tiktok: { engagement: 200, reach: 5000, comments: 20, shares: 15, likes: 400 },
      youtube: { engagement: 50, reach: 500, comments: 10, shares: 5, likes: 100 },
    };

    const metrics = baseMetrics[channel] || baseMetrics['instagram'];
    const qualityScore = this.calculateOptimizationScore(content, channel, contentType) / 100;

    return {
      expectedEngagement: Math.floor(metrics.engagement * qualityScore),
      expectedReach: Math.floor(metrics.reach * qualityScore),
      confidenceScore: Math.min(95, qualityScore * 100),
      predictedComments: Math.floor(metrics.comments * qualityScore),
      predictedShares: Math.floor(metrics.shares * qualityScore),
      predictedLikes: Math.floor(metrics.likes * qualityScore),
    };
  }
}
