# ⚖️ Compliance, Segurança e Boas Práticas

## O que É PERMITIDO (Com APIs Oficiais) ✅

### Meta (Instagram/Facebook/WhatsApp)
- ✅ Responder comentários em posts
- ✅ Responder mensagens diretas (DMs) em contas Business
- ✅ Enviar mensagens com templates aprovados (WhatsApp)
- ✅ Publicar posts e stories (com restrições)
- ✅ Obter analytics e dados de engajamento
- ✅ Moderar comentários (aprovar/rejeitar)
- ✅ Listar e gerenciar seguidores/amigos

### WhatsApp Business API
- ✅ Responder mensagens (dentro de 24h da conversa ativa)
- ✅ Enviar mensagens com templates aprovados
- ✅ Usar IA para responder automaticamente
- ✅ Criar fluxos de conversação (menus)
- ✅ Armazenar contatos e histórico
- ✅ Integrar com CRM e banco de dados

### TikTok
- ✅ Postar vídeos (com restrições)
- ✅ Obter comentários (muito limitado)
- ✅ Ver analytics básicos
- ✅ Gerenciar campanhas publicitárias

### YouTube
- ✅ Responder comentários
- ✅ Moderar comentários
- ✅ Postar e atualizar vídeos
- ✅ Obter analytics detalhados
- ✅ Gerenciar comunidade

## O que É PROIBIDO (Risco de Ban/Bloqueio) ❌

### Qualquer Plataforma
- ❌ **Bots que fingem ser humanos**: Usar automação que oculta sua natureza
- ❌ **Spam**: Enviar mensagens repetidas ou em massa
- ❌ **Scraping**: Extrair dados sem permissão da API
- ❌ **API não oficial**: Usar endpoints secretos ou reverse-engineering
- ❌ **Automação agressiva**: Likes/follows automáticos em massa
- ❌ **Clickbait**: Enganar usuários para interagir
- ❌ **Conteúdo violento/odioso**: Publicar conteúdo ilegal

### Instagram Específico
- ❌ Responder stories automaticamente (sem API)
- ❌ Enviar DMs não solicitadas (sem interação prévia)
- ❌ Fazer like automático em fotos
- ❌ Seguir/deixar de seguir em massa
- ❌ Usar hashtags irrelevantes (spam)
- ❌ Automação que viola "humanidade" da plataforma

### TikTok
- ❌ Postar conteúdo duplicado excessivamente
- ❌ Engajamento artificial (likes de bot)
- ❌ Violar direitos autorais (música/vídeo)
- ❌ Spam de comentários automáticos

### YouTube
- ❌ Inundar comentários em massa
- ❌ Conteúdo enganoso ou manipulador
- ❌ Violar direitos autorais

## LGPD (Lei Geral de Proteção de Dados) - Brasil 🇧🇷

### Obrigações
1. **Consentimento Explícito**
   - Usuário deve consentir coleta de dados
   - Deve ser informado sobre uso de IA
   - Deve poder revogar acesso

2. **Privacidade**
   - Dados criptografados em trânsito (HTTPS)
   - Dados criptografados em repouso
   - Backup com segurança

3. **Direito ao Esquecimento**
   - Deletar dados do usuário sob solicitação
   - Remover de automações
   - Limpar histórico

4. **Notificação de Vazamento**
   - Informar usuários se dados forem vazados
   - Informar em até 2 dias úteis

5. **Logs de Auditoria**
   - Registrar todas as automações realizadas
   - Manter por 90 dias mínimo
   - Permitir exportação

### Implementação no SocialFlow

```typescript
// backend/src/modules/compliance/compliance.service.ts

@Injectable()
export class ComplianceService {
  /**
   * Registrar consentimento do usuário
   */
  async recordConsent(userId: string, consent: any) {
    return this.consentRepository.save({
      user_id: userId,
      data_processing: consent.dataProcessing,
      ai_analysis: consent.aiAnalysis,
      marketing: consent.marketing,
      recorded_at: new Date(),
      ip_address: consent.ipAddress, // Para verificação
    });
  }

  /**
   * Deletar todos os dados do usuário (LGPD)
   */
  async deleteUserData(userId: string) {
    // 1. Deletar posts
    // 2. Deletar conversas
    // 3. Deletar leads
    // 4. Deletar logs
    // 5. Deletar tokens
    // Manter apenas consentimento por razões legais
  }

  /**
   * Exportar dados do usuário
   */
  async exportUserData(userId: string) {
    return {
      user: await this.getUserData(userId),
      posts: await this.getPostsData(userId),
      conversations: await this.getConversationsData(userId),
      leads: await this.getLeadsData(userId),
      automations: await this.getAutomationsData(userId),
      exported_at: new Date(),
    };
  }

  /**
   * Registrar automação realizada (auditoria)
   */
  async logAutomation(automation: any) {
    return this.auditRepository.create({
      user_id: automation.userId,
      action: 'automated_response',
      platform: automation.platform,
      target: automation.targetUser,
      message: automation.message,
      rules_applied: automation.rulesApplied,
      ai_generated: automation.aiGenerated,
      timestamp: new Date(),
    });
  }
}
```

