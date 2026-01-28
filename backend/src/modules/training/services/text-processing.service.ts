import { Injectable } from '@nestjs/common';
import * as natural from 'natural';

@Injectable()
export class TextProcessingService {
  
  private tokenizer = new natural.WordTokenizer();
  private stemmer = natural.PorterStemmer;

  async extractKeywords(text: string): Promise<{ keyword: string; frequency: number }[]> {
    // Tokenizar
    const tokens = this.tokenizer.tokenize(text.toLowerCase());
    
    // Remover stop words português
    const stopWords = new Set([
      'o', 'a', 'de', 'para', 'com', 'sem', 'em', 'que', 'é', 'um', 'uma',
      'e', 'ou', 'mas', 'como', 'por', 'na', 'no', 'ao', 'aos', 'aos',
      'do', 'da', 'dos', 'das', 'este', 'esse', 'aquele', 'eu', 'tu',
      'ele', 'nós', 'vós', 'eles', 'sendo', 'está', 'são', 'eram'
    ]);
    
    const filtered = tokens.filter(t => !stopWords.has(t) && t.length > 2);
    
    // Stemming
    const stemmed = filtered.map(t => this.stemmer.stem(t));
    
    // Contar frequência
    const frequency = {};
    stemmed.forEach(word => {
      frequency[word] = (frequency[word] || 0) + 1;
    });
    
    // Converter para array e ordenar
    return Object.entries(frequency)
      .map(([keyword, freq]) => ({ keyword, frequency: freq as number }))
      .sort((a, b) => b.frequency - a.frequency)
      .slice(0, 20);
  }

  async analyzeTextStructure(text: string) {
    return {
      wordCount: text.split(/\s+/).length,
      sentenceCount: text.split(/[.!?]+/).length,
      averageWordLength: text.split(/\s+/).reduce((a, b) => a + b.length, 0) / text.split(/\s+/).length,
      paragraphCount: text.split('\n\n').length,
      uniqueWords: new Set(text.toLowerCase().split(/\s+/)).size,
    };
  }

  async detectLanguage(text: string): Promise<string> {
    // Simples detecção de idioma
    const ptWords = ['é', 'que', 'de', 'para', 'em', 'como', 'esse', 'aquele'];
    const enWords = ['is', 'that', 'of', 'for', 'in', 'how', 'this', 'those'];
    
    const ptCount = ptWords.filter(w => text.toLowerCase().includes(w)).length;
    const enCount = enWords.filter(w => text.toLowerCase().includes(w)).length;
    
    if (ptCount > enCount) return 'pt-BR';
    if (enCount > ptCount) return 'en-US';
    return 'pt-BR'; // default
  }

  async validateTrainingContent(text: string): Promise<{
    isValid: boolean;
    score: number;
    issues: string[];
  }> {
    const issues = [];
    let score = 100;

    // Validar tamanho mínimo
    if (text.length < 50) {
      issues.push('Texto muito curto (mínimo 50 caracteres)');
      score -= 30;
    }

    // Validar qualidade do texto
    const structure = await this.analyzeTextStructure(text);
    if (structure.wordCount < 10) {
      issues.push('Insuficientes palavras (mínimo 10)');
      score -= 20;
    }

    // Validar diversidade de vocabulário
    const diversity = structure.uniqueWords / structure.wordCount;
    if (diversity < 0.3) {
      issues.push('Vocabulário muito repetitivo');
      score -= 15;
    }

    return {
      isValid: issues.length === 0,
      score: Math.max(0, score),
      issues,
    };
  }
}
