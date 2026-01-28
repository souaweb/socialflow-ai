#!/bin/bash

# ============================================================================
#  SocialFlow AI - Quick Start para Hostinger via SSH
#  Execute este arquivo para deploy automático e rápido
#  Uso: chmod +x hostinger-quickstart.sh && ./hostinger-quickstart.sh
# ============================================================================

set -e  # Exit on error

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funções
print_header() {
    echo ""
    echo -e "${BLUE}================================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅  $1${NC}"
}

print_error() {
    echo -e "${RED}❌  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️   $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️   $1${NC}"
}

# ============================================================================
# PASSO 1: Verificações iniciais
# ============================================================================

print_header "PASSO 1: Verificações Iniciais"

if ! command -v node &> /dev/null; then
    print_error "Node.js não está instalado"
    echo "Instale via: https://nodejs.org ou https://docs.hostinger.com/en/how-to-install-nodejs"
    exit 1
fi

if ! command -v npm &> /dev/null; then
    print_error "npm não está instalado"
    exit 1
fi

if ! command -v git &> /dev/null; then
    print_error "Git não está instalado"
    exit 1
fi

NODE_V=$(node --version)
NPM_V=$(npm --version)
print_success "Node.js: $NODE_V"
print_success "npm: $NPM_V"

# ============================================================================
# PASSO 2: Preparar diretório
# ============================================================================

print_header "PASSO 2: Preparando Diretório"

APP_DIR="$HOME/public_html/socialflow"

if [ -d "$APP_DIR" ]; then
    print_info "Diretório já existe, atualizando..."
    cd "$APP_DIR"
    git pull origin main || git pull origin master
else
    print_info "Criando novo diretório..."
    mkdir -p "$HOME/public_html"
    cd "$HOME/public_html"
    git clone https://github.com/seu-usuario/socialflow-ai.git socialflow
    cd socialflow
fi

print_success "Diretório: $(pwd)"

# ============================================================================
# PASSO 3: Variáveis de ambiente
# ============================================================================

print_header "PASSO 3: Configurando .env.local"

if [ ! -f ".env.local" ]; then
    print_info "Criando .env.local com valores padrão..."
    
    cat > .env.local << 'ENVEOF'
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
DATABASE_PASSWORD=sua_senha_aqui
DATABASE_NAME=socialflow_db

# ==================== JWT ====================
JWT_SECRET=mudeme_com_algo_aleatorio_muito_longo_32_caracteres
JWT_EXPIRATION=24h

# ==================== OAUTH2 ====================
META_APP_ID=seu_app_id
META_APP_SECRET=seu_app_secret
TIKTOK_CLIENT_ID=seu_tiktok_id
YOUTUBE_CLIENT_ID=seu_youtube_id

# ==================== GEMINI (IA) ====================
GEMINI_API_KEY=sua_chave_gemini

# ==================== MERCADO PAGO ====================
MERCADOPAGO_ACCESS_TOKEN=seu_token_mp
MERCADOPAGO_PUBLIC_KEY=sua_chave_publica_mp
MERCADOPAGO_MODE=production

# ==================== URLS ====================
APP_URL=https://seu-dominio.com.br
CORS_ORIGIN=https://seu-dominio.com.br
ENVEOF

    print_warning "⚠️  EDITE O ARQUIVO .env.local COM SUAS CREDENCIAIS!"
    print_warning "   nano .env.local"
    print_warning "   Depois execute este script novamente"
    exit 1
else
    print_success ".env.local já existe"
fi

# ============================================================================
# PASSO 4: Instalar dependências
# ============================================================================

print_header "PASSO 4: Instalando Dependências"

print_info "Frontend..."
npm install --legacy-peer-deps --production 2>&1 | tail -5
print_success "Frontend instalado"

print_info "Backend..."
cd backend
npm install --legacy-peer-deps --production 2>&1 | tail -5
print_success "Backend instalado"
cd ..

# ============================================================================
# PASSO 5: Build
# ============================================================================

print_header "PASSO 5: Compilando Aplicação"

print_info "Frontend..."
npm run build 2>&1 | tail -5
print_success "Frontend compilado"

print_info "Backend..."
cd backend
npm run build 2>&1 | tail -5
print_success "Backend compilado"
cd ..

# ============================================================================
# PASSO 6: PM2 Setup
# ============================================================================

print_header "PASSO 6: Configurando PM2"

if ! command -v pm2 &> /dev/null; then
    print_info "Instalando PM2 globalmente..."
    npm install -g pm2
fi

print_success "PM2 instalado"

# Criar ecosystem config
cat > ecosystem.config.js << 'PMEOF'
module.exports = {
  apps: [{
    name: 'socialflow-backend',
    script: './backend/dist/main.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production'
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    merge_logs: true,
    autorestart: true,
    max_memory_restart: '1G'
  }]
};
PMEOF

mkdir -p logs
print_success "ecosystem.config.js criado"

# Remover instância anterior se existir
pm2 delete socialflow-backend 2>/dev/null || true

# Iniciar com PM2
print_info "Iniciando aplicação..."
pm2 start ecosystem.config.js
pm2 save
pm2 startup 2>&1 | tail -1

print_success "PM2 iniciado"

# ============================================================================
# PASSO 7: Verificações finais
# ============================================================================

print_header "PASSO 7: Verificações Finais"

# Ver status
pm2 status

# Ver logs
print_info "Últimos logs:"
pm2 logs socialflow-backend --lines 5

# ============================================================================
# Conclusão
# ============================================================================

print_header "🎉 DEPLOY COMPLETO!"

echo ""
echo "Próximos passos:"
echo ""
echo "1. Ver status:"
echo "   pm2 status"
echo ""
echo "2. Ver logs em tempo real:"
echo "   pm2 logs"
echo ""
echo "3. Monitoramento:"
echo "   pm2 monit"
echo ""
echo "4. Acessar aplicação:"
echo "   https://seu-dominio.com.br"
echo ""
echo "5. Para atualizações futuras:"
echo "   cd ~/public_html/socialflow"
echo "   git pull origin main"
echo "   npm install --production"
echo "   npm run build"
echo "   pm2 restart socialflow-backend"
echo ""

print_info "Documentação: HOSTINGER_GUIA_COMPLETO.md"
print_info "Suporte: https://support.hostinger.com.br"