## GDPR (UE) 🇪🇺

Semelhante à LGPD, com requisitos adicionais:
- Direito a portabilidade de dados
- Right to be forgotten (direito ao esquecimento)
- Data Processing Agreements (DPA)
- Privacy by Design

## Termos de Serviço do SocialFlow

```
1. Usuário concorda usar apenas para automação ÉTICA
2. Proibido: Spam, engano, conteúdo ilegal
3. SocialFlow não responsável por bans de plataforms
4. Usuário é responsável por conformidade com ToS das redes
5. Dados deletados conforme LGPD/GDPR
6. Logs mantidos por 90 dias
7. Qualquer violação resultará em suspensão
```

## Checklist de Conformidade Antes de Deploy

### Segurança
- [ ] Todos os dados criptografados (em trânsito e repouso)
- [ ] HTTPS obrigatório em produção
- [ ] JWT com expiração curta (máx 7 dias)
- [ ] Refresh tokens armazenados com hash
- [ ] Rate limiting implementado
- [ ] CORS restrito a domínios autorizados

### LGPD/GDPR
- [ ] Página de Privacidade publicada
- [ ] Termo de Consentimento para IA
- [ ] Formulário de Exportação de Dados
- [ ] Formulário de Deletar Conta
- [ ] Logs de auditoria completos
- [ ] Política de Retenção definida

### Compliance com Plataformas
- [ ] App aprovado por Meta (se usar Instagram/WhatsApp)
- [ ] Webhook validation implementado
- [ ] Rate limits respeitados
- [ ] Documentação clara sobre automação

### Monitoramento
- [ ] Dashboard de detectar abuso
- [ ] Alertas para padrão suspeito
- [ ] Testes regulares de segurança
- [ ] Backups automáticos

## Exemplos de Automação ÉTICA vs Antiética

### ✅ ÉTICO - Atender Vendas Automático
```
Cliente: "Qual o preço?"
Bot (com IA): "Ótimo! Temos 3 planos:
- Starter: R$299/mês
- Pro: R$599/mês
- Enterprise: Sob demanda

Qual combina com você?"

Resultado: Lead qualificado, vendedor humano faz follow-up
```

### ❌ ANTIÉTICO - Spam de Bots
```
Bot envia 1000 mensagens idênticas:
"Ganhe dinheiro rápido! Clique aqui: bit.ly/scam"

Resultado: Ban permanente, reputação destruída
```

### ✅ ÉTICO - Responder Comentários Relevantes
```
Post: "Como usar [seu produto]?"
Bot (com IA): "Ótimo pergunta! Aqui está um link para tutorial: [link]"

Resultado: Ajuda real, melhora engajamento
```

### ❌ ANTIÉTICO - Fake Engagement
```
Bot faz 10mil likes automáticos em posts aleatórios
para ganhar seguidores

Resultado: Perfil suspeito, algorítmo penaliza
```

## Monitoramento e Alertas

```typescript
// Detectar padrão suspeito
async detectAbusePattern(userId: string) {
  const last24h = await this.getUserAutomations(userId, 24);
  
  const alerts = [];
  
  // Muitos comentários idênticos = spam
  if (this.hasDuplicateMessages(last24h, 0.8)) {
    alerts.push('🚨 Possível spam: muitos mensagens idênticas');
  }
  
  // Muitas respostas em pouco tempo = bot
  if (this.isUnhumanPace(last24h)) {
    alerts.push('🚨 Padrão não-humano: respostas muito rápidas');
  }
  
  // Muitos usuários diferentes em pouco tempo
  if (this.isMassTarget(last24h)) {
    alerts.push('🚨 Possível automação agressiva: muitos alvos');
  }
  
  if (alerts.length > 0) {
    await this.notifyUser(userId, alerts);
    await this.pauseAutomations(userId);
  }
}
```

## Template de Aviso ao Usuário

```
⚠️ AVISO DE CONFORMIDADE

Você está usando automação em [PLATAFORMA]. 

RESTRIÇÕES IMPORTANTES:
1. Não use para spam ou engano
2. Respeite ToS da plataforma
3. Use IA para melhorar experiência, não enganar
4. Não tente ocultar automação

Suas automações são registradas em logs por razões legais.
Qualquer violação resultará em suspensão da conta.

Concordo e entendo os riscos ✓
```

## Suporte Legal

Para dúvidas sobre conformidade:
1. Consultar termos de serviço das plataformas
2. Consultar LGPD (se Brasil)
3. Consultar GDPR (se UE)
4. Consultar advogado especializado

---

**Lembre-se:** É SEMPRE melhor ser ético do que arriscar ban/bloqueio permanente!
