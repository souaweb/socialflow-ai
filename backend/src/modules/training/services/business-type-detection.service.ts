import { Injectable } from '@nestjs/common';

@Injectable()
export class BusinessTypeDetectionService {
  
  private businessTypeKeywords = {
    consultoria: [
      'consultoria', 'estratégia', 'consultoria', 'transformação',
      'gestão', 'processo', 'eficiência', 'otimização',
      'cliente', 'solução', 'diagnóstico', 'implementação'
    ],
    ecommerce: [
      'ecommerce', 'loja', 'compra', 'venda', 'produto',
      'carrinho', 'desconto', 'promoção', 'estoque',
      'pedido', 'entrega', 'cliente', 'vendas'
    ],
    agencia_marketing: [
      'marketing', 'publicidade', 'agência', 'campanha',
      'social media', 'conteúdo', 'branding', 'anúncio',
      'digital', 'redes sociais', 'influencer', 'criativo'
    ],
    saas: [
      'software', 'saas', 'plataforma', 'aplicação',
      'sistema', 'api', 'integrações', 'nuvem',
      'tecnologia', 'código', 'desenvolvimento', 'programação'
    ],
    educacao: [
      'educação', 'curso', 'ensino', 'aprendizado',
      'aluno', 'professor', 'disciplina', 'treinamento',
      'certificado', 'conhecimento', 'aula', 'estudo'
    ],
    saude: [
      'saúde', 'médico', 'clínica', 'paciente',
      'consulta', 'tratamento', 'diagnóstico', 'medicamento',
      'doença', 'hospital', 'enfermagem', 'telemedicina'
    ],
    fitness: [
      'fitness', 'academia', 'exercício', 'treino',
      'musculação', 'yoga', 'personal', 'saúde',
      'bem-estar', 'nutrição', 'esporte', 'atividade física'
    ],
    restaurante: [
      'restaurante', 'comida', 'cozinha', 'chef',
      'cardápio', 'prato', 'bebida', 'mesa',
      'reserva', 'atendimento', 'culinária', 'sabor'
    ],
    imobiliario: [
      'imóvel', 'propriedade', 'casa', 'apartamento',
      'terreno', 'construção', 'venda', 'aluguel',
      'corretagem', 'avaliação', 'documentação', 'financiamento'
    ],
    servicos: [
      'serviço', 'cliente', 'contrato', 'profissional',
      'qualidade', 'atendimento', 'agendamento', 'preço',
      'experiência', 'recomendação', 'suporte', 'garantia'
    ],
    varejo: [
      'loja', 'varejo', 'comércio', 'venda',
      'cliente', 'produto', 'preço', 'estoque',
      'caixa', 'atendimento', 'promoção', 'loja'
    ],
  };

  async detectBusinessType(
    text: string,
    connections?: { platform: string; count: number }[]
  ): Promise<{
    detectedType: string;
    confidence: number;
    alternatives: { type: string; confidence: number }[];
    reasoning: string;
  }> {
    
    const lowerText = text.toLowerCase();
    const scores: Record<string, number> = {};

    // Analisar keywords
    for (const [type, keywords] of Object.entries(this.businessTypeKeywords)) {
      let score = 0;
      keywords.forEach(keyword => {
        if (lowerText.includes(keyword)) {
          score += 10;
        }
      });
      scores[type] = score;
    }

    // Considerar conexões (se disponível)
    if (connections) {
      this.boostScoresByConnections(scores, connections);
    }

    // Ordenar por score
    const sorted = Object.entries(scores)
      .sort((a, b) => b[1] - a[1])
      .map(([type, score]) => ({
        type,
        confidence: Math.min(100, score * 2), // Normalizar para 0-100
      }));

    const [topResult, ...alternatives] = sorted;

    return {
      detectedType: topResult.type,
      confidence: topResult.confidence,
      alternatives: alternatives.slice(0, 3),
      reasoning: this.generateReasoning(topResult.type, lowerText),
    };
  }

  private boostScoresByConnections(
    scores: Record<string, number>,
    connections: { platform: string; count: number }[]
  ) {
    // Conexões podem indicar tipo de negócio
    const platformHints = {
      instagram: { agencia_marketing: 5, ecommerce: 3, consultoria: 2 },
      facebook: { ecommerce: 5, restaurante: 4, varejo: 4 },
      tiktok: { agencia_marketing: 5, ecommerce: 4 },
      youtube: { educacao: 5, agencia_marketing: 4, saas: 3 },
      whatsapp: { servicos: 5, consultoria: 4, saude: 3 },
    };

    connections.forEach(({ platform, count }) => {
      const hints = platformHints[platform] || {};
      Object.entries(hints).forEach(([type, boost]) => {
        scores[type] = (scores[type] || 0) + boost * count;
      });
    });
  }

