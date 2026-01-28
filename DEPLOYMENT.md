# 🚀 DEPLOYMENT GUIDE - SocialFlow

## Fase 1: Setup Local (Você está aqui)

### ✅ O que foi feito:
- ✅ 14 módulos NestJS criados
- ✅ Integração Mercado Pago completa
- ✅ Docker Compose com PostgreSQL, MongoDB, Redis
- ✅ Schemas SQL e MongoDB
- ✅ Scripts de setup automático

### 🎯 Próximas Ações para Ganhar Dinheiro:

---

## PASSO 1: Preparar Ambiente Local

### 1.1 Clonar e Instalar
```bash
# Entrar na pasta
cd socialflow-ai

# Instalar dependências
npm install
cd backend && npm install && cd ..

# Copiar variáveis de ambiente
cp .env.local.example .env.local
```

### 1.2 Iniciar Bancos de Dados
```bash
# Windows
.\setup-db.bat

# Mac/Linux
chmod +x setup-db.sh
./setup-db.sh
```

**Aguarde:** ~30 segundos para os bancos iniciarem

### 1.3 Verificar Conexão
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Esperado:
# [Nest] ... NestFactory Nest application successfully started
# Listening on port 3001
```

### 1.4 Testar Frontend
```bash
# Terminal 2 - Frontend
npm run dev

# Esperado:
# ➜  Local:   http://localhost:5173/
```

Abrir: http://localhost:5173
- Email: `admin@socialflow.com`
- Senha: (qualquer password)

---

## PASSO 2: Configurar Credenciais de APIs

### 2.1 Meta (Instagram, Facebook)

**Obter Credenciais:**
1. Ir para https://developers.facebook.com
2. Criar App
3. Adicionar "Instagram Graph API"
4. Obter: App ID, App Secret, User Token

**Configurar `.env.local`:**
```env
META_APP_ID=seu_id_aqui
META_APP_SECRET=seu_secret_aqui
META_REDIRECT_URI=http://localhost:3001/auth/oauth/meta/callback
```

### 2.2 TikTok

**Obter Credenciais:**
1. Ir para https://developers.tiktok.com
2. Criar App
3. Obter: Client ID, Client Secret

**Configurar `.env.local`:**
```env
TIKTOK_CLIENT_ID=seu_client_id
TIKTOK_CLIENT_SECRET=seu_client_secret
```

### 2.3 YouTube

**Obter Credenciais:**
1. Ir para https://console.cloud.google.com
2. Criar Projeto
3. Ativar YouTube API v3
4. Criar OAuth2 Client ID
5. Obter: Client ID, Client Secret

**Configurar `.env.local`:**
```env
YOUTUBE_CLIENT_ID=seu_client_id
YOUTUBE_CLIENT_SECRET=seu_client_secret
```

### 2.4 Google Gemini (IA)

**Obter Credenciais:**
1. Ir para https://makersuite.google.com/app/apikey
2. Criar API Key
3. Copiar a chave

**Configurar `.env.local`:**
```env
GEMINI_API_KEY=sua_api_key
```

### 2.5 Mercado Pago (Pagamentos)

**Obter Credenciais:**
1. Ir para https://www.mercadopago.com.br
2. Fazer cadastro como vendedor
3. Acessar: Settings → API Keys
4. Copiar: Access Token, Public Key

**Configurar `.env.local`:**
```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu-token
MERCADOPAGO_PUBLIC_KEY=APP_USR-sua-chave-publica
MERCADOPAGO_MODE=sandbox  # Mude para 'production' quando pronto
```

---

## PASSO 3: Testar Funcionalidades

### 3.1 Testar Autenticação
```bash
curl http://localhost:3001/auth/health
# Esperado: { "status": "ok" }
```

### 3.2 Testar Planos de Assinatura
```bash
curl http://localhost:3001/subscription/plans
# Esperado: Array com 4 planos (Free, Starter, Pro, Enterprise)
```

### 3.3 Testar Integração Mercado Pago
```bash
curl -X POST http://localhost:3001/subscription/mercadopago/checkout \
  -H "Content-Type: application/json" \
  -d '{
    "planId": "plan_pro",
    "planName": "Pro",
    "amount": 299,
    "currency": "BRL",
    "businessId": "test_biz",
    "buyerEmail": "test@example.com",
    "buyerName": "Test User",
    "billingCycle": "monthly",
    "description": "Test Plan"
  }'
