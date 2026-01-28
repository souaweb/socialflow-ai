# 🏗️ Arquitetura do SocialFlow AI

## Visão Geral

```
┌─────────────────────────────────────────────────────────────┐
│                    PWA Frontend (React)                      │
│            Dashboard • Composer • Inbox • CRM                 │
└────────────────────────────┬────────────────────────────────┘
                             │
                   ┌─────────┴─────────┐
                   │                   │
          ┌────────▼────────┐  ┌───────▼────────┐
          │  REST API       │  │   WebSocket    │
          │  (HTTP)         │  │   (Real-time)  │
          └────────┬────────┘  └───────┬────────┘
                   │                   │
          ┌────────▼──────────────────▼────────┐
          │   SocialFlow Backend (NestJS)      │
          │  ├─ Auth (OAuth2 + JWT)            │
          │  ├─ Platforms (Meta, TikTok, YT)  │
          │  ├─ Conversations (Inbox)          │
          │  ├─ Posts (Composer + Scheduler)   │
          │  ├─ CRM (Leads + Scoring)          │
          │  ├─ AI (Responses + Analysis)      │
          │  ├─ Automations (Rules Engine)     │
          │  ├─ Webhooks (Platform Events)     │
          │  └─ Queue (Bull + Redis)           │
          └────────┬──────────────────────────┘
                   │
        ┌──────────┼──────────┐
        │          │          │
   ┌────▼───┐ ┌───▼────┐ ┌──▼──────┐
   │PostgreSQL│ MongoDB │ Redis    │
   │(Dados)  │ (Logs)  │ (Cache)  │
   └─────────┘ └────────┘ └─────────┘
        │
   ┌────▼──────────────────────────────────┐
   │  APIs Oficiais das Plataformas       │
   │  ├─ Meta Graph API                    │
   │  ├─ WhatsApp Business API             │
   │  ├─ TikTok Business API               │
   │  ├─ YouTube Data API                  │
   │  └─ Webhooks (receber eventos)        │
   └────────────────────────────────────────┘
```

## Fluxo de Automação

### 1️⃣ Evento Recebido (via Webhook)
```
Plataforma → Webhook Backend → Validar Assinatura → Enfileirar Processamento
```

### 2️⃣ Processamento Automático (via Queue)
```
Defilar Job → Analisar com IA → Classificar Lead → Buscar Regra de Automação
```

### 3️⃣ Execução da Ação
```
Gerar Resposta IA → Enviar via API Oficial → Sincronizar CRM → Registrar Log
```

## Tipos de Automação Suportados

### ✅ Permitido (APIs Oficiais)
- ✓ Responder comentários (Instagram, YouTube, Facebook)
- ✓ Responder DMs/Mensagens (Instagram DM, WhatsApp)
- ✓ Enviar mensagens com templates (WhatsApp)
- ✓ Publicar posts (Instagram, Facebook, TikTok, YouTube)
- ✓ Qualificar leads automaticamente
- ✓ Agendar follow-ups
- ✓ Replicar posts inteligentemente

### ❌ Não Permitido (Risco de Ban)
- ✗ Responder stories (Instagram não tem API)
- ✗ Enviar DM proativo sem template (WhatsApp)
- ✗ Automação que simula usuário humano
- ✗ Bots que escondem interação automática
- ✗ Spam ou mensagens agressivas

## Stack Tecnológico

### Backend
- **NestJS**: Framework Node.js escalável
- **TypeORM**: ORM para PostgreSQL
- **Mongoose**: ODM para MongoDB
- **Bull**: Processamento de filas
- **Passport**: Autenticação OAuth2
- **Axios**: Cliente HTTP

### Bancos de Dados
- **PostgreSQL**: Dados estruturados (usuários, contas, leads, posts)
- **MongoDB**: Logs, analytics, histórico de IA
- **Redis**: Cache, filas, sessões

### APIs das Plataformas
- **Meta Graph API**: Instagram, Facebook, WhatsApp
- **TikTok Business API**: TikTok (limitado)
- **YouTube Data API**: YouTube
- **Google Gemini**: IA conversacional

