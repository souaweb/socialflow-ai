# 🔗 Integração Frontend + Backend

## Arquitetura Atual

```
FRONTEND (React/Vite)
    ↓
API Service (apiService.ts)
    ↓
BACKEND (NestJS)
    ↓
APIs Oficiais (Meta, TikTok, YouTube)
```

## Setup para Desenvolvimento

### 1️⃣ Iniciar Backend

```bash
cd backend
npm install
npm run dev

# Backend rodará em: http://localhost:3000
```

### 2️⃣ Iniciar Frontend

```bash
npm run dev

# Frontend rodará em: http://localhost:5173
```

### 3️⃣ Verificar Integração

Na console do navegador:
```javascript
// Testar conexão
fetch('http://localhost:3000/auth/me')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

## Migração de Features do Frontend para Backend

### Antes (localStorage):
```tsx
const user = dbService.getCurrentUser(); // localStorage
const businesses = dbService.getBusinesses(); // localStorage
```

### Depois (API):
```tsx
const user = await apiService.getCurrentUser(); // API Backend
const accounts = await apiService.getConnectedPlatforms(); // API Backend
```

## Features por Status

### ✅ Implementado (Frontend)
- Login básico
- Test users (3 tipos)
- Dashboard com stats
- Conexão de contas (UI)
- Visualização de conversas
- Criação de posts
- CRM básico

### 🔄 Em Transição
- Autenticação → Backend (OAuth2 + JWT)
- Armazenamento de dados → Backend (PostgreSQL)
- Operações de plataforma → Backend (APIs oficiais)

### ⏳ A Implementar
- Webhooks em tempo real
- Automações completas
- IA conversacional
- Analytics avançado
- Integração com Stripe (pagamento)

## Exemplo: Responder Comentário

### Frontend
```tsx
// components/Omnichat.tsx
const sendReply = async (commentId: string, message: string) => {
  try {
    const response = await apiService.sendMessage(
      commentId,
      message,
      'instagram'
    );
    console.log('✅ Resposta enviada:', response);
  } catch (error) {
    console.error('❌ Erro:', error);
  }
};
```

### Backend
```typescript
// platforms/services/meta.service.ts
async replyToComment(
  commentId: string,
  message: string,
  accessToken: string,
) {
  // Conecta na API do Instagram
  const response = await axios.post(
    `${this.BASE_URL}/${commentId}/replies`,
    { message },
    { params: { access_token: accessToken } }
  );
  return response.data;
}
```

### Fluxo Completo
1. Usuário digita resposta no Frontend
2. Frontend chama `apiService.sendMessage()`
3. Backend recebe em `conversations.controller.ts`
4. Backend chama `metaService.replyToComment()`
5. Instagram recebe e publica
6. Webhook do Instagram notifica Backend
7. Frontend sincroniza em tempo real (WebSocket)

## Variáveis de Ambiente Necessárias

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=SocialFlow AI
```

### Backend (.env.local)
```env
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# Databases
DATABASE_URL=postgresql://...
MONGODB_URI=mongodb://...
REDIS_HOST=localhost

# APIs
META_APP_ID=seu_id
GEMINI_API_KEY=sua_chave
```

## Fluxo de Automação Completo

```
1. Evento da Plataforma (ex: novo comentário)
   ↓
2. Webhook recebe em /webhooks/meta
   ↓
3. Backend valida assinatura
   ↓
4. Enfileira processamento (Bull)
   ↓
5. Worker processa:
   - Busca regra de automação
   - Chama IA para gerar resposta
   - Atualiza CRM com lead score
   ↓
6. Envia resposta via API da plataforma
   ↓
7. Frontend recebe via WebSocket
   ↓
8. Dashboard atualiza em tempo real
```

## Testes

### 1️⃣ Teste Manual

```bash
# Terminal 1: Backend
cd backend && npm run dev

# Terminal 2: Frontend
npm run dev

# Terminal 3: Testar API
curl -X GET http://localhost:3000/auth/me \
  -H "Authorization: Bearer seu_token_aqui"
```

### 2️⃣ Teste com Postman

1. Importar collection em `/backend/postman_collection.json`
2. Configurar Bearer Token
3. Testar endpoints

### 3️⃣ Teste de Webhook

```bash
# Simular webhook da Meta (testar localmente com ngrok)
ngrok http 3000

# Depois configurar em Meta:
# Callback URL: https://seu_ngrok_url.ngrok.io/webhooks/meta
```

## Debugging

### Ver requisições HTTP
```typescript
// Adicionar em apiService.ts
this.api.interceptors.request.use((config) => {
  console.log('📤 Request:', config.method.toUpperCase(), config.url);
  return config;
});

this.api.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.status, response.data);
    return response;
  }
);
```

### Ver logs do Backend
```bash
# Terminal com npm run dev mostra todos os logs
[12:00:00] LOG [NestFactory] Starting Nest application...
[12:00:01] LOG [InstanceLoader] MetaService dependencies initialized
[12:00:02] LOG [RoutesResolver] AppController {/api}:
```

### Verificar Banco de Dados
```bash
# PostgreSQL
psql -U socialflow -d socialflow
SELECT * FROM users;

# MongoDB
mongo
use socialflow
db.ai_interactions.find()

# Redis
redis-cli
KEYS *
GET user:123:token
```

## Próximos Passos

1. ✅ Backend estruturado
2. ⏳ Implementar autenticação real com OAuth2
3. ⏳ Conectar frontend ao backend
4. ⏳ Implementar webhooks em tempo real
5. ⏳ Deploy para produção

## Performance

### Cacheing
```typescript
// Backend cacheia resultados em Redis
const cachedLeads = await redis.get(`leads:${userId}`);
if (cachedLeads) return JSON.parse(cachedLeads);

// Fazer query...
await redis.setex(`leads:${userId}`, 3600, JSON.stringify(leads));
```

### Fila de Processamento
```typescript
// Operações pesadas vão para fila
@InjectQueue('posts')
private postQueue: Queue;

async publishPost(postId: string) {
  // Enfileira para processar em background
  await this.postQueue.add('publish', { postId }, {
    delay: 1000 * 60, // 1 minuto depois
    attempts: 3,
    backoff: { type: 'exponential', delay: 2000 }
  });
}
```

## Segurança

### CORS
```typescript
// Backend aceita requisições apenas do frontend
app.enableCors({
  origin: 'http://localhost:5173',
  credentials: true
});
```

### Autenticação
```typescript
// Frontend envia token em cada requisição
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Validação
```typescript
// Backend valida entrada antes de processar
@Body() createPostDto: CreatePostDto
// Valida automaticamente com @IsString(), @IsNotEmpty(), etc
```

---

Perguntas? Consulte ARCHITECTURE.md para mais detalhes.
