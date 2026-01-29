@echo off
REM Railway.app Deployment Automation Script
REM Este script automatiza o deploy para Railway.app

echo.
echo ===============================================
echo  SocialFlow AI - Railway.app Deployment
echo ===============================================
echo.

REM Verificar se Railway CLI está instalado
where railway >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Railway CLI não encontrado
    echo [*] Instalando Railway CLI...
    npm install -g @railway/cli
    if %ERRORLEVEL% NEQ 0 (
        echo [X] Falha ao instalar Railway CLI
        exit /b 1
    )
)

echo [+] Railway CLI detectado
echo.

REM Validar código
echo [*] Validando código...
npm run build >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Erro ao fazer build - verifique o código
    exit /b 1
)
echo [+] Build bem-sucedido

REM Verificar Git
echo [*] Verificando Git...
git status >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [X] Repositório Git não encontrado
    exit /b 1
)
echo [+] Git OK

REM Fazer push para GitHub
echo [*] Fazendo push para GitHub...
for /f %%i in ('git rev-parse --abbrev-ref HEAD') do set BRANCH=%%i
git push -u origin %BRANCH% >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [!] Aviso: Código pode não estar 100%% atualizado no GitHub
) else (
    echo [+] Push bem-sucedido
)

echo.
echo ===============================================
echo  Próximos Passos para Railway.app
echo ===============================================
echo.
echo [1] Acesse: https://railway.app/dashboard
echo.
echo [2] Crie um novo projeto:
echo     - Click em "Create New Project"
echo     - Selecione "Deploy from GitHub"
echo     - Conecte sua conta GitHub
echo     - Selecione: socialflow-ai
echo.
echo [3] Adicione os serviços de banco de dados:
echo     - PostgreSQL 14
echo     - MongoDB
echo     - Redis
echo.
echo [4] Configure as variáveis de ambiente:
echo     - DATABASE_PASSWORD
echo     - REDIS_PASSWORD
echo     - JWT_SECRET
echo     - META_APP_ID, META_APP_SECRET
echo     - TIKTOK_CLIENT_ID, TIKTOK_CLIENT_SECRET
echo     - YOUTUBE_CLIENT_ID, YOUTUBE_CLIENT_SECRET
echo     - GEMINI_API_KEY
echo     - MERCADOPAGO_ACCESS_TOKEN
echo     - MERCADOPAGO_PUBLIC_KEY
echo     - MERCADOPAGO_MODE=sandbox (depois mude para production)
echo     - APP_URL (seu domínio no Railway)
echo.
echo [5] Railway.app automaticamente:
echo     - Detecta Dockerfile
echo     - Detecta railway.json
echo     - Faz o deploy
echo     - Cria URL pública
echo.
echo ===============================================
echo  Alternativa: Deploy via CLI
echo ===============================================
echo.
echo Se preferir usar CLI do Railway:
echo.
echo   railway login
echo   railway init
echo   railway add postgresql mongodb redis
echo   railway link
echo   railway up
echo.
echo ===============================================
echo.
echo [+] Código pronto para deploy!
echo [+] URL GitHub: Verifique seu repositório
echo.
pause