## Módulos Principais

### 📝 Auth Module
- Registro e login
- OAuth2 com Meta, TikTok, YouTube
- JWT authentication
- Permissões e roles

### 🔗 Platforms Module
- Conexão de contas (Instagram, Facebook, WhatsApp, TikTok, YouTube)
- Sincronização de dados
- Validação de tokens
- Renovação automática de refresh tokens

### 💬 Conversations Module
- Centralização de conversas
- Sincronização em tempo real
- Histórico de mensagens
- Tags e segmentação

### 📊 Posts Module
- Criação de posts
- Agendamento
- Replicação inteligente por plataforma
- Analytics e engajamento

### 👥 CRM Module
- Gerenciamento de leads
- Classificação (cold/warm/hot)
- Scoring automático
- Tags e segmentação
- Follow-ups agendados

### 🤖 AI Module
- Análise de intenção
- Geração de respostas
- Detecção de sentimento
- Extração de fatos
- Geração de hashtags

### ⚙️ Automations Module
- Rules engine
- Gatilhos (follow, like, comment, message)
- Ações (tag, responder, agendar)
- Condições customizadas

### 🔔 Webhooks Module
- Recebimento de eventos
- Validação de assinatura
- Enfileiramento de processamento
- Logs de auditoria

## Segurança e Compliance

### OAuth 2.0
- Tokens armazenados criptografados
- Refresh tokens automáticos
- Revogação de acesso

### LGPD/GDPR
- Logs de todas as automações
- Retenção de dados configurável
- Direito ao esquecimento

### Rate Limiting
- Por usuário
- Por plataforma
- Por tipo de ação

### Validação de Webhooks
- Assinatura criptografada
- Validação de timestamp
- Proteção contra replay attacks

## Escalabilidade

### Horizontal
- Múltiplas instâncias do backend
- Load balancing com nginx/haproxy
- Clustering de Redis

### Vertical
- Processamento de fila em background
- Cache de resultados
- Índices otimizados no banco

### Monitoramento
- Logs centralizados (ELK Stack)
- Métricas (Prometheus)
- Alertas (Grafana)

## Integração com IA

### Gemini/GPT como Vendedor Especialista
1. **Análise de Mensagem**: Qual é a intenção?
2. **Busca de Contexto**: Quem é o cliente? O que já conversou?
3. **Geração de Resposta**: Gerar response natural e vendedora
4. **Aplicar CTA**: Chamar para ação sutil
5. **Registrar Resultado**: Aprender com feedback

### Prompt Engineering
- Prompt específico por nicho/negócio
- Histórico de conversa como contexto
- Guidelines de tom de voz
- Gatilhos de venda incorporados

## Exemplo de Fluxo Completo

```
1. Cliente escreve no Instagram DM: "Quanto custa?"
   ↓
2. Webhook recebe evento
   ↓
3. Sistema enfileira processamento
   ↓
4. Analisa intenção: "hot" (está comprando!)
   ↓
5. Busca contexto do cliente (histórico)
   ↓
6. Gera resposta com IA:
   "Ótimo! Oferecemos 3 planos:
   - Starter: R$299/mês
   - Pro: R$599/mês
   - Enterprise: Sob demanda
   
   Qual combina mais com você? 🎯"
   ↓
7. Envia resposta via API do Instagram
   ↓
8. Registra lead como "warm/hot"
   ↓
9. Agenda follow-up em 24h se sem resposta
   ↓
10. Sincroniza no CRM
```

## Deploy e DevOps

### Staging
```bash
docker-compose up  # Local
npm install && npm run dev
```

### Produção
```bash
# Vercel ou Render.com (NestJS)
# Docker + Kubernetes
# PM2 + systemd
```

## Próximos Passos

1. ✅ Estrutura base criada
2. ⏳ Implementar OAuth2 real com Meta
3. ⏳ Integração com webhooks em tempo real
4. ⏳ IA conversacional completa
5. ⏳ Dashboard de analytics
6. ⏳ Deploy para produção
