# Checklist de Deployment Railway.app

## ✅ Pré-Requisitos
- [ ] Conta GitHub criada
- [ ] Repositório socialflow-ai criado
- [ ] Código feito push para GitHub (CONCLUÍDO)
- [ ] Conta Railway.app criada (https://railway.app)

## ✅ Configuração Automática
- [ ] Executar `railway-deploy.bat` (Windows) ou `railway-deploy.sh` (Mac/Linux)
- [ ] Verificar se build foi bem-sucedido
- [ ] Verificar se código foi pushed para GitHub

## ✅ Deployment no Railway.app

### Opção 1: Via Interface Web (Recomendado - 5 minutos)
1. [ ] Acesse https://railway.app/dashboard
2. [ ] Clique em "Create New Project"
3. [ ] Selecione "Deploy from GitHub"
4. [ ] Conecte sua conta GitHub
5. [ ] Selecione o repositório `socialflow-ai`
6. [ ] Railway detecta automaticamente:
   - [ ] Dockerfile
   - [ ] railway.json
   - [ ] package.json
7. [ ] Clique em "Deploy"
8. [ ] Aguarde o build completar (2-3 minutos)

### Opção 2: Via Railway CLI
```bash
# Instalar Railway CLI
npm install -g @railway/cli

# Fazer login
railway login

# Inicializar projeto
railway init

# Adicionar serviços
railway add postgresql
railway add mongodb  
railway add redis

# Fazer deploy
railway up
```

## ✅ Configurar Bancos de Dados

### PostgreSQL (Automático)
- [ ] Railway cria instância automaticamente
- [ ] Variáveis de ambiente preenchidas automaticamente:
  - DATABASE_HOST
  - DATABASE_PORT
  - DATABASE_USER
  - DATABASE_PASSWORD
  - DATABASE_NAME

### MongoDB (Automático)
- [ ] Railway cria instância automaticamente
- [ ] Variável MONGODB_URI preenchida automaticamente

### Redis (Automático)
- [ ] Railway cria instância automaticamente
- [ ] Variáveis preenchidas automaticamente:
  - REDIS_HOST
  - REDIS_PORT
  - REDIS_PASSWORD

## ✅ Configurar Variáveis de Ambiente

No dashboard do Railway, adicione as seguintes variáveis:

### Essenciais (Obrigatórias)
```
NODE_ENV=production
JWT_SECRET=seu-secret-muito-seguro-min-32-chars
MERCADOPAGO_MODE=sandbox
APP_URL=seu-projeto.railway.app
```

### APIs de Redes Sociais
```
META_APP_ID=seu-app-id-da-meta
META_APP_SECRET=seu-app-secret-da-meta
TIKTOK_CLIENT_ID=seu-tiktok-client-id
TIKTOK_CLIENT_SECRET=seu-tiktok-client-secret
YOUTUBE_CLIENT_ID=seu-youtube-client-id
YOUTUBE_CLIENT_SECRET=seu-youtube-client-secret
```

### Mercado Pago (Pagamentos)
```
MERCADOPAGO_ACCESS_TOKEN=seu-access-token
MERCADOPAGO_PUBLIC_KEY=sua-public-key
# Começar em sandbox, depois mudar para production
```

### IA
```
GEMINI_API_KEY=sua-google-gemini-api-key
```

## ✅ Obter Credenciais

### Meta (Instagram, Facebook, WhatsApp)
1. [ ] Acesse https://developers.facebook.com
2. [ ] Crie uma App
3. [ ] Configure WhatsApp, Instagram, Messenger
4. [ ] Copie APP_ID e APP_SECRET

### TikTok
1. [ ] Acesse https://developers.tiktok.com
2. [ ] Crie uma aplicação
3. [ ] Configure Client ID e Client Secret
4. [ ] Adicione seu app.railway.app como redirect URI

### YouTube
1. [ ] Acesse https://console.cloud.google.com
2. [ ] Crie um projeto
3. [ ] Habilite YouTube Data API v3
4. [ ] Crie OAuth 2.0 credentials (Web application)
5. [ ] Adicione seu app.railway.app como redirect URI

### Google Gemini API
1. [ ] Acesse https://ai.google.dev
2. [ ] Crie um projeto
3. [ ] Gere uma API Key
4. [ ] Use a chave no GEMINI_API_KEY

### Mercado Pago
1. [ ] Acesse https://www.mercadopago.com.br/developers
2. [ ] Crie uma conta (se não tiver)
3. [ ] Gere Access Token (começar com sandbox)
4. [ ] Gere Public Key
5. [ ] Depois de testes, mude MERCADOPAGO_MODE para production

## ✅ Testar Deployment

### Verificar Status
1. [ ] Acesse Dashboard Railway.app
2. [ ] Veja se o serviço está "Running" (verde)
3. [ ] Clique em "Open Application"
4. [ ] Verifique se vê a página inicial

### Testar API Backend
```bash
curl https://seu-projeto.railway.app/api/health
# Esperado: 200 OK
```

### Testar Frontend
```bash
curl https://seu-projeto.railway.app
# Esperado: HTML da aplicação React
```

### Testar Banco de Dados
No dashboard, clique em PostgreSQL → "Query Editor"
```sql
SELECT * FROM users LIMIT 1;
-- Esperado: tabela existe
```

## ✅ Configurar Domínio Próprio (Opcional)

1. [ ] Registrar domínio (namecheap.com, godaddy.com, etc)
2. [ ] No Railway, vá para "Settings" → "Domains"
3. [ ] Clique em "Add Domain"
4. [ ] Adicione seu domínio
5. [ ] Configure DNS com as instruções do Railway
6. [ ] Aguarde propagação (pode levar até 48h)

## ✅ Monitoramento Contínuo

### No Railway Dashboard
- [ ] Ver logs em tempo real
- [ ] Monitorar CPU/Memória
- [ ] Monitorar latência
- [ ] Alertas configurados

### Logs
```bash
# Via CLI
railway logs

# No Dashboard: Clique em "View Logs"
```

## ✅ Próximas Ações

1. [ ] **Configurar Email**: Enviar confirmação de subscrição (SendGrid, Mailgun)
2. [ ] **Backup Automático**: PostgreSQL backup diário
3. [ ] **Monitoramento**: Uptime alerts
4. [ ] **CDN**: Cloudflare para assets estáticos
5. [ ] **Analytics**: Google Analytics ou Plausible

## ✅ Verificação Final

- [ ] App está rodando em https://seu-projeto.railway.app
- [ ] Fazer login funciona
- [ ] Pode criar post de teste
- [ ] Mercado Pago sandbox de pagamento funciona
- [ ] Webhook do Mercado Pago recebendo eventos

## 🚀 Seu App Está PRONTO!

Parabéns! Sua aplicação SocialFlow AI agora está em produção no Railway.app!

**URL de Produção**: https://seu-projeto.railway.app

**Banco de Dados**: PostgreSQL em produção
**Analytics**: MongoDB em produção  
**Cache**: Redis em produção
**Pagamentos**: Mercado Pago integrado
**IA**: Google Gemini API integrada

### Próximas Receitas:
- Cada subscription no plano Starter: R$ 99/mês
- Cada subscription no plano Pro: R$ 299/mês
- Cada subscription no plano Enterprise: R$ 999/mês
- Taxa Mercado Pago: ~2.5% (já descontada)

**Comece a ganhar dinheiro! 💰**
