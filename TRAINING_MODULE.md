# 🧠 TRAINING MODULE - IA CUSTOMIZADA POR NEGÓCIO

## ✨ Novo Módulo Criado

O **Training Module** permite treinar a IA com dados específicos de cada negócio, identificando automaticamente o tipo de negócio e customizando as respostas.

---

## 📥 3 FORMAS DE TREINAMENTO

### 1️⃣ **TREINAMENTO POR TEXTO**
Adicionar exemplos de conversas, descrições e conteúdo de negócio.

**Endpoint**:
```
POST /training/:businessId/text
{
  "content": "Somos uma agência de marketing digital especializada em redes sociais...",
  "businessType": "agencia_marketing",
  "metadata": { "source": "website", "language": "pt-BR" }
}
```

**Processamento**:
- ✅ Validação de qualidade (mínimo 50 caracteres)
- ✅ Extração de 20 keywords principais
- ✅ Análise de estrutura do texto
- ✅ Detecção de idioma
- ✅ Cálculo de score de qualidade (0-100)

**Resposta**:
```json
{
  "id": "train_abc123",
  "inputType": "text",
  "businessType": "agencia_marketing",
  "keywords": [
    { "keyword": "marketing", "frequency": 45 },
    { "keyword": "digital", "frequency": 38 },
    { "keyword": "redes", "frequency": 32 }
  ],
  "quality": 0.92,
  "validation": { "isValid": true, "score": 92 }
}
```

---

### 2️⃣ **TREINAMENTO POR VOZ**
Registrar áudio de explicações sobre o negócio e estilo de comunicação.

**Endpoint**:
```
POST /training/:businessId/voice
{
  "audioBase64": "SUQzBAAAAAAAI1...",
  "businessType": "consultoria",
  "language": "pt-BR"
}
```

**Processamento**:
- ✅ Transcrição automática (Speech-to-Text)
- ✅ Extração de características de voz:
  - Nível de formalidade (0-100)
  - Sentimento (positive, neutral, negative)
  - Nível técnico (high, medium, low)
  - Tom emocional (energetic, calm, neutral)
- ✅ Extração de keywords
- ✅ Análise de tom e estilo

**Resposta**:
```json
{
  "id": "train_voice123",
  "inputType": "voice",
  "transcription": "Somos uma consultoria de transformação digital...",
  "audioFeatures": {
    "formality": 75,
    "sentiment": "positive",
    "technicalLevel": "high",
    "emotionalTone": "professional"
  },
  "quality": 0.85
}
```

---

### 3️⃣ **TREINAMENTO POR ARQUIVO**
Upload de documentos (PDF, DOCX, TXT) com conteúdo de negócio.

**Endpoint**:
```
POST /training/:businessId/file
{
  "fileUrl": "https://storage.example.com/training/proposta.pdf",
  "fileName": "proposta.pdf",
  "businessType": "consultoria"
}
```

**Processamento**:
- ✅ Extração de texto do arquivo
- ✅ Segmentação em parágrafos
- ✅ Extração de keywords por seção
- ✅ Validação de qualidade
- ✅ Armazenamento para reuso

**Tipos de Arquivo Suportados**:
- 📄 PDF (formulários, propostas, cases)
- 📝 DOCX (documentos Word)
- 📋 TXT (texto puro)
- 📊 CSV (dados estruturados)

---

## 🎯 IDENTIFICAÇÃO AUTOMÁTICA DE TIPO DE NEGÓCIO

### Como Funciona

O sistema analisa o conteúdo de treinamento e **detecta automaticamente** o tipo de negócio:

**Endpoint**:
```
POST /training/:businessId/identify
{
  "content": "Vendemos produtos eletrônicos online com frete grátis...",
  "inputType": "text"
}
```

**Tipos Detectados**:

| Tipo | Detectado Por | Keywords |
|------|---------------|----------|
| **consultoria** | Palavras-chave | estratégia, gestão, processo, solução, cliente |
| **ecommerce** | Palavras-chave | loja, venda, produto, carrinho, desconto |
| **agencia_marketing** | Palavras-chave | marketing, publicidade, campanha, branding |
| **saas** | Palavras-chave | software, plataforma, api, nuvem, integração |
| **educacao** | Palavras-chave | curso, ensino, aluno, professor, certificado |
| **saude** | Palavras-chave | médico, clínica, paciente, consulta, diagnóstico |
| **fitness** | Palavras-chave | academia, treino, exercício, nutrição, saúde |
| **restaurante** | Palavras-chave | comida, cozinha, cardápio, prato, reserva |
| **imobiliario** | Palavras-chave | imóvel, propriedade, casa, venda, aluguel |
| **servicos** | Palavras-chave | serviço, contrato, profissional, atendimento |
| **varejo** | Palavras-chave | loja, comércio, cliente, estoque, promoção |

