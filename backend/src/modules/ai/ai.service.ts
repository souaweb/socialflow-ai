import { Injectable } from '@nestjs/common';
import axios from 'axios';

/**
 * Serviço de IA Conversacional para atender como vendedor especialista
 * 
 * Funcionalidades:
 * - Análise de intenção (lead frio/morno/quente)
 * - Geração de respostas personalizadas
 * - Detecção de sentimento
 * - Sugestões de gatilhos de venda
 * - Integração com CRM
 * - Agendamento automático de follow-ups
 */
@Injectable()
export class AiService {
  private readonly GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  private readonly GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  /**
   * Analisar mensagem recebida e classificar lead
   */
  async analyzeMessage(message: string, context: any = {}) {
    try {
      const prompt = this.buildAnalysisPrompt(message, context);

      const response = await axios.post(
        `${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
      );

      const analysisText = response.data.candidates[0].content.parts[0].text;

      // Parse da resposta
      return this.parseAnalysis(analysisText);
    } catch (error) {
      console.error('Erro ao analisar mensagem:', error);
      return {
        intent: 'unknown',
        sentiment: 'neutral',
        leadQuality: 'cold',
        keywords: [],
      };
    }
  }

  /**
   * Gerar resposta automática como vendedor especialista
   */
  async generateSalesResponse(
    userMessage: string,
    businessContext: any,
    conversationHistory: any[] = [],
  ) {
    try {
      const prompt = this.buildSalesPrompt(
        userMessage,
        businessContext,
        conversationHistory,
      );

      const response = await axios.post(
        `${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error('Erro ao gerar resposta:', error);
      return '😊 Obrigado pela mensagem! Um de nossos especialistas entrará em contato em breve.';
    }
  }

  /**
   * Detectar intenção de compra
   */
  async detectPurchaseIntent(message: string) {
    const keywords = {
      high: ['preço', 'quanto custa', 'como compro', 'quero comprar', 'disponível', 'estoque'],
      medium: ['qual é', 'funciona', 'como é', 'características', 'detalhe'],
      low: ['oi', 'olá', 'tudo bem', 'qual é a empresa'],
    };

    let intent = 'cold';
    for (const keyword of keywords.high) {
      if (message.toLowerCase().includes(keyword)) {
        intent = 'hot';
        break;
      }
    }

    if (intent === 'cold') {
      for (const keyword of keywords.medium) {
        if (message.toLowerCase().includes(keyword)) {
          intent = 'warm';
          break;
        }
      }
    }

    return intent;
  }

  /**
   * Sugerir próxima ação (follow-up)
   */
  async suggestNextAction(
    message: string,
    leadQuality: string,
    lastInteraction: Date,
  ) {
    const now = new Date();
    const hoursSinceLastInteraction = (now.getTime() - lastInteraction.getTime()) / (1000 * 60 * 60);

    const suggestions = {
      hot: {
        immediate: 'Enviar proposta de valor',
        actions: ['Chamar para ligar', 'Enviar demo/sample', 'Oferecer desconto limitado'],
        followupInHours: 1,
      },
      warm: {
        immediate: 'Engajar e qualificar',
        actions: ['Fazer perguntas de qualificação', 'Enviar conteúdo relevante'],
        followupInHours: 12,
      },
      cold: {
        immediate: 'Iniciar conversa',
        actions: ['Perguntar necessidade', 'Oferecer informações'],
        followupInHours: 24,
      },
    };

    return suggestions[leadQuality] || suggestions.cold;
  }

  /**
   * Transcré audio em texto
   */
  async transcribeAudio(audioBuffer: Buffer) {
    // Implementar com Whisper API ou similar
    return '🎵 Transcrição de áudio';
  }

  /**
   * Extrair informações/fatos de texto
   */
  async extractFacts(text: string) {
    try {
      const prompt = `Extraia fatos importantes e palavras-chave de: "${text}"\n\nRetorne um JSON com: {"fatos": [], "palavras_chave": [], "sentimento": "positivo|neutro|negativo"}`;

      const response = await axios.post(
        `${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
      );

      const text = response.data.candidates[0].content.parts[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : { fatos: [], palavras_chave: [], sentimento: 'neutro' };
    } catch (error) {
      return { fatos: [], palavras_chave: [], sentimento: 'neutro' };
    }
  }

  /**
   * Gerar hashtags automáticas
   */
  async generateHashtags(content: string, platform: string) {
    try {
      const platformLimits = {
        instagram: 30,
        tiktok: 10,
        twitter: 5,
        youtube: 10,
      };

      const limit = platformLimits[platform] || 10;

      const prompt = `Gere ${limit} hashtags relevantes para este conteúdo de ${platform}:\n"${content}"\n\nRetorne apenas as hashtags, uma por linha, sem #`;

      const response = await axios.post(
        `${this.GEMINI_API_URL}?key=${this.GEMINI_API_KEY}`,
        {
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
        },
      );

      return response.data.candidates[0].content.parts[0].text
        .split('\n')
        .filter((h) => h.trim())
        .slice(0, limit);
    } catch (error) {
      return ['socialflow', 'ai', 'marketing'];
    }
  }

  // === HELPER METHODS ===

  private buildAnalysisPrompt(message: string, context: any) {
    return `Analise esta mensagem de cliente e retorne em JSON:
    
    Mensagem: "${message}"
    Contexto do negócio: ${JSON.stringify(context)}
    
    Retorne um JSON com:
    {
      "intent": "question|complaint|purchase|information|other",
      "sentiment": "positive|neutral|negative",
      "leadQuality": "cold|warm|hot",
      "urgency": "high|medium|low",
      "keywords": ["palavra1", "palavra2"],
      "recomendaçao": "texto breve"
    }`;
  }

  private buildSalesPrompt(message: string, businessContext: any, conversationHistory: any[]) {
    return `Você é um vendedor especialista representando a empresa.
    
    Contexto da empresa: ${JSON.stringify(businessContext)}
    Mensagem do cliente: "${message}"
    Histórico da conversa: ${JSON.stringify(conversationHistory)}
    
    Regras:
    - Seja amigável mas profissional
    - Foque em resolver o problema do cliente
    - Use gatilhos de venda sutilmente (valor, urgência, exclusividade)
    - Seja conciso (máximo 3 linhas)
    - Termine com uma pergunta ou CTA
    
    Responda naturalmente como um vendedor experiente:`;
  }

  private parseAnalysis(analysisText: string) {
    try {
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : this.getDefaultAnalysis();
    } catch (error) {
      return this.getDefaultAnalysis();
    }
  }

  private getDefaultAnalysis() {
    return {
      intent: 'unknown',
      sentiment: 'neutral',
      leadQuality: 'cold',
      urgency: 'low',
      keywords: [],
    };
  }
}
