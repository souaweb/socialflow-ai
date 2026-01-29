#!/bin/bash
# Railway.app Deployment Automation Script (Mac/Linux)
# Este script automatiza o deploy para Railway.app

echo ""
echo "==============================================="
echo "  SocialFlow AI - Railway.app Deployment"
echo "==============================================="
echo ""

# Verificar se Railway CLI está instalado
if ! command -v railway &> /dev/null; then
    echo "[!] Railway CLI não encontrado"
    echo "[*] Instalando Railway CLI..."
    npm install -g @railway/cli
    if [ $? -ne 0 ]; then
        echo "[X] Falha ao instalar Railway CLI"
        exit 1
    fi
fi

echo "[+] Railway CLI detectado"
echo ""

# Validar código
echo "[*] Validando código..."
npm run build > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "[X] Erro ao fazer build - verifique o código"
    exit 1
fi
echo "[+] Build bem-sucedido"

# Verificar Git
echo "[*] Verificando Git..."
git status > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "[X] Repositório Git não encontrado"
    exit 1
fi
echo "[+] Git OK"

# Fazer push para GitHub
echo "[*] Fazendo push para GitHub..."
BRANCH=$(git rev-parse --abbrev-ref HEAD)
git push -u origin $BRANCH > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "[!] Aviso: Código pode não estar 100% atualizado no GitHub"
else
    echo "[+] Push bem-sucedido"
fi

echo ""
echo "==============================================="
echo "  Próximos Passos para Railway.app"
echo "==============================================="
echo ""
echo "[1] Acesse: https://railway.app/dashboard"
echo ""
echo "[2] Crie um novo projeto:"
echo "    - Click em 'Create New Project'"
echo "    - Selecione 'Deploy from GitHub'"
echo "    - Conecte sua conta GitHub"
echo "    - Selecione: socialflow-ai"
echo ""
echo "[3] Adicione os serviços de banco de dados:"
echo "    - PostgreSQL 14"
echo "    - MongoDB"
echo "    - Redis"
echo ""
echo "[4] Configure as variáveis de ambiente:"
echo "    - DATABASE_PASSWORD"
echo "    - REDIS_PASSWORD"
echo "    - JWT_SECRET"
echo "    - META_APP_ID, META_APP_SECRET"
echo "    - TIKTOK_CLIENT_ID, TIKTOK_CLIENT_SECRET"
echo "    - YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET"
echo "    - GEMINI_API_KEY"
echo "    - MERCADOPAGO_ACCESS_TOKEN"
echo "    - MERCADOPAGO_PUBLIC_KEY"
echo "    - MERCADOPAGO_MODE=sandbox (depois mude para production)"
echo "    - APP_URL (seu domínio no Railway)"
echo ""
echo "[5] Railway.app automaticamente:"
echo "    - Detecta Dockerfile"
echo "    - Detecta railway.json"
echo "    - Faz o deploy"
echo "    - Cria URL pública"
echo ""
echo "==============================================="
echo "  Alternativa: Deploy via CLI"
echo "==============================================="
echo ""
echo "Se preferir usar CLI do Railway:"
echo ""
echo "  railway login"
echo "  railway init"
echo "  railway add postgresql mongodb redis"
echo "  railway link"
echo "  railway up"
echo ""
echo "==============================================="
echo ""
echo "[+] Código pronto para deploy!"
echo "[+] URL GitHub: Verifique seu repositório"
echo ""