**Resposta**:
```json
{
  "businessId": "b_123",
  "detection": {
    "detectedType": "ecommerce",
    "confidence": 95,
    "alternatives": [
      { "type": "varejo", "confidence": 60 },
      { "type": "saas", "confidence": 25 }
    ],
    "reasoning": "Detectado como 'ecommerce' baseado nas palavras-chave: loja, venda, produto"
  },
  "hints": {
    "description": "Comércio eletrônico e vendas online",
    "commonGoals": ["Aumentar conversões", "Reduzir carrinho abandonado"],
    "bestPractices": ["Mostrar produtos", "Oferecer promoções"],
    "suggestedAutomations": ["Recomendação de produtos", "Recuperação de carrinho"]
  }
}
```

---

## 🏆 DICAS E HINTS POR TIPO DE NEGÓCIO

Cada tipo de negócio tem recomendações específicas:

### Consultoria
- **Objetivo**: Aumentar clientes, demonstrar expertise
- **Melhores práticas**: Compartilhar casos de sucesso, publicar insights
- **Automações sugeridas**: Responder perguntas técnicas, qualificar leads

### E-commerce
- **Objetivo**: Aumentar conversões, reduzir abandono de carrinho
- **Melhores práticas**: Mostrar produtos, oferecer promoções
- **Automações sugeridas**: Recomendação de produtos, recuperação de carrinho

### Agência de Marketing
- **Objetivo**: Conquistar clientes, demonstrar resultados
- **Melhores práticas**: Mostrar cases, compartilhar trends
- **Automações sugeridas**: Gerar conteúdo, qualificar leads

### SaaS
- **Objetivo**: Adquirir usuários, aumentar retenção
- **Melhores práticas**: Compartilhar tutoriais, mostrar features
- **Automações sugeridas**: Onboarding automático, suporte técnico

### Educação
- **Objetivo**: Atrair alunos, aumentar engajamento
- **Melhores práticas**: Compartilhar conhecimento, oferecer prévia
- **Automações sugeridas**: Responder dúvidas, agendamento de aulas

### Saúde
- **Objetivo**: Agendar consultas, aumentar pacientes
- **Melhores práticas**: Compartilhar dicas, testimoniais de pacientes
- **Automações sugeridas**: Agendamento, lembretes, respostas a perguntas

### Fitness
- **Objetivo**: Aumentar membros, motivar alunos
- **Melhores práticas**: Compartilhar resultados, desafios
- **Automações sugeridas**: Agendamento de aulas, programas personalizados

### Restaurante
- **Objetivo**: Aumentar reservas, atrair clientes
- **Melhores práticas**: Fotos de pratos, avaliações
- **Automações sugeridas**: Agendamento de mesas, sugestões de pratos

### Imobiliário
- **Objetivo**: Vender propriedades, gerar leads
- **Melhores práticas**: Fotos/vídeos de imóveis, localização
- **Automações sugeridas**: Agendamento de visitas, qualificação

---

## 📊 STATUS E INSIGHTS DO TREINAMENTO

### Status do Treinamento
**Endpoint**:
```
GET /training/:businessId/status
```

**Resposta**:
```json
{
  "businessId": "b_123",
  "trainingInputs": {
    "text": 12,
    "voice": 5,
    "file": 3,
    "total": 20
  },
  "businessType": "agencia_marketing",
  "trainingScore": 87.5,
  "keywords": [
    { "keyword": "marketing", "frequency": 45 },
    { "keyword": "social", "frequency": 38 },
    { "keyword": "conteúdo", "frequency": 32 }
  ],
  "tone": {
    "formal": 35,
    "friendly": 50,
    "technical": 10,
    "casual": 5
  },
  "readiness": "READY",
  "recommendations": [
    "Adicione mais exemplos de conversas com clientes",
    "Inclua casos de sucesso",
    "Treine com mais perguntas frequentes"
  ]
}
```

### Insights do Treinamento
**Endpoint**:
```
GET /training/:businessId/insights
```

**Resposta**:
```json
{
  "businessId": "b_123",
  "insights": {
    "mostUsedKeywords": ["marketing", "social media", "conteúdo"],
    "recommendedTopics": [
      "Gestão de redes sociais",
      "Criação de conteúdo viral",
      "Estratégia de hashtags"
    ],
    "trainingGaps": [
      "Faltam exemplos de atendimento ao cliente",
      "Poucos dados sobre follow-up automático"
    ],
    "improvementPotential": 92
  },
  "nextSteps": [
    "Adicione 5-10 conversas reais",
    "Grave exemplos de tom de voz",
    "Compartilhe seus 3 melhores cases"
  ]
}
```

---

