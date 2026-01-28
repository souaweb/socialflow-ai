# 🚀 Guia de Setup do Backend

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- PostgreSQL 14+
- MongoDB 6+
- Redis 7+
- Docker (opcional)

## Instalação Rápida

### 1️⃣ Instalar Dependências

```bash
cd backend
npm install
```

### 2️⃣ Configurar Banco de Dados

#### PostgreSQL (Recomendado)
```sql
-- Criar banco de dados
CREATE DATABASE socialflow;
CREATE USER socialflow WITH PASSWORD 'senha123';
GRANT ALL PRIVILEGES ON DATABASE socialflow TO socialflow;

-- Criar tabelas (executar schema.sql ou usar TypeORM auto-sync)
```

#### MongoDB
```bash
# Instalar localmente ou usar MongoDB Atlas
# MongoDB URL: mongodb://localhost:27017/socialflow
```

#### Redis
```bash
# Instalar localmente
redis-server

# Ou usar Redis Cloud
# Redis URL: redis://localhost:6379
```

### 3️⃣ Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env.local

# Editar com suas credenciais
nano .env.local
```

### 4️⃣ Iniciar o Servidor

```bash
# Desenvolvimento (com hot reload)
npm run dev

# Produção
npm run build && npm start

# Teste
npm test
```

Servidor disponível em: `http://localhost:3000`

## Setup com Docker

```bash
# Build da imagem
docker build -t socialflow-backend .

# Rodar com docker-compose
docker-compose up

# Parar
docker-compose down
```

## Configurar Webhooks das Plataformas

### Meta (Facebook/Instagram/WhatsApp)

1. Ir em: https://developers.facebook.com/apps
2. Selecionar seu app
3. Em **Products**, adicionar "Webhooks"
4. Configurar:
   - **Callback URL**: `https://seu_dominio.com/webhooks/meta`
   - **Verify Token**: Valor de `META_VERIFY_TOKEN` no .env
   - **Subscribe to**: 
     - messages (para DMs)
     - feed (para posts)
     - comments (para comentários)

### TikTok

1. Ir em: https://business-api.tiktok.com
2. Em **Webhooks**, adicionar:
   - **Webhook URL**: `https://seu_dominio.com/webhooks/tiktok`
   - **Eventos**: video.create, video.publish

### YouTube

1. Ir em: https://console.cloud.google.com
2. Ativar YouTube Data API v3
3. Configurar OAuth 2.0
4. Para comentários, usar webhooks de activity updates

## Estrutura de Pastas

```
backend/
├── src/
│   ├── main.ts                 # Entry point
│   ├── app.module.ts          # Root module
│   └── modules/
│       ├── auth/              # Autenticação
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── entities/
│       │   ├── dtos/
│       │   ├── strategies/
│       │   └── guards/
│       ├── platforms/         # Integração com plataformas
│       │   ├── platforms.controller.ts
│       │   ├── platforms.service.ts
│       │   └── services/
│       │       ├── meta.service.ts
│       │       ├── tiktok.service.ts
│       │       ├── youtube.service.ts
│       │       └── whatsapp.service.ts
│       ├── conversations/     # Gerenciamento de conversas
│       ├── posts/            # Criação e publicação de posts
│       ├── crm/              # CRM e leads
│       ├── ai/               # IA conversacional
│       ├── automations/      # Rules engine
│       └── webhooks/         # Recebimento de eventos
├── test/
├── dist/                      # Build compilado
├── .env.local                 # Variáveis locais
├── tsconfig.json
├── package.json
├── Dockerfile
├── docker-compose.yml
├── ARCHITECTURE.md            # Documentação arquitetura
├── DATABASES.md               # Schema dos bancos
└── README.md                  # Este arquivo
```

## Endpoints Principais

### Autenticação
```
POST   /auth/register          # Registrar novo usuário
POST   /auth/login             # Login com email/senha
GET    /auth/oauth/meta/url    # Iniciar OAuth com Meta
GET    /auth/oauth/meta/callback   # Callback de Meta
GET    /auth/me                # Usuário atual
POST   /auth/logout            # Logout
```

### Plataformas
```
GET    /platforms              # Contas conectadas
POST   /platforms/disconnect/:id  # Desconectar conta
```

### Conversas
```
GET    /conversations          # Listar conversas
GET    /conversations/:id/messages  # Mensagens da conversa
POST   /conversations/:id/messages  # Enviar mensagem
POST   /conversations/sync     # Sincronizar com plataformas
```

### Posts
```
POST   /posts                  # Criar post
POST   /posts/:id/schedule     # Agendar publicação
POST   /posts/:id/publish      # Publicar agora
POST   /posts/:id/replicate    # Replicar em múltiplas contas
GET    /posts/:id/stats        # Estatísticas
```

### CRM
```
GET    /crm/leads              # Listar leads
POST   /crm/leads              # Criar lead
PUT    /crm/leads/:id          # Atualizar lead
POST   /crm/leads/:id/tags     # Adicionar tags
POST   /crm/leads/:id/followup # Agendar follow-up
GET    /crm/leads/:id/score    # Score do lead
```

### IA
```
POST   /ai/analyze             # Analisar mensagem
POST   /ai/generate-response   # Gerar resposta
POST   /ai/purchase-intent     # Detectar intenção
POST   /ai/extract-facts       # Extrair fatos
POST   /ai/generate-hashtags   # Gerar hashtags
```

### Automações
```
GET    /automations            # Listar regras
POST   /automations            # Criar regra
PUT    /automations/:id        # Atualizar regra
DELETE /automations/:id        # Deletar regra
POST   /automations/:id/trigger # Executar regra
```

### Webhooks
```
POST   /webhooks/meta          # Webhook da Meta
POST   /webhooks/tiktok        # Webhook do TikTok
POST   /webhooks/youtube       # Webhook do YouTube
```

## Debugging

### Ver logs em tempo real
```bash
npm run dev  # Todos os logs aparecem no console
```

### Database
```bash
# PostgreSQL
psql -U socialflow -d socialflow

# MongoDB
mongo mongodb://localhost:27017/socialflow

# Redis
redis-cli
```

### Testar Endpoints
```bash
# Instalar RestClient ou Postman
# Importar collection em: ./postman_collection.json
```

## Troubleshooting

### Erro: "Cannot find module '@nestjs/common'"
```bash
npm install
```

### Erro: "Connection refused: 5432"
```bash
# PostgreSQL não está rodando
docker run -d -e POSTGRES_PASSWORD=senha123 -p 5432:5432 postgres:14
```

### Erro: "ECONNREFUSED 127.0.0.1:6379"
```bash
# Redis não está rodando
redis-server  # ou docker run -d -p 6379:6379 redis:7
```

## Próximos Passos

1. ✅ Setup básico completo
2. ⏳ Completar implementação dos serviços
3. ⏳ Testes unitários
4. ⏳ Deploy para staging
5. ⏳ Deploy para produção

## Support

Para dúvidas ou problemas:
1. Verificar logs: `npm run dev`
2. Verificar variáveis .env.local
3. Verificar conexão com bancos de dados
4. Consultar ARCHITECTURE.md

---

Feito com ❤️ para automatizar redes sociais eticamente.
