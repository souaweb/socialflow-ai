#!/bin/bash

# =============================================================================
# SocialFlow AI - Instalador para Hostinger
# Script automático para deploy em hospedagem compartilhada
# =============================================================================

set -e  # Exit on error

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                                                            ║"
echo "║        🚀 SocialFlow AI - Instalador Hostinger 🚀        ║"
echo "║                                                            ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[✓]${NC} $1"
}

print_error() {
    echo -e "${RED}[✗]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[!]${NC} $1"
}

# =============================================================================
# PASSO 1: Verificar Pré-requisitos
# =============================================================================

print_status "Verificando pré-requisitos..."

# Verificar Node.js
if ! command -v node &> /dev/null; then
    print_warning "Node.js não encontrado"
    print_status "Instalando Node.js..."
    
    # Para cPanel, usar nvm
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    nvm install 18
    nvm use 18
    print_success "Node.js instalado: $(node --version)"
else
    print_success "Node.js encontrado: $(node --version)"
fi

# Verificar npm
if ! command -v npm &> /dev/null; then
    print_error "npm não encontrado"
    exit 1
else
    print_success "npm encontrado: $(npm --version)"
fi

# Verificar Git
if ! command -v git &> /dev/null; then
    print_warning "Git não encontrado. Instalando..."
    apt-get update && apt-get install -y git || print_warning "Não foi possível instalar Git"
else
    print_success "Git encontrado: $(git --version)"
fi

echo ""

# =============================================================================
# PASSO 2: Clonar/Atualizar Repositório
# =============================================================================

print_status "Configurando repositório..."

REPO_URL="https://github.com/seu-usuario/socialflow-ai.git"  # Editar com seu URL
APP_DIR="$HOME/public_html/socialflow"

if [ -d "$APP_DIR" ]; then
    print_status "Repositório já existe. Atualizando..."
    cd "$APP_DIR"
    git pull origin main
else
    print_status "Clonando repositório..."
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

print_success "Repositório pronto"

echo ""

# =============================================================================
# PASSO 3: Instalar Dependências
# =============================================================================

print_status "Instalando dependências..."

# Frontend
npm install --legacy-peer-deps
print_success "Dependências frontend instaladas"

# Backend
cd backend
npm install --legacy-peer-deps
print_success "Dependências backend instaladas"

cd ..

echo ""

# =============================================================================
# PASSO 4: Configurar Variáveis de Ambiente
# =============================================================================

print_status "Configurando variáveis de ambiente..."

if [ ! -f ".env.local" ]; then
    print_warning ".env.local não encontrado"
    
    # Perguntar sobre configuração
    read -p "Deseja configurar .env.local agora? (s/n) " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Ss]$ ]]; then
        # Criar arquivo .env.local com valores padrão
        cat > .env.local << 'EOF'
# ==================== API ====================
NODE_ENV=production
PORT=3001
API_URL=https://seu-dominio.com.br
REACT_APP_API_URL=https://seu-dominio.com.br

# ==================== DATABASE ====================
DATABASE_HOST=localhost
DATABASE_PORT=3306
DATABASE_USER=seu_usuario
DATABASE_PASSWORD=sua_senha
DATABASE_NAME=socialflow_db

# ==================== JWT ====================
JWT_SECRET=mudeme_em_producao_com_algo_aleatorio
JWT_EXPIRATION=24h

# ==================== OAUTH2 ====================
META_APP_ID=seu_app_id
META_APP_SECRET=seu_app_secret
TIKTOK_CLIENT_ID=seu_client_id
YOUTUBE_CLIENT_ID=seu_client_id
GEMINI_API_KEY=sua_chave_gemini

# ==================== MERCADO PAGO ====================
MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu-token
MERCADOPAGO_PUBLIC_KEY=APP_USR-sua-chave
MERCADOPAGO_MODE=production

# ==================== APP ====================
APP_URL=https://seu-dominio.com.br
CORS_ORIGIN=https://seu-dominio.com.br
EOF
        
        print_warning "Arquivo .env.local criado. Edite com suas credenciais!"
        print_status "Abra e edite: $APP_DIR/.env.local"
    else
        print_error "Arquivo .env.local não configurado. Abortando."
        exit 1
    fi
