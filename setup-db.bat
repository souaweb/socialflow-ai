@echo off
REM Setup Database - SocialFlow (Windows)
REM Este script configura o banco de dados para produção

echo ===== SocialFlow Database Setup =====
echo.

REM Verificar se Docker está instalado
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker nao esta instalado!
    echo Baixe em: https://www.docker.com
    pause
    exit /b 1
)

echo [OK] Docker detectado

REM Verificar se Docker Compose está instalado
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Docker Compose nao esta instalado!
    echo Baixe em: https://docs.docker.com/compose/install
    pause
    exit /b 1
)

echo [OK] Docker Compose detectado
echo.

REM Criar diretório scripts se não existir
if not exist "scripts" mkdir scripts

echo Iniciando containers...
docker-compose up -d

echo.
echo Aguardando bancos de dados ficarem prontos...
timeout /t 10 /nobreak

echo.
echo ===== Verificando saude dos bancos =====
echo.

REM Teste de conexão com PostgreSQL
docker exec socialflow-postgres pg_isready -U socialflow >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] PostgreSQL pronto
) else (
    echo [AVISO] PostgreSQL ainda iniciando...
    timeout /t 5 /nobreak
)

REM Teste de conexão com MongoDB
docker exec socialflow-mongo mongosh --quiet --eval "db.adminCommand('ping')" >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] MongoDB pronto
) else (
    echo [AVISO] MongoDB ainda iniciando...
    timeout /t 5 /nobreak
)

REM Teste de conexão com Redis
docker exec socialflow-redis redis-cli -a socialflow123 ping >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Redis pronto
) else (
    echo [AVISO] Redis ainda iniciando...
    timeout /t 5 /nobreak
)

echo.
echo ========================================
echo [OK] Setup completo!
echo ========================================
echo.
echo Interfaces Web Disponiveis:
echo   - PgAdmin (PostgreSQL):    http://localhost:5050
echo     Usuario: admin@socialflow.com
echo     Senha: admin123
echo.
echo   - Mongo Express (MongoDB):  http://localhost:8081
echo.
echo   - Redis Commander (Redis): http://localhost:8082
echo.
echo Configuracoes do Banco:
echo   PostgreSQL:
echo     Host: localhost
echo     Port: 5432
echo     User: socialflow
echo     Password: socialflow123
echo     Database: socialflow_db
echo.
echo   MongoDB:
echo     URI: mongodb://socialflow:socialflow123@localhost:27017/socialflow_analytics
echo.
echo   Redis:
echo     Host: localhost
echo     Port: 6379
echo     Password: socialflow123
echo.
echo Proximos passos:
echo   1. Copiar .env.local.example para .env.local
echo   2. Configurar credenciais das APIs
echo   3. Executar: npm run dev
echo.
pause