# Esperado: checkoutUrl e preferenceId
```

### 3.4 Testar Publicação em Canais
```bash
# Frontend: Conectar uma rede social (Instagram/Facebook/TikTok)
# Dashboard → Conexões → Conectar plataforma
# Seguir fluxo OAuth2
```

---

## PASSO 4: Deploy em Produção

### 4.1 Registrar Domínio
- Ir para https://www.namecheap.com ou similar
- Registrar: `seuapp.com.br`
- Anotar nameservers

### 4.2 Escolher Cloud Provider

**Opção A: AWS (Recomendado)**
1. Criar conta AWS (https://aws.amazon.com)
2. Criar:
   - **RDS PostgreSQL** (banco relacional)
   - **DocumentDB/Atlas** (MongoDB)
   - **ElastiCache** (Redis)
   - **EC2** ou **ECS** (app server)

**Opção B: Google Cloud**
1. Criar conta Google Cloud
2. Usar:
   - Cloud SQL (PostgreSQL)
   - Firestore (MongoDB)
   - Memorystore (Redis)
   - Cloud Run (app server)

**Opção C: Railway.app (Mais Rápido)**
1. Ir para https://railway.app
2. Conectar GitHub
3. Deploy automático
4. Adicionar PostgreSQL, MongoDB, Redis

### 4.3 Atualizar `.env` para Produção

```env
# Production
NODE_ENV=production
PORT=3001

# Database (RDS/Cloud SQL)
DATABASE_HOST=seu-rds-endpoint.amazonaws.com
DATABASE_PORT=5432
DATABASE_USER=seu_user
DATABASE_PASSWORD=senha_segura_aleatoria
DATABASE_NAME=socialflow_prod

# MongoDB (Atlas)
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db?retryWrites=true&w=majority

# Redis (ElastiCache)
REDIS_HOST=seu-redis-endpoint.amazonaws.com
REDIS_PORT=6379
REDIS_PASSWORD=senha_segura_aleatoria

# APIs (mesmas credenciais)
META_APP_ID=seu_id
META_APP_SECRET=seu_secret
...

# Mercado Pago (MUDAR PARA PRODUCTION!)
MERCADOPAGO_MODE=production
```

### 4.4 Deploy da Aplicação

**AWS EC2 (via SSH):**
```bash
# 1. Conectar ao servidor
ssh -i seu-chave.pem ubuntu@seu-ip-publico

# 2. Clonar repositório
git clone https://github.com/seu-usuario/socialflow-ai.git
cd socialflow-ai

# 3. Instalar dependências
npm install
cd backend && npm install && cd ..

# 4. Configurar variáveis
nano .env  # ou editor de sua escolha

# 5. Build
npm run build
cd backend && npm run build && cd ..

# 6. Iniciar com PM2 (process manager)
npm install -g pm2
pm2 start npm --name "socialflow-backend" -- run start
pm2 start npm --name "socialflow-frontend" -- run start
pm2 startup
pm2 save
```

**Railway.app (automático):**
```bash
# 1. Conectar seu GitHub
# 2. Importar repositório
# 3. Railway detecta package.json automaticamente
# 4. Adicionar variáveis de ambiente
# 5. Deploy automático em push!
```

### 4.5 Configurar SSL/HTTPS

**Usar Let's Encrypt (Grátis):**
```bash
# Instalar Certbot
sudo apt-get install certbot python3-certbot-nginx

# Gerar certificado
sudo certbot certonly --standalone -d seuapp.com.br

# Renovar automaticamente
sudo certbot renew --dry-run
```

### 4.6 Configurar Nginx (Reverse Proxy)

```nginx
# /etc/nginx/sites-available/socialflow
upstream backend {
    server localhost:3001;
}

upstream frontend {
    server localhost:5173;
}

server {
    listen 443 ssl;
    server_name seuapp.com.br;

    ssl_certificate /etc/letsencrypt/live/seuapp.com.br/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/seuapp.com.br/privkey.pem;

    # Frontend
    location / {
        proxy_pass http://frontend;
    }

    # API
    location /api {
        proxy_pass http://backend;
    }
}

# Redirecionar HTTP para HTTPS
server {
    listen 80;
    server_name seuapp.com.br;
    return 301 https://$server_name$request_uri;
}
```

**Habilitar:**
```bash
sudo ln -s /etc/nginx/sites-available/socialflow /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