  private generateReasoning(businessType: string, text: string): string {
    const keywords = this.businessTypeKeywords[businessType] || [];
    const found = keywords.filter(k => text.includes(k));

    return `Detectado como "${businessType}" baseado nas palavras-chave encontradas: ${found.slice(0, 3).join(', ')}`;
  }

  async getBusinessTypeHints(businessType: string): Promise<{
    description: string;
    commonGoals: string[];
    bestPractices: string[];
    suggestedAutomations: string[];
  }> {
    const hints = {
      consultoria: {
        description: 'Serviços de consultoria e assessoria empresarial',
        commonGoals: ['Aumentar clientes', 'Demonstrar expertise', 'Gerar leads qualificados'],
        bestPractices: ['Compartilhar casos de sucesso', 'Publicar insights estratégicos', 'Engajar com decisores'],
        suggestedAutomations: ['Responder perguntas técnicas com IA', 'Qualificar leads por intenção', 'Agendar consultas automaticamente'],
      },
      ecommerce: {
        description: 'Comércio eletrônico e vendas online',
        commonGoals: ['Aumentar conversões', 'Reduzir carrinhos abandonados', 'Fidelizar clientes'],
        bestPractices: ['Mostrar produtos', 'Oferecer promoções', 'Solicitar avaliações'],
        suggestedAutomations: ['Recomendação de produtos', 'Recuperação de carrinho abandonado', 'Rastreamento de pedidos'],
      },
      agencia_marketing: {
        description: 'Serviços de marketing e publicidade digital',
        commonGoals: ['Conquistar clientes', 'Demonstrar resultados', 'Aumentar alcance'],
        bestPractices: ['Mostrar cases', 'Compartilhar trends', 'Engajar comunidade'],
        suggestedAutomations: ['Gerar conteúdo', 'Qualificar leads de marketing', 'Agendar estratégias'],
      },
      saas: {
        description: 'Software como serviço e aplicações web',
        commonGoals: ['Adquirir usuários', 'Aumentar retenção', 'Demonstrar valor'],
        bestPractices: ['Compartilhar tutoriais', 'Mostrar features', 'Comunicar updates'],
        suggestedAutomations: ['Onboarding automático', 'Suporte técnico com IA', 'Notificações personalizadas'],
      },
      educacao: {
        description: 'Educação e treinamento',
        commonGoals: ['Atrair alunos', 'Aumentar engajamento', 'Demonstrar qualidade'],
        bestPractices: ['Compartilhar conhecimento', 'Oferecer prévia', 'Testimoniais de alunos'],
        suggestedAutomations: ['Responder dúvidas sobre cursos', 'Agendamento de aulas', 'Certificados automáticos'],
      },
      saude: {
        description: 'Serviços de saúde e bem-estar',
        commonGoals: ['Agendar consultas', 'Aumentar pacientes', 'Oferecer orientações'],
        bestPractices: ['Compartilhar dicas de saúde', 'Testimoniais de pacientes', 'Educar sobre prevenção'],
        suggestedAutomations: ['Agendamento de consultas', 'Lembretes de medicação', 'Responder perguntas médicas'],
      },
      fitness: {
        description: 'Academia e treinamento físico',
        commonGoals: ['Aumentar membros', 'Motivar alunos', 'Oferecer treinos'],
        bestPractices: ['Compartilhar resultados', 'Desafios de treino', 'Dicas nutricionais'],
        suggestedAutomations: ['Agendamento de aulas', 'Programas de treino personalizados', 'Motivação diária'],
      },
      restaurante: {
        description: 'Restaurante e gastronomia',
        commonGoals: ['Aumentar reservas', 'Atrair clientes', 'Destacar cardápio'],
        bestPractices: ['Fotos de pratos', 'Avaliações de clientes', 'Promoções especiais'],
        suggestedAutomations: ['Agendamento de mesas', 'Sugestões de pratos', 'Programa de fidelidade'],
      },
      imobiliario: {
        description: 'Negócio imobiliário',
        commonGoals: ['Vender propriedades', 'Atrair clientes', 'Gerar leads'],
        bestPractices: ['Fotos de imóveis', 'Vídeos tours', 'Mapas e localização'],
        suggestedAutomations: ['Agendamento de visitas', 'Informações de imóveis', 'Qualificação de interessados'],
      },
    };

    return hints[businessType] || hints['servicos'];
  }
}
