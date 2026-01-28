import { Injectable } from '@nestjs/common';
import axios from 'axios';

/**
 * Serviço para integração com Meta Graph API
 * Cobre: Instagram, Facebook, WhatsApp
 * 
 * Documentação: https://developers.facebook.com/docs/graph-api
 */
@Injectable()
export class MetaService {
  private readonly API_VERSION = 'v18.0';
  private readonly BASE_URL = `https://graph.instagram.com/${this.API_VERSION}`;

  /**
   * Responder comentários no Instagram
   * Necessário: access_token com permissão 'instagram_manage_messages'
   */
  async replyToComment(
    commentId: string,
    message: string,
    accessToken: string,
  ) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/${commentId}/replies`,
        {
          message,
        },
        {
          params: { access_token: accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao responder comentário: ${error.message}`);
    }
  }

  /**
   * Responder DMs no Instagram (apenas Business accounts)
   * Necessário: access_token com permissão 'instagram_manage_messages'
   */
  async replyToDirectMessage(
    conversationId: string,
    message: string,
    accessToken: string,
  ) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/${conversationId}/messages`,
        {
          message,
        },
        {
          params: { access_token: accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao responder DM: ${error.message}`);
    }
  }

  /**
   * Postar conteúdo no Instagram
   */
  async publishPost(
    instagramBusinessAccountId: string,
    mediaUrl: string,
    caption: string,
    accessToken: string,
  ) {
    try {
      // Primeiro, criar o media container
      const containerResponse = await axios.post(
        `${this.BASE_URL}/${instagramBusinessAccountId}/media`,
        {
          image_url: mediaUrl,
          caption,
        },
        {
          params: { access_token: accessToken },
        },
      );

      // Depois, publicar o container
      const publishResponse = await axios.post(
        `${this.BASE_URL}/${instagramBusinessAccountId}/media_publish`,
        {
          creation_id: containerResponse.data.id,
        },
        {
          params: { access_token: accessToken },
        },
      );

      return publishResponse.data;
    } catch (error) {
      throw new Error(`Erro ao publicar post: ${error.message}`);
    }
  }

  /**
   * Obter conversas do Instagram
   */
  async getConversations(
    instagramBusinessAccountId: string,
    accessToken: string,
  ) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/${instagramBusinessAccountId}/conversations`,
        {
          params: {
            fields: 'id,participants,senders,snippet,updated_time',
            access_token: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao obter conversas: ${error.message}`);
    }
  }

  /**
   * Obter mensagens de uma conversa
   */
  async getMessages(
    conversationId: string,
    accessToken: string,
  ) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/${conversationId}/messages`,
        {
          params: {
            fields: 'id,message,created_time,from,to',
            access_token: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao obter mensagens: ${error.message}`);
    }
  }

  /**
   * Obter comentários de um post
   */
  async getPostComments(
    postId: string,
    accessToken: string,
  ) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/${postId}/comments`,
        {
          params: {
            fields: 'id,text,from,timestamp,like_count',
            access_token: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao obter comentários: ${error.message}`);
    }
  }

  /**
   * Obter webhooks (para sincronizar eventos)
   */
  getWebhookSignature(data: string) {
    const crypto = require('crypto');
    const signature = crypto
      .createHmac('sha256', process.env.META_APP_SECRET)
      .update(data)
      .digest('hex');
    return signature;
  }

  /**
   * Buscar usuário por ID (para sincronização de contatos)
   */
  async getUserInfo(userId: string, accessToken: string) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/${userId}`,
        {
          params: {
            fields: 'id,name,profile_picture_url',
            access_token: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao obter informações do usuário: ${error.message}`);
    }
  }
}