---

## PASSO 5: Monitorar e Escalar

### 5.1 Monitorar Performance
```bash
# Ver logs
pm2 logs

# Ver status
pm2 monit

# Ver uso de recursos
htop
```

### 5.2 Backup Automático

**PostgreSQL:**
```bash
# Backup diário
0 2 * * * pg_dump -U socialflow socialflow_db | gzip > /backups/db_$(date +\%Y\%m\%d).sql.gz
```

**MongoDB:**
```bash
# Backup diário
0 3 * * * mongodump --archive=/backups/mongo_$(date +\%Y\%m\%d).archive
```

### 5.3 CI/CD com GitHub Actions

**Criar `.github/workflows/deploy.yml`:**
```yaml
name: Deploy

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Install dependencies
        run: npm install && cd backend && npm install
      - name: Build
        run: npm run build && cd backend && npm run build
      - name: Deploy
        run: |
          rsync -avz --delete dist/ user@server:/app/dist/
          ssh user@server 'cd /app && npm run start'
```

---

## 💰 COMO GANHAR DINHEIRO

### Modelo 1: SaaS (Assinatura Recorrente)
- Free: $0/mês
- Starter: R$99/mês (50 posts)
- Pro: R$299/mês (ilimitado)
- Enterprise: R$999/mês (suporte 24/7)

**Projeção com 100 clientes Pro:**
- 100 × R$299 = R$29.900/mês
- Menos 10% Mercado Pago = R$26.910/mês
- Menos 30% custos de infra = R$18.837/mês

### Modelo 2: Afiliados
- Comissão de 15% por cliente novo
- Integração com Mercado Pago via `AffiliateModule`

### Modelo 3: Marketplace
- Vender templates de posts
- Vender integrações customizadas
- Oferecer consultoria

---

## 📞 SUPORTE E TROUBLESHOOTING

### Problema: Banco não conecta
```bash
# Verificar se containers estão rodando
docker ps

# Se não: reiniciar
docker-compose up -d
```

### Problema: Mercado Pago retorna erro
```bash
# Verificar Access Token (não expira em sandbox)
# Em produção: renovar access token mensalmente
```

### Problema: App não faz login
```bash
# Verificar JWT_SECRET em .env
# Regenerar tokens: DELETE FROM users, clear localStorage
```

---

## 🎯 CHECKLIST PARA LAUNCH

- [ ] Banco de dados funcionando
- [ ] APIs (Meta, TikTok, YouTube, Gemini) configuradas
- [ ] Mercado Pago em produção
- [ ] SSL/HTTPS ativo
- [ ] Backups automáticos
- [ ] Monitoramento ativo
- [ ] Documentação atualizada
- [ ] Testes em staging
- [ ] Suporte de clientes preparado

---

**Parabéns! Você tem uma aplicação pronta para ganhar dinheiro! 🚀💰**

Próximo passo: Fazer marketing e ganhar seu primeiro cliente!

### 3. Configurar Banco de Dados

```bash
# Crie o banco de dados
mysql -u root -p < schema.sql

# Ou se usar PostgreSQL, adapte o script em schema.sql
```

### 4. Iniciar Servidor de Desenvolvimento

```bash
# Terminal 1: Frontend (React + Vite)
npm run dev

# Terminal 2: Backend (PHP - Hostinger/Local)
# Se local com PHP built-in:
php -S localhost:8000 -t api/
```

Acesse: http://localhost:5173

---

## 🌍 Deployment em Produção

### Opção 1: Vercel (Frontend Recomendado)

```bash
# Instale Vercel CLI
npm i -g vercel

# Deploy
vercel

# Configure variáveis em: https://vercel.com/dashboard
```

**vercel.json:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "env": {
    "VITE_GEMINI_API_KEY": "@vite_gemini_api_key"
  }
}
```

### Opção 2: Netlify (Frontend)

```bash
# Deploy via Netlify CLI
npm i -g netlify-cli
netlify deploy --prod
```

### Opção 3: Docker (Completo)

**Dockerfile:**
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
RUN apk add --no-cache php php-pdo
COPY --from=build /app/dist ./dist
COPY api/ ./api/
COPY .env.local ./
EXPOSE 5173 8000

CMD ["npm", "run", "dev"]
```

