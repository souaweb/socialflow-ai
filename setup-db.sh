#!/bin/bash

# Setup Database - SocialFlow
# Este script configura o banco de dados para produção

echo "🚀 Iniciando setup do banco de dados..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado!"
    echo "Instale Docker: https://www.docker.com"
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado!"
    echo "Instale Docker Compose: https://docs.docker.com/compose/install"
    exit 1
fi

echo "✅ Docker e Docker Compose detectados"

# Criar diretório scripts se não existir
mkdir -p scripts

echo "📦 Iniciando containers..."
docker-compose up -d

echo "⏳ Aguardando bancos de dados ficarem prontos..."
sleep 10

echo "📝 Verificando saúde dos bancos..."

# Testar PostgreSQL
if docker exec socialflow-postgres pg_isready -U socialflow > /dev/null 2>&1; then
    echo "✅ PostgreSQL pronto"
else
    echo "⚠️ PostgreSQL ainda iniciando..."
    sleep 5
fi

# Testar MongoDB
if docker exec socialflow-mongo mongosh --quiet --eval "db.adminCommand('ping')" > /dev/null 2>&1; then
    echo "✅ MongoDB pronto"
else
    echo "⚠️ MongoDB ainda iniciando..."
    sleep 5
fi

# Testar Redis
if docker exec socialflow-redis redis-cli -a socialflow123 ping > /dev/null 2>&1; then
    echo "✅ Redis pronto"
else
    echo "⚠️ Redis ainda iniciando..."
    sleep 5
fi

echo ""
echo "🎉 Setup completo!"
echo ""
echo "📊 Interfaces Web Disponíveis:"
echo "   PgAdmin (PostgreSQL):  http://localhost:5050"
echo "   Usuário: admin@socialflow.com"
echo "   Senha: admin123"
echo ""
echo "   Mongo Express (MongoDB): http://localhost:8081"
echo ""
echo "   Redis Commander (Redis): http://localhost:8082"
echo ""
echo "🔧 Configurações do Banco:"
echo "   PostgreSQL:"
echo "     Host: localhost"
echo "     Port: 5432"
echo "     User: socialflow"
echo "     Password: socialflow123"
echo "     Database: socialflow_db"
echo ""
echo "   MongoDB:"
echo "     URI: mongodb://socialflow:socialflow123@localhost:27017/socialflow_analytics?authSource=admin"
echo ""
echo "   Redis:"
echo "     Host: localhost"
echo "     Port: 6379"
echo "     Password: socialflow123"
echo ""
echo "⚡ Próximos passos:"
echo "   1. Copiar .env.local.example para .env.local"
echo "   2. Configurar credenciais das APIs (Meta, TikTok, YouTube, Gemini, etc)"
echo "   3. Executar: npm run dev"
echo ""
