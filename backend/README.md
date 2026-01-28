# Backend do SocialFlow AI

Backend escalável para automação de redes sociais com APIs oficiais.

## Arquitetura

```
src/
├── main.ts                 # Entry point
├── app.module.ts          # Root module
├── config/                # Configurações
├── modules/               # Módulos de negócio
│   ├── auth/             # Autenticação OAuth2 + JWT
│   ├── platforms/        # Integração de plataformas
│   ├── conversations/    # Gerenciamento de conversas
│   ├── posts/           # Gerenciamento de posts
│   ├── crm/             # CRM e leads
│   ├── ai/              # IA conversacional
│   └── webhooks/        # Webhooks das plataformas
├── services/              # Serviços de negócio
├── entities/              # Entidades do banco
├── queue/                # Processamento assíncrono
└── utils/                # Utilitários
```

## Variáveis de Ambiente

```
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/socialflow
MONGODB_URI=mongodb://localhost:27017/socialflow
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=seu_secret_aqui
JWT_EXPIRES_IN=7d

# Meta (Facebook/Instagram/WhatsApp)
META_APP_ID=seu_app_id
META_APP_SECRET=seu_app_secret
META_VERIFY_TOKEN=seu_verify_token

# TikTok
TIKTOK_CLIENT_KEY=sua_chave
TIKTOK_CLIENT_SECRET=seu_secret

# YouTube
YOUTUBE_API_KEY=sua_chave

# Gemini (IA)
GEMINI_API_KEY=sua_chave

# Webhook
WEBHOOK_URL=https://seu_dominio.com/webhooks
```

## Inicialização

```bash
npm install
npm run dev
```

Servidor rodará em `http://localhost:3000`