```bash
docker build -t socialflow-ai .
docker run -p 5173:5173 -p 8000:8000 socialflow-ai
```

### Opção 4: Hostinger (Backend PHP)

1. **Fazer upload via FTP:**
```bash
ftp seu-host-hostinger.com
# Upload: api/index.php, schema.sql, .env
```

2. **Criar banco de dados:**
   - Painel > Banco de Dados > phpMyAdmin
   - Executar schema.sql

3. **Frontend em Vercel/Netlify** (recomendado)

---

## 🔑 Variáveis de Ambiente

### Essenciais (Bloquear produção)

| Variável | Descrição | Exemplo |
|----------|-----------|---------|
| `VITE_GEMINI_API_KEY` | Chave da IA Google | `AIzaSy...` |
| `DB_HOST` | Host do banco | `localhost` |
| `DB_NAME` | Nome banco | `socialflow` |
| `DB_USER` | Usuário BD | `root` |
| `DB_PASSWORD` | Senha BD | `sua_senha` |
| `JWT_SECRET` | Chave JWT | `chave_super_secreta` |

### Pagamento (Opcional)

```env
STRIPE_SECRET_KEY=sk_live_...
ASAAS_API_KEY=...
MERCADOPAGO_ACCESS_TOKEN=...
```

### APIs Sociais (Opcional)

```env
META_ACCESS_TOKEN=...
TIKTOK_CLIENT_ID=...
WHATSAPP_ACCESS_TOKEN=...
```

---

## 🔒 Segurança

### Checklist de Segurança

- [ ] Nunca commitar `.env.local` (adicione ao `.gitignore`)
- [ ] Usar HTTPS em produção
- [ ] Habilitar CORS apenas para domínios conhecidos
- [ ] Implementar rate limiting na API
- [ ] Usar JWT para autenticação
- [ ] Sanitizar inputs (já implementado)
- [ ] Usar variáveis de ambiente para secrets
- [ ] Fazer backup regular do banco de dados
- [ ] Monitorar logs de erro
- [ ] Implementar 2FA para admin

### Exemplo: Salvar Credenciais Seguro

```bash
# ❌ NUNCA faça isso:
git add .env.local

# ✅ SEMPRE faça isso:
echo ".env.local" >> .gitignore
git add .gitignore
```

---

## 📊 Estrutura de Deployment

```
SocialFlow AI
├── Frontend (React/Vite) → Vercel/Netlify
│   ├── App.tsx
│   ├── components/
│   └── services/ (sem API keys)
│
├── Backend (PHP) → Hostinger/Server
│   ├── api/index.php
│   ├── .env (variáveis de ambiente)
│   └── schema.sql
│
└── Database (MySQL/PostgreSQL)
    └── Hosted em RDS/Railway/etc
```

---

## 🚀 Comandos Úteis

```bash
# Desenvolvimento
npm run dev          # Inicia dev server

# Build
npm run build        # Build para produção
npm run preview      # Preview do build

# Database
mysql < schema.sql   # Criar tabelas
php -S localhost:8000  # Servidor PHP local

# Testing
npm test             # Executar testes (se configurado)
```

---

## 📝 Build para Produção

```bash
# 1. Build do Frontend
npm run build

# 2. Upload para Vercel/Netlify automaticamente via Git

# 3. Backend já está em Hostinger

# 4. Verificar se está online
curl https://seudominio.com
curl https://api.seudominio.com/api/index.php?action=status
```

---

## 🆘 Troubleshooting

### "CORS error"
```php
// Verificar em api/index.php
$allowed_origins = [...seu-dominio...];
```

### "Database connection failed"
```bash
# Testar conexão
mysql -h localhost -u user -p database_name
```

### "API Key not working"
```bash
# Verificar arquivo .env está sendo lido
php -r "echo getenv('VITE_GEMINI_API_KEY');"
```

### "Build falha no Vercel"
```bash
# Verificar logs
vercel logs

# Ou redeployar com verbose
vercel --debug
```

---

## 📞 Suporte

- **Documentação**: https://docs.socialflow.ai
- **Issues**: https://github.com/seu-usuario/socialflow-ai/issues
- **Email**: support@socialflow.ai
- **Discord**: https://discord.gg/socialflow

---

## 📄 Licença

MIT License - veja LICENSE.md

---

**Última atualização:** 28/01/2026
**Versão:** 1.0.0
