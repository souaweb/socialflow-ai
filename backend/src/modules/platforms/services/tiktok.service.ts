import { Injectable } from '@nestjs/common';
import axios from 'axios';

/**
 * Serviço para integração com TikTok Business API
 * 
 * Documentação: https://business-api.tiktok.com/marketing_api_specification/
 * 
 * IMPORTANTE:
 * - API muito limitada, principalmente para automação
 * - Permite: Postar vídeos, ler comentários (limitado), analytics
 * - NÃO permite: DMs automáticas, responder comentários livremente
 * - Recomendação: Usar apenas para publicação de posts
 */
@Injectable()
export class TikTokService {
  private readonly API_VERSION = 'v1';
  private readonly BASE_URL = `https://business-api.tiktok.com/${this.API_VERSION}`;

  /**
   * Postar vídeo no TikTok (Business Account)
   * 
   * IMPORTANTE: Requer aprovação da Meta
   */
  async publishVideo(
    advertiserId: string,
    videoUrl: string,
    caption: string,
    hashtags: string[],
    accessToken: string,
  ) {
    try {
      // Primeiro, fazer upload do vídeo
      const uploadResponse = await axios.post(
        `${this.BASE_URL}/video/upload`,
        {
          source_type: 'FILE_UPLOAD',
          file: videoUrl,
        },
        {
          headers: {
            'Access-Token': accessToken,
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      const videoId = uploadResponse.data.data.video_id;

      // Depois, publicar o vídeo
      const publishResponse = await axios.post(
        `${this.BASE_URL}/post/publish`,
        {
          advertiser_id: advertiserId,
          video_id: videoId,
          text: `${caption} ${hashtags.map((h) => `#${h}`).join(' ')}`,
        },
        {
          headers: {
            'Access-Token': accessToken,
          },
        },
      );

      return publishResponse.data;
    } catch (error) {
      throw new Error(`Erro ao publicar vídeo no TikTok: ${error.message}`);
    }
  }

  /**
   * Obter análises de um vídeo
   */
  async getVideoAnalytics(
    videoId: string,
    accessToken: string,
  ) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/video/get`,
        {
          params: {
            video_id: videoId,
            fields: 'video_id,video_name,create_time,video_description,statistics',
          },
          headers: {
            'Access-Token': accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao obter análises: ${error.message}`);
    }
  }

  /**
   * Obter comentários de um vídeo (MUITO LIMITADO)
   * TikTok restringe bastante esse endpoint
   */
  async getVideoComments(
    videoId: string,
    accessToken: string,
    limit = 20,
  ) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/video/comment/list`,
        {
          params: {
            video_id: videoId,
            limit,
          },
          headers: {
            'Access-Token': accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao obter comentários: ${error.message}`);
    }
  }

  /**
   * Responder comentário (NÃO é possível sem API especial)
   * Esta função retorna um aviso
   */
  async replyToComment(
    commentId: string,
    message: string,
    accessToken: string,
  ) {
    throw new Error(
      '❌ TikTok não permite respostas automáticas a comentários via API pública. Isso requer aprovação especial e é muito restritivo.',
    );
  }

  /**
   * Enviar DM (NÃO é possível)
   */
  async sendDirectMessage(
    userId: string,
    message: string,
    accessToken: string,
  ) {
    throw new Error(
      '❌ TikTok não permite envio de DMs via API. A plataforma bloqueou completamente esse recurso para bots.',
    );
  }

  /**
   * Obter informações da conta
   */
  async getAccountInfo(
    accessToken: string,
  ) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/user/info`,
        {
          headers: {
            'Access-Token': accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao obter informações da conta: ${error.message}`);
    }
  }

  /**
   * Insights de performance (para Business Accounts)
   */
  async getBusinessAnalytics(
    advertiserId: string,
    accessToken: string,
  ) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/advertiser/info`,
        {
          params: {
            advertiser_id: advertiserId,
          },
          headers: {
            'Access-Token': accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao obter análises: ${error.message}`);
    }
  }
}
