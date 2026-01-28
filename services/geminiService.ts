
import { GoogleGenAI } from "@google/genai";

// ⚠️ IMPORTANTE: Nunca exponha API keys no cliente!
// Em produção, SEMPRE use um endpoint backend seguro
// Exemplo: /api/gemini.php que faz a requisição com a chave protegida

const API_ENDPOINT = '/api/gemini.php';

/**
 * Chamada segura para IA via endpoint backend
 * O backend valida autenticação e limita uso
 */
const callAIBackend = async (action: string, params: any) => {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || 'dev'}`
      },
      body: JSON.stringify({ action, ...params })
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Erro ao chamar IA:', error);
    throw error;
  }
};

/**
 * Gera imagem usando IA (via backend seguro)
 */
export const generateAIImage = async (prompt: string, aspectRatio: "1:1" | "16:9" | "9:16" = "1:1") => {
  try {
    const result = await callAIBackend('generate_image', {
      prompt: `Crie uma imagem profissional de alta qualidade para anúncio: ${prompt}`,
      aspectRatio
    });

    if (result.error) throw new Error(result.error);
    return result.imageUrl || `data:image/png;base64,${result.data}`;
  } catch (error) {
    console.error("Erro na geração de imagem:", error);
    // Retornar imagem placeholder para desenvolvimento
    return 'https://via.placeholder.com/800x600?text=Imagem+IA+(Em+Desenvolvimento)';
  }
};

/**
 * Gera vídeo usando IA (via backend seguro)
 */
export const generateAIVideo = async (prompt: string, aspectRatio: '16:9' | '9:16' = '9:16') => {
  try {
    const result = await callAIBackend('generate_video', {
      prompt: `Crie um vídeo profissional para redes sociais: ${prompt}`,
      aspectRatio
    });

    if (result.error) throw new Error(result.error);
    return result.videoUrl || result.data;
  } catch (error) {
    console.error("Erro na geração de vídeo:", error);
    // Retornar vídeo placeholder para desenvolvimento
    return 'https://via.placeholder.com/1280x720?text=V%C3%ADdeo+IA+(Em+Desenvolvimento)';
  }
};

/**
 * Gera resposta de vendas personalizada com contexto do negócio
 */
export const generateSalesResponse = async (
  platform: string,
  userMessage: string,
  businessContext: string
) => {
  try {
    const result = await callAIBackend('generate_sales_response', {
      platform,
      userMessage,
      businessContext
    });

    if (result.error) throw new Error(result.error);
    return result.response || result.text;
  } catch (error) {
    console.error("Erro na geração de resposta de vendas:", error);
    return "Obrigado pelo seu interesse! Como posso ajudar você hoje?";
  }
};

/**
 * Transcreve áudio para texto (via backend)
 */
export const transcribeAudio = async (audioFile: File) => {
  try {
    const formData = new FormData();
    formData.append('file', audioFile);
    formData.append('action', 'transcribe_audio');

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('auth_token') || 'dev'}`
      },
      body: formData
    });

    if (!response.ok) throw new Error(`API Error: ${response.status}`);
    
    const result = await response.json();
    if (result.error) throw new Error(result.error);
    return result.text || result.transcript;
  } catch (error) {
    console.error("Erro na transcrição de áudio:", error);
    throw error;
  }
};

/**
 * Extrai fatos/resumo de conteúdo (via backend)
 */
export const extractFacts = async (content: string) => {
  try {
    const result = await callAIBackend('extract_facts', { content });
    
    if (result.error) throw new Error(result.error);
    return result.facts || [];
  } catch (error) {
    console.error("Erro ao extrair fatos:", error);
    return [];
  }
};

/**
 * Gera legenda cross-posting otimizada para cada plataforma
 */
export const generateCrossPostingCaption = async (
  originalCaption: string,
  platforms: string[]
) => {
  try {
    const result = await callAIBackend('generate_captions', {
      caption: originalCaption,
      platforms
    });

    if (result.error) throw new Error(result.error);
    return result.captions || {};
  } catch (error) {
    console.error("Erro na geração de legendas:", error);
    // Retornar a legenda original para todas as plataformas
    return platforms.reduce((acc, platform) => {
      acc[platform] = originalCaption;
      return acc;
    }, {} as Record<string, string>);
  }
};

