import { Injectable } from '@nestjs/common';

@Injectable()
export class VoiceProcessingService {
  
  async transcribeAudio(audioBase64: string, language: string = 'pt-BR'): Promise<string> {
    // Simular transcrição de áudio usando Google Speech-to-Text API
    // Em produção, integrar com: https://cloud.google.com/speech-to-text/docs
    
    // Mock da transcrição
    const mockTranscriptions = {
      'consultoria': 'Somos uma consultoria de transformação digital focada em empresas de tecnologia',
      'ecommerce': 'Vendemos produtos online com foco em eletrônicos e moda',
      'agencia': 'Somos uma agência de marketing digital especializada em redes sociais',
      'saas': 'Desenvolvemos software como serviço para gestão de vendas',
      'educacao': 'Oferecemos cursos online de desenvolvimento web e programação',
    };

    return mockTranscriptions[Object.keys(mockTranscriptions)[Math.floor(Math.random() * Object.keys(mockTranscriptions).length)]] || 
           'Transcrição de áudio processada com sucesso';
  }

  async extractAudioFeatures(transcription: string) {
    // Extrair características de voz/tom
    return {
      formality: this.calculateFormality(transcription),
      sentiment: this.analyzeSentiment(transcription),
      technicalLevel: this.detectTechnicalLevel(transcription),
      emotionalTone: this.detectEmotionalTone(transcription),
    };
  }

  private calculateFormality(text: string): number {
    const formalWords = ['implementar', 'estratégia', 'plataforma', 'solução', 'eficiência'];
    const informalWords = ['legal', 'top', 'massa', 'bacana'];
    
    const formalCount = formalWords.filter(w => text.toLowerCase().includes(w)).length;
    const informalCount = informalWords.filter(w => text.toLowerCase().includes(w)).length;
    
    return (formalCount / (formalCount + informalCount + 1)) * 100;
  }

  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['excelente', 'ótimo', 'melhor', 'sucesso', 'crescimento', 'incrível'];
    const negativeWords = ['problema', 'difícil', 'fracasso', 'pior', 'ruim'];
    
    const positiveCount = positiveWords.filter(w => text.toLowerCase().includes(w)).length;
    const negativeCount = negativeWords.filter(w => text.toLowerCase().includes(w)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  private detectTechnicalLevel(text: string): 'high' | 'medium' | 'low' {
    const technicalWords = ['algoritmo', 'api', 'banco de dados', 'infraestrutura', 'código', 'devops'];
    const count = technicalWords.filter(w => text.toLowerCase().includes(w)).length;
    
    if (count > 3) return 'high';
    if (count > 1) return 'medium';
    return 'low';
  }

  private detectEmotionalTone(text: string): string {
    const energetic = ['rápido', 'dinâmico', 'ágil', 'velocidade'];
    const calm = ['tranquilo', 'seguro', 'confiável', 'estável'];
    
    const energeticCount = energetic.filter(w => text.toLowerCase().includes(w)).length;
    const calmCount = calm.filter(w => text.toLowerCase().includes(w)).length;
    
    if (energeticCount > calmCount) return 'energetic';
    if (calmCount > energeticCount) return 'calm';
    return 'neutral';
  }
}
