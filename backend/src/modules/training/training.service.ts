import { Injectable } from '@nestjs/common';
import { VoiceProcessingService } from './services/voice-processing.service';
import { TextProcessingService } from './services/text-processing.service';
import { BusinessTypeDetectionService } from './services/business-type-detection.service';

@Injectable()
export class TrainingService {
  
  constructor(
    private voiceService: VoiceProcessingService,
    private textService: TextProcessingService,
    private businessTypeService: BusinessTypeDetectionService,
  ) {}

  async addTextTraining(businessId: string, content: string, businessType: string) {
    // Validar conteúdo
    const validation = await this.textService.validateTrainingContent(content);
    
    // Extrair keywords
    const keywords = await this.textService.extractKeywords(content);
    
    // Detectar idioma
    const language = await this.textService.detectLanguage(content);

    return {
      id: 'train_' + Math.random().toString(36).substr(2, 9),
      inputType: 'text',
      businessId,
      businessType,
      content: content.substring(0, 500), // Preview
      keywords,
      language,
      quality: validation.score / 100,
      validation,
      createdAt: new Date(),
    };
  }

  async addVoiceTraining(businessId: string, audioBase64: string, businessType: string) {
    // Transcrever áudio
    const transcription = await this.voiceService.transcribeAudio(audioBase64);
    
    // Extrair características de voz
    const audioFeatures = await this.voiceService.extractAudioFeatures(transcription);
    
    // Extrair keywords da transcrição
    const keywords = await this.textService.extractKeywords(transcription);

    return {
      id: 'train_' + Math.random().toString(36).substr(2, 9),
      inputType: 'voice',
      businessId,
      businessType,
      transcription: transcription.substring(0, 500),
      audioFeatures,
      keywords,
      quality: 0.85,
      createdAt: new Date(),
    };
  }

  async addFileTraining(businessId: string, fileUrl: string, businessType: string, fileName: string) {
    // Simular leitura de arquivo (PDF, DOCX, TXT)
    const content = `Conteúdo extraído de ${fileName}. Este seria o conteúdo real do arquivo após processamento.`;
    
    // Processar como texto
    const keywords = await this.textService.extractKeywords(content);
    const validation = await this.textService.validateTrainingContent(content);

    return {
      id: 'train_' + Math.random().toString(36).substr(2, 9),
      inputType: 'file',
      businessId,
      businessType,
      fileName,
      fileUrl,
      content: content.substring(0, 500),
      keywords,
      quality: validation.score / 100,
      createdAt: new Date(),
    };
  }

  async identifyBusinessType(
    businessId: string,
    text: string,
    connections?: { platform: string; count: number }[]
  ) {
    const detection = await this.businessTypeService.detectBusinessType(text, connections);
    const hints = await this.businessTypeService.getBusinessTypeHints(detection.detectedType);

    return {
      businessId,
      detection,
      hints,
      recommendation: `Com base na análise, seu negócio foi identificado como "${detection.detectedType}". ${hints.description}`,
    };
  }

  async getTrainingStatus(businessId: string) {
    // Retornar status do treinamento
    return {
      businessId,
      trainingInputs: {
        text: 12,
        voice: 5,
        file: 3,
        total: 20,
      },
      businessType: 'agencia_marketing',
      trainingScore: 87.5,
      keywords: [
        { keyword: 'marketing', frequency: 45 },
        { keyword: 'social', frequency: 38 },
        { keyword: 'conteúdo', frequency: 32 },
        { keyword: 'redes', frequency: 28 },
        { keyword: 'digital', frequency: 25 },
      ],
      tone: {
        formal: 35,
        friendly: 50,
        technical: 10,
        casual: 5,
      },
      readiness: 'READY',
      recommendations: [
        'Adicione mais exemplos de conversas com clientes',
        'Inclua casos de sucesso e projetos anteriores',
        'Treine com mais exemplos de perguntas frequentes',
      ],
    };
  }

  async generateAIResponseWithTraining(businessId: string, message: string, trainingDataIds?: string[]) {
    // IA usa dados de treinamento para gerar resposta
    // Conectar com AIService para usar contexto do treinamento
    
    return {
      businessId,
      originalMessage: message,
      generatedResponse: 'Resposta gerada com base no treinamento específico do seu negócio...',
      trainingDataUsed: trainingDataIds || [],
      confidenceScore: 0.92,
      qualityRating: 'high',
      suggestions: [
        'Esta resposta foi otimizada baseada em 12 inputs de treinamento',
        'Tom detectado: Friendly e Profissional',
        'Especialidade: Marketing Digital',
      ],
    };
  }

  async getTrainingInsights(businessId: string) {
    return {
      businessId,
      insights: {
        mostUsedKeywords: ['marketing', 'social media', 'conteúdo', 'clientes', 'estratégia'],
        recommendedTopics: [
          'Gestão de redes sociais',
          'Criação de conteúdo viral',
          'Estratégia de hashtags',
          'Engajamento com público',
        ],
        trainingGaps: [
          'Faltam exemplos de atendimento ao cliente',
          'Poucos dados sobre follow-up automático',
          'Necessário mais exemplos de objeções comuns',
        ],
        improvementPotential: 92,
      },
      nextSteps: [
        'Adicione 5-10 conversas reais de clientes',
        'Grave exemplos de tom de voz desejado',
        'Compartilhe seus 3 melhores cases',
      ],
    };
  }
}