else
    print_success ".env.local já existe"
fi

echo ""

# =============================================================================
# PASSO 5: Configurar Banco de Dados
# =============================================================================

print_status "Configurando banco de dados..."

# Perguntar se deseja executar migrations
read -p "Deseja criar tabelas no banco? (s/n) " -n 1 -r
echo

if [[ $REPLY =~ ^[Ss]$ ]]; then
    print_status "Executando migrations..."
    
    cd backend
    npm run typeorm migration:run 2>/dev/null || print_warning "Migrations: verifique manualmente"
    cd ..
    
    print_success "Banco de dados configurado"
else
    print_warning "Pule este passo se o banco já estiver configurado"
fi

echo ""

# =============================================================================
# PASSO 6: Build da Aplicação
# =============================================================================

print_status "Compilando aplicação..."

# Build Backend
cd backend
npm run build
print_success "Backend compilado"

# Build Frontend
cd ..
npm run build
print_success "Frontend compilado"

echo ""

# =============================================================================
# PASSO 7: Configurar PM2 (Process Manager)
# =============================================================================

print_status "Configurando PM2..."

npm install -g pm2

# Criar arquivo ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [
    {
      name: 'socialflow-backend',
      script: './backend/dist/main.js',
      instances: 1,
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production'
      },
      restart_delay: 4000,
      max_memory_restart: '500M',
      error_file: './logs/backend-error.log',
      out_file: './logs/backend-out.log'
    },
    {
      name: 'socialflow-frontend',
      script: 'npm',
      args: 'run preview',
      cwd: '.',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production'
      },
      error_file: './logs/frontend-error.log',
      out_file: './logs/frontend-out.log'
    }
  ]
};
EOF

# Criar diretório de logs
mkdir -p logs

# Iniciar aplicação com PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

print_success "PM2 configurado"

echo ""

# =============================================================================
# PASSO 8: Configurar Nginx/Apache
# =============================================================================

print_status "Configurando proxy reverso..."

# Para cPanel, criar arquivo .htaccess
cat > .htaccess << 'EOF'
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  
  # Proxy para backend (API)
  RewriteRule ^api/(.*)$ http://localhost:3001/api/$1 [P,L]
  RewriteRule ^subscription/(.*)$ http://localhost:3001/subscription/$1 [P,L]
  RewriteRule ^auth/(.*)$ http://localhost:3001/auth/$1 [P,L]
  
  # Redirecionar para index.html (SPA)
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule ^ index.html [L]
</IfModule>

# Compressão
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript
</IfModule>

# Cache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
EOF

print_success "Proxy reverso configurado"

echo ""

# =============================================================================
# PASSO 9: Verificar Status
# =============================================================================

print_status "Verificando status da aplicação..."

sleep 2

if pm2 list | grep -q "online"; then
    print_success "Aplicação está rodando!"
    pm2 list
else
    print_error "Erro ao iniciar aplicação"
    print_status "Verifique logs:"
    print_status "  pm2 logs"
fi

echo ""

# =============================================================================
# RESUMO
# =============================================================================

echo "╔════════════════════════════════════════════════════════════╗"
echo "║                   ✓ INSTALAÇÃO CONCLUÍDA!                 ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "📍 Informações da Instalação:"
echo "   Diretório: $APP_DIR"
echo "   Domínio: seu-dominio.com.br"
echo "   Backend: http://localhost:3001"
echo "   Frontend: http://seu-dominio.com.br"
echo ""

echo "⚙️ Próximos Passos:"
echo "   1. Editar .env.local com suas credenciais"
echo "   2. Criar banco de dados no cPanel"
echo "   3. Configurar SSL/HTTPS"
echo "   4. Apontar domínio para a pasta public_html"
echo ""

echo "📊 Monitoramento:"
echo "   Ver status:      pm2 list"
echo "   Ver logs:        pm2 logs"
echo "   Restart:         pm2 restart all"
echo "   Stop:            pm2 stop all"
echo ""

echo "💾 Backups:"
echo "   Banco dados:     mysqldump -u user -p db_name > backup.sql"
echo "   Arquivos:        tar -czf backup.tar.gz ."
echo ""

print_success "Tudo pronto para publicar e ganhar dinheiro! 🚀💰"
echo ""
