# 🚀 Guia Completo - Deploy SocialFlow AI na Hostinger

## Índice
1. [Preparação](#preparação)
2. [Passo a Passo](#passo-a-passo)
3. [Configuração do Banco de Dados](#configuração-do-banco-de-dados)
4. [Deploy da Aplicação](#deploy-da-aplicação)
5. [Configuração de Domínio e SSL](#configuração-de-domínio-e-ssl)
6. [Solução de Problemas](#solução-de-problemas)
7. [Monitoramento](#monitoramento)

---

## 📋 Preparação

### Requisitos
- Conta Hostinger (https://www.hostinger.com.br)
- Domínio registrado (ou registrar na Hostinger)
- Acesso SSH habilitado
- Client SSH (PuTTY, Terminal, PowerShell)
- FTP/SFTP Client (FileZilla)

### Plano Recomendado
**Plano: Cloud Startup** (recomendado)
- CPU: 2 cores
- RAM: 4GB
- SSD: 100GB
- Node.js: Disponível
- MySQL: Disponível
- Preço: R$ 29,90/mês

---

## 🎯 Passo a Passo

### Passo 1: Acessar Hostinger

1. Acesse sua conta em **hostinger.com.br**
2. Clique em **Gerenciar** próximo ao plano
3. No dashboard, localize **cPanel** ou **hPanel**
4. Clique em **Administrador de Arquivo**

### Passo 2: Habilitar SSH

No cPanel/hPanel:

1. Acesse **SSH / Shell Access** (SSH Access)
2. Clique em **Manage**
3. Ative SSH
4. Você verá o endereço SSH: `seu_usuario@IP` ou `seu_usuario@seu-dominio.com`

### Passo 3: Conectar via SSH

#### Windows (PowerShell):
```powershell
ssh seu_usuario@seu-dominio.com
# ou com IP
ssh seu_usuario@123.456.789.123
```

#### Mac/Linux (Terminal):
```bash
ssh seu_usuario@seu-dominio.com
```

#### Usando PuTTY (Windows):
1. Host: `seu-dominio.com` ou IP
2. Port: `22`
3. Username: seu_usuario
4. Password: sua_senha

### Passo 4: Verificar Node.js

No terminal SSH:

```bash
node --version
npm --version
```

Se não tiver Node.js, instale pelo painel Hostinger:
1. Vá para **Software Manager** no cPanel
2. Procure por **Node.js**
3. Instale a versão 18 ou superior

### Passo 5: Criar Banco de Dados MySQL

No cPanel:

1. Acesse **MySQL Databases**
2. Clique em **New Database**
3. Nome: `socialflow_db`
4. Clique **Create Database**

5. Agora crie um usuário:
   - Vá para **MySQL Users**
   - Nome: `sf_user`
   - Senha: Use algo forte (ex: `P@ssw0rd!2024!SecureHostinger`)
   - Clique **Create User**

6. Associe o usuário ao banco:
   - Vá para **Add User to Database**
   - Usuário: `sf_user`
   - Banco: `socialflow_db`
   - Privilégios: Selecione **ALL PRIVILEGES**
   - Clique **Make Changes**

### Passo 6: Clonar Repositório

No terminal SSH:

```bash
cd ~/public_html
git clone https://github.com/seu-usuario/socialflow-ai.git socialflow
cd socialflow
```

### Passo 7: Configurar Variáveis de Ambiente

```bash
nano .env.local
```

Cole isso e adapte com suas credenciais:

```env
# ==================== AMBIENTE ====================
NODE_ENV=production
PORT=3000
API_URL=https://seu-dominio.com.br
REACT_APP_API_URL=https://seu-dominio.com.br

# ==================== BANCO DE DADOS ====================
DATABASE_TYPE=mysql
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=sf_user
DATABASE_PASSWORD=P@ssw0rd!2024!SecureHostinger
DATABASE_NAME=socialflow_db

# ==================== JWT ====================
JWT_SECRET=seu_jwt_secreto_aleatorio_muito_longo_32_caracteres
JWT_EXPIRATION=24h
REFRESH_TOKEN_EXPIRATION=7d

# ==================== OAUTH2 ====================
META_APP_ID=seu_meta_app_id
META_APP_SECRET=seu_meta_app_secret
TIKTOK_CLIENT_ID=seu_tiktok_client_id
YOUTUBE_CLIENT_ID=seu_youtube_client_id

# ==================== GEMINI (IA) ====================
GEMINI_API_KEY=sua_chave_gemini

# ==================== MERCADO PAGO ====================
MERCADOPAGO_ACCESS_TOKEN=seu_token_acesso_mp
MERCADOPAGO_PUBLIC_KEY=sua_chave_publica_mp
MERCADOPAGO_MODE=production

# ==================== URLS ====================
APP_URL=https://seu-dominio.com.br
CORS_ORIGIN=https://seu-dominio.com.br
WEBHOOK_URL=https://seu-dominio.com.br/api/webhooks

# ==================== EMAIL (Opcional) ====================
SMTP_HOST=smtp.seuservidor.com
SMTP_PORT=587
SMTP_USER=seu_email@dominio.com
SMTP_PASS=sua_senha_email
```

Salve com: `Ctrl + X`, depois `Y`, depois `Enter`

### Passo 8: Instalar Dependências

```bash
# Backend
cd backend
npm install --legacy-peer-deps --production
npm run build
cd ..

# Frontend (se necessário)
npm install --legacy-peer-deps --production
npm run build
```

### Passo 9: Configurar PM2 (Process Manager)

```bash
# Instalar PM2 globalmente
npm install -g pm2

# Criar arquivo de configuração
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'socialflow-backend',
    script: './backend/dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3001
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time_format: 'YYYY-MM-DD HH:mm:ss Z',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
};
EOF

# Iniciar aplicação
pm2 start ecosystem.config.js

# Salvar configuração
pm2 save

# Ativar startup automático
pm2 startup
pm2 save
```

### Passo 10: Configurar Reverse Proxy (Apache)

Se está em hospedagem compartilhada com Apache:

```bash
# Editar arquivo de configuração do Apache
cat > .htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  
  # Redirecionar HTTP para HTTPS
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
  
  # Proxy para Node.js
  RewriteRule ^(.*)$ http://localhost:3001/$1 [P,QSA]
  ProxyPreserveHost On
  ProxyPassReverse / http://localhost:3001/
</IfModule>
```

---

## 🗄️ Configuração do Banco de Dados

### Importar Schema

```bash
# Conectar ao MySQL
mysql -u sf_user -p socialflow_db

# Dentro do MySQL, execute:
source init-postgres.sql
```

**Nota:** Se precisar ajustar script SQL para MySQL:

```bash
# Copiar arquivo para servidor
# Editar com adaptações para MySQL
nano init-mysql.sql
```

### Criar Usuário Teste

No MySQL:

```sql
INSERT INTO users (id, email, password, name, status, created_at) VALUES
(UUID(), 'admin@socialflow.com', 'hash_da_senha', 'Admin', 'active', NOW());
```

---

## 🚀 Deploy da Aplicação

### Opção 1: Via Git (Recomendado)

```bash
cd ~/public_html/socialflow

# Atualizar código
git pull origin main

# Instalar dependências
npm install --production

# Compilar
npm run build

# Reiniciar aplicação
pm2 restart socialflow-backend
```

### Opção 2: Via FTP/SFTP

1. Use FileZilla
2. Conecte-se com SSH SFTP
3. Upload dos arquivos compilados:
   - `/dist` → `public_html/socialflow/dist`
   - `/backend/dist` → `public_html/socialflow/backend/dist`
4. Restart: `pm2 restart socialflow-backend`

### Opção 3: Deploy Automático (GitHub Actions)

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Hostinger

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build
        run: |
          npm install --legacy-peer-deps
          npm run build
      
      - name: Deploy via FTP
        uses: SamKirkland/FTP-Deploy-Action@v4.3.5
        with:
          server: ${{ secrets.FTP_SERVER }}
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
          server-dir: ./public_html/socialflow/
```

---

## 🔒 Configuração de Domínio e SSL

### Passo 1: Apontar Domínio

Se registrou domínio fora da Hostinger:

1. Vá para seu registrador (GoDaddy, etc)
2. Nameservers: Use os da Hostinger
3. Hostinger:
   - `ns1.hostinger.com`
   - `ns2.hostinger.com`
   - `ns3.hostinger.com`

### Passo 2: Ativar SSL

No cPanel Hostinger:

1. Vá para **AutoSSL**
2. Clique em **Run AutoSSL** para seu domínio
3. Aguarde processamento (5-10 minutos)
4. Verifique se HTTPS está funcionando

### Passo 3: Redirecionar para HTTPS

```bash
# Editar .htaccess
cat >> .htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteCond %{HTTPS} off
  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]
</IfModule>
EOF
```

---

## 🐛 Solução de Problemas

### Problema 1: "Port 3000 está em uso"

```bash
# Encontrar processo usando a porta
lsof -i :3000

# Matar processo
kill -9 PID

# Ou usar outra porta
# Editar ecosystem.config.js e mudar PORT
```

### Problema 2: "Banco de dados não conecta"

Verificar credenciais:

```bash
# Testar conexão MySQL
mysql -u sf_user -h localhost -p socialflow_db

# Se falhar, criar de novo no cPanel
```

### Problema 3: "Aplicação não inicia"

```bash
# Ver logs
pm2 logs socialflow-backend

# Ver erro detalhado
tail -f ~/public_html/socialflow/logs/error.log

# Restart
pm2 restart socialflow-backend
```

### Problema 4: "CORS error"

Verificar .env.local:

```env
CORS_ORIGIN=https://seu-dominio.com.br
# Certifique-se que está sem / no final
```

### Problema 5: "Email não envia"

Se não tiver servidor SMTP:

1. Use SendGrid (grátis até 100 emails/dia)
2. Use Brevo (ex Sendinblue)
3. Ou deixe comentado em .env

---

## 📊 Monitoramento

### Comandos PM2

```bash
# Ver status
pm2 list

# Ver logs
pm2 logs

# Ver monitoramento em tempo real
pm2 monit

# Restart
pm2 restart all

# Stop
pm2 stop all

# Start
pm2 start all

# Ver detalhes de processo específico
pm2 show socialflow-backend
```

### Ver Uso de Memória/CPU

```bash
# Via SSH
top

# Sair: q
```

### Backup do Banco de Dados

```bash
# Fazer backup
mysqldump -u sf_user -p socialflow_db > backup_$(date +%Y%m%d).sql

# Restaurar
mysql -u sf_user -p socialflow_db < backup_20240115.sql
```

### Ver Espaço em Disco

```bash
df -h
du -sh ~/public_html/socialflow
```

---

## 💰 Próximos Passos para Monetizar

### 1. Criar Planos de Assinatura

No seu painel administrativo:

```json
{
  "planos": [
    {
      "nome": "Básico",
      "preco": 99.90,
      "moeda": "BRL",
      "limite_posts": 50,
      "canais": 3,
      "recurso_ia": true
    },
    {
      "nome": "Profissional",
      "preco": 299.90,
      "moeda": "BRL",
      "limite_posts": 500,
      "canais": 10,
      "recurso_ia": true,
      "multiposta": true
    },
    {
      "nome": "Enterprise",
      "preco": 999.90,
      "moeda": "BRL",
      "limite_posts": -1,
      "canais": 100,
      "recurso_ia": true,
      "multiposta": true,
      "suporte_24h": true
    }
  ]
}
```

### 2. Configurar Domínio de Email

Para suporte@seu-dominio.com.br:

1. cPanel → Email Accounts
2. Criar: support@seu-dominio.com.br
3. Criar: noreply@seu-dominio.com.br

### 3. Criar Landing Page

Use `/` com um bom conteúdo de venda:

```tsx
// App.tsx - Landing page
import LandingPage from './components/LandingPage';

export default function App() {
  if (!user) {
    return <LandingPage />;
  }
  return <Dashboard />;
}
```

### 4. Integrar Mercado Pago

Já está pronto! Apenas adicione credenciais em .env:

```env
MERCADOPAGO_ACCESS_TOKEN=seu_token
MERCADOPAGO_PUBLIC_KEY=sua_chave
```

### 5. Analytics

Monitorar:
- Número de clientes
- Receita total
- Taxa de churn
- Uso de features

---

## ✅ Checklist Final

- [ ] Conta Hostinger criada
- [ ] Domínio registrado/apontado
- [ ] SSH habilitado
- [ ] Banco de dados MySQL criado
- [ ] Repositório clonado
- [ ] .env.local configurado com credenciais
- [ ] Dependências instaladas
- [ ] Aplicação compilada
- [ ] PM2 configurado e rodando
- [ ] SSL ativado
- [ ] Acesso via https://seu-dominio.com.br funcionando
- [ ] Mercado Pago testado
- [ ] Backup configurado
- [ ] Monitoramento ativo
- [ ] Primeira cobrança realizada ✅

---

## 📞 Suporte Hostinger

Dúvidas? Contate:
- **Chat ao vivo**: Disponível 24/7 em hostinger.com.br
- **Email**: support@hostinger.com.br
- **Base de conhecimento**: https://support.hostinger.com.br

---

## 🎉 Parabéns!

Sua aplicação SocialFlow AI está LIVE! 

Você agora pode:
✅ Aceitar clientes
✅ Processar pagamentos via Mercado Pago
✅ Publicar em múltiplos canais
✅ Usar inteligência artificial
✅ Ganhar dinheiro com assinaturas

**Comece a vender!** 🚀
