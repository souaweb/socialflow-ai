import { Injectable } from '@nestjs/common';
import axios from 'axios';

/**
 * Serviço para integração com YouTube Data API
 * 
 * Documentação: https://developers.google.com/youtube/v3
 */
@Injectable()
export class YouTubeService {
  private readonly API_VERSION = 'v3';
  private readonly BASE_URL = `https://www.googleapis.com/youtube/${this.API_VERSION}`;

  /**
   * Postar vídeo (não é possível via API)
   * YouTube requer upload manual ou via YouTube Studio
   */
  async uploadVideo(
    channelId: string,
    videoFile: Buffer,
    title: string,
    description: string,
    tags: string[],
    accessToken: string,
  ) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/videos?part=snippet,status`,
        {
          snippet: {
            title,
            description,
            tags,
            channelId,
          },
          status: {
            privacyStatus: 'public',
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao fazer upload de vídeo: ${error.message}`);
    }
  }

  /**
   * Obter comentários de um vídeo
   */
  async getVideoComments(
    videoId: string,
    accessToken: string,
    maxResults = 20,
  ) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/commentThreads`,
        {
          params: {
            part: 'snippet,replies',
            videoId,
            maxResults,
            textFormat: 'plainText',
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao obter comentários: ${error.message}`);
    }
  }

  /**
   * Responder comentário
   */
  async replyToComment(
    parentId: string,
    message: string,
    accessToken: string,
  ) {
    try {
      const response = await axios.post(
        `${this.BASE_URL}/comments?part=snippet`,
        {
          snippet: {
            textOriginal: message,
            parentId,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao responder comentário: ${error.message}`);
    }
  }

  /**
   * Atualizar comentário
   */
  async updateComment(
    commentId: string,
    newMessage: string,
    accessToken: string,
  ) {
    try {
      const response = await axios.put(
        `${this.BASE_URL}/comments?part=snippet`,
        {
          id: commentId,
          snippet: {
            textOriginal: newMessage,
          },
        },
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        },
      );
      return response.data;
    } catch (error) {
      throw new Error(`Erro ao atualizar comentário: ${error.message}`);
    }
  }

  /**
   * Deletar comentário
   */
  async deleteComment(
    commentId: string,
    accessToken: string,
  ) {
    try {
      await axios.delete(
        `${this.BASE_URL}/comments`,
        {
          params: { id: commentId },
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        },
      );
      return { success: true };
    } catch (error) {
      throw new Error(`Erro ao deletar comentário: ${error.message}`);
    }
  }

  /**
   * Obter informações do canal
   */
  async getChannelInfo(
    accessToken: string,
  ) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/channels`,
        {
          params: {
            part: 'snippet,statistics,contentDetails',
            mine: true,
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        },
      );
      return response.data.items[0];
    } catch (error) {
      throw new Error(`Erro ao obter informações do canal: ${error.message}`);
    }
  }

  /**
   * Obter vídeos do canal
   */
  async getChannelVideos(
    channelId: string,
    accessToken: string,
    maxResults = 25,
  ) {
    try {
      // Primeiro obter uploads playlist
      const channelResponse = await axios.get(
        `${this.BASE_URL}/channels`,
        {
          params: {
            part: 'contentDetails',
            id: channelId,
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        },
      );

      const uploadsPlaylistId = channelResponse.data.items[0].contentDetails.relatedPlaylists.uploads;

      // Depois obter itens da playlist
      const playlistResponse = await axios.get(
        `${this.BASE_URL}/playlistItems`,
        {
          params: {
            part: 'snippet',
            playlistId: uploadsPlaylistId,
            maxResults,
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        },
      );

      return playlistResponse.data;
    } catch (error) {
      throw new Error(`Erro ao obter vídeos: ${error.message}`);
    }
  }

  /**
   * Obter estatísticas de um vídeo
   */
  async getVideoStats(
    videoId: string,
    accessToken: string,
  ) {
    try {
      const response = await axios.get(
        `${this.BASE_URL}/videos`,
        {
          params: {
            part: 'statistics,snippet',
            id: videoId,
          },
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          },
        },
      );
      return response.data.items[0];
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas: ${error.message}`);
    }
  }
}