## 🤖 GERAÇÃO DE RESPOSTAS COM TREINAMENTO

A IA utiliza todo o treinamento para gerar respostas customizadas:

**Endpoint**:
```
POST /training/:businessId/generate-response
{
  "message": "Vocês fazem marketing para startups?",
  "trainingDataIds": ["train_001", "train_005"]
}
```

**Resposta**:
```json
{
  "businessId": "b_123",
  "originalMessage": "Vocês fazem marketing para startups?",
  "generatedResponse": "Sim! Somos especializados em marketing para startups de tecnologia. Temos cases de sucesso com empresas como XYZ...",
  "trainingDataUsed": ["train_001", "train_005"],
  "confidenceScore": 0.92,
  "qualityRating": "high",
  "suggestions": [
    "Resposta otimizada com base em 12 inputs de treinamento",
    "Tom: Friendly e Profissional",
    "Especialidade: Marketing Digital"
  ]
}
```

---

## 🔄 FLUXO COMPLETO DE TREINAMENTO

```
1. ADICIONAR TREINAMENTO
   ↓
   [Texto, Voz ou Arquivo]
   ↓
   Processamento
   ↓

2. IDENTIFICAR TIPO DE NEGÓCIO
   ↓
   [Análise automática]
   ↓
   Definir recomendações específicas
   ↓

3. EXTRAIR INFORMAÇÕES
   ↓
   [Keywords, Tone, Formality, etc]
   ↓
   Armazenar para reuso
   ↓

4. USAR NO TREINAMENTO
   ↓
   [IA gera respostas customizadas]
   ↓
   Aplicar tom e estilo específico
   ↓

5. MELHORAR CONTINUAMENTE
   ↓
   [Feedback de respostas]
   ↓
   Ajustar e refinar
```

---

## 📈 ESCALAS DE QUALIDADE

### Score de Qualidade do Treinamento

```
90-100: EXCELENTE
  - Conteúdo completo e bem estruturado
  - Keywords bem distribuídas
  - Sem erros gramaticais

70-90: BOM
  - Conteúdo adequado
  - Keywords relevantes
  - Poucas questões de qualidade

50-70: ACEITÁVEL
  - Conteúdo básico
  - Keywords limitadas
  - Potencial para melhoria

0-50: INSUFICIENTE
  - Conteúdo muito curto
  - Palavras muito repetitivas
  - Precisa revisar
```

---

## 🔐 PRIVACIDADE E SEGURANÇA

- ✅ Dados de treinamento armazenados apenas para o negócio específico
- ✅ Criptografia de dados em repouso
- ✅ Sem compartilhamento entre negócios
- ✅ Direito de exclusão (LGPD/GDPR)
- ✅ Auditoria de acesso

---

## 🚀 CASOS DE USO

### Caso 1: Agência de Marketing
```
1. CEO grava vídeo explicando serviços (VOZ)
2. Sistema detecta: agencia_marketing
3. IA customizada responde sobre cases
4. Mensagens automáticas com estilo da agência
```

### Caso 2: E-commerce
```
1. Dono carrega descrição de produtos (ARQUIVO)
2. Adiciona exemplos de atendimento (TEXTO)
3. Sistema detecta: ecommerce
4. IA recomenda produtos conforme conver são
```

### Caso 3: Consultoria
```
1. Consultor treina com propostas (ARQUIVO)
2. Grava explicação de metodologia (VOZ)
3. Sistema detecta: consultoria
4. IA qualifica leads com conhecimento específico
```

---

## 📋 CHECKLIST DE TREINAMENTO

Para cada negócio, o ideal é:

- [ ] Adicionar 5-10 exemplos de TEXTO
- [ ] Gravar 2-3 mensagens de VOZ
- [ ] Fazer upload de 2-3 ARQUIVOS importantes
- [ ] Verificar se tipo de negócio foi identificado corretamente
- [ ] Revisar keywords extraídas
- [ ] Testar respostas geradas pela IA
- [ ] Adicionar feedback para melhorar
- [ ] Atingir score de treinamento > 85%

---

## 🎓 TRAINING SCORE LEVELS

```
85-100: PRODUCTION READY ✅
  - IA pronta para usar
  - Respostas precisas
  - Tom e estilo consistente

70-85: GOOD (RECOMENDADO) 
  - IA funcional
  - Algumas respostas genéricas
  - Recomenda adicionar mais treinamento

50-70: DEVELOPING (EM DESENVOLVIMENTO)
  - IA com potencial
  - Respostas imprecisas
  - Precisa muito mais treinamento

0-50: INSUFFICIENT (INSUFICIENTE)
  - IA não configurada
  - Usar respostas padrão
  - Iniciar processo de treinamento
```

---

**Módulo Completo e Pronto para Usar! 🎉**
