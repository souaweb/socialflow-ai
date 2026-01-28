import { Injectable } from '@nestjs/common';
import axios from 'axios';

/**
 * Serviço para integração com WhatsApp Business API
 * 
 * Documentação: https://developers.facebook.com/docs/whatsapp/cloud-api
 * 
 * IMPORTANTE:
 * - Só permite RESPOSTAS a mensagens recebidas (não envio proativo sem template)
 * - Mensagens automáticas só com templates aprovados pela Meta
 * - Perfetto para IA vendedora em conversas ativas
 */
@Injectable()
export class WhatsAppService {
  private readonly API_VERSION = 'v18.0';
  private readonly BASE_URL = `https://graph.instagram.com/${this.API_VERSION}`;

  /**
   * Enviar mensagem (resposta a conversa ativa)
   */
  async sendMessage(
    phoneNumberId: string,
    recipientPhoneNumber: string,
    message: string,
    accessToken: string,
  ) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: recipientPhoneNumber,
          type: 'text',
          text: {
            preview_url: false,
            body: message,
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao enviar mensagem WhatsApp: ${error.message}`);
    }
  }

  /**
   * Enviar mensagem com template aprovado
   * OBRIGATÓRIO para automação proativa
   */
  async sendTemplate(
    phoneNumberId: string,
    recipientPhoneNumber: string,
    templateName: string,
    templateLanguage: string,
    parameters: any[],
    accessToken: string,
  ) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          to: recipientPhoneNumber,
          type: 'template',
          template: {
            name: templateName,
            language: {
              code: templateLanguage,
            },
            components: [
              {
                type: 'body',
                parameters: parameters.map((p) => ({ type: 'text', text: p })),
              },
            ],
          },
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao enviar template: ${error.message}`);
    }
  }

  /**
   * Obter mensagens (webhook receberá novos eventos)
   */
  async getMessages(
    phoneNumberId: string,
    accessToken: string,
  ) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/${phoneNumberId}/messages`,
        {
          params: { access_token: accessToken },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao obter mensagens: ${error.message}`);
    }
  }

  /**
   * Marcar mensagem como lida
   */
  async markAsRead(
    phoneNumberId: string,
    messageId: string,
    accessToken: string,
  ) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/${phoneNumberId}/messages`,
        {
          messaging_product: 'whatsapp',
          status: 'read',
          message_id: messageId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao marcar como lida: ${error.message}`);
    }
  }

  /**
   * Obter contato por número
   */
  async getContact(
    phoneNumberId: string,
    waId: string,
    accessToken: string,
  ) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/contacts`,
        {
          params: {
            fields: 'wa_id,profile,status',
            where: `wa_id="${waId}"`,
            access_token: accessToken,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao obter contato: ${error.message}`);
    }
  }

  /**
   * Upload de mídia para enviar (imagem, vídeo, áudio, documento)
   */
  async uploadMedia(
    phoneNumberId: string,
    mediaFile: Buffer,
    mediaType: 'image' | 'video' | 'audio' | 'document',
    accessToken: string,
  ) {
    try {
      const formData = new FormData();
      formData.append('file', new Blob([mediaFile]), `file.${this.getFileExtension(mediaType)}`);
      formData.append('type', this.getMimeType(mediaType));

      const response = await axios.post(
        `${this.BASE_URL}/${phoneNumberId}/media`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao fazer upload de mídia: ${error.message}`);
    }
  }

  /**
   * Enviar mensagem com mídia
   */
  async sendMediaMessage(
    phoneNumberId: string,
    recipientPhoneNumber: string,
    mediaId: string,
    mediaType: 'image' | 'video' | 'audio' | 'document',
    caption: string,
    accessToken: string,
  ) {
    try {
      const messageBody: any = {
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to: recipientPhoneNumber,
        type: mediaType,
      };

      messageBody[mediaType] = {
        id: mediaId,
        ...(caption && mediaType === 'image' && { caption }),
      };

      const response = await axios.post(
        `${this.BASE_URL}/${phoneNumberId}/messages`,
        messageBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao enviar mídia: ${error.message}`);
    }
  }

  private getFileExtension(mediaType: string): string {
    const extensions: { [key: string]: string } = {
      image: 'jpg',
      video: 'mp4',
      audio: 'mp3',
      document: 'pdf',
    };
    return extensions[mediaType] || 'bin';
  }

  private getMimeType(mediaType: string): string {
    const mimeTypes: { [key: string]: string } = {
      image: 'image/jpeg',
      video: 'video/mp4',
      audio: 'audio/mpeg',
      document: 'application/pdf',
    };
    return mimeTypes[mediaType] || 'application/octet-stream';
  }
}
