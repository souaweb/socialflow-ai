@echo off
REM =============================================================================
REM SocialFlow AI - Instalador para Hostinger (Windows)
REM Script automático para deploy em hospedagem compartilhada
REM =============================================================================

setlocal enabledelayedexpansion

echo.
echo ======================================================================
echo         ^!^!^! SocialFlow AI - Instalador Hostinger ^!^!^!
echo ======================================================================
echo.

REM =============================================================================
REM PASSO 1: Preparação Inicial
REM =============================================================================

echo [PASSO 1] Preparacao Inicial
echo.

REM Solicitar caminho do projeto
set /p APP_DIR="Digite o caminho completo da aplicacao (ex: C:\Users\seu_usuario\socialflow-ai): "

if not exist "!APP_DIR!" (
    echo [ERRO] Diretorio nao encontrado: !APP_DIR!
    pause
    exit /b 1
)

cd /d "!APP_DIR!"
echo [OK] Diretorio: !APP_DIR!
echo.

REM =============================================================================
REM PASSO 2: Instalar Dependências
REM =============================================================================

echo [PASSO 2] Instalando Dependencias
echo.

REM Verificar Node.js
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRO] Node.js nao esta instalado!
    echo Baixe em: https://nodejs.org
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node --version') do set NODE_VERSION=%%i
echo [OK] Node.js: !NODE_VERSION!

REM Instalar dependências frontend
echo [INFO] Instalando dependencias frontend...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo [AVISO] Erro ao instalar dependencias frontend
)

REM Instalar dependências backend
cd backend
echo [INFO] Instalando dependencias backend...
call npm install --legacy-peer-deps
if %errorlevel% neq 0 (
    echo [AVISO] Erro ao instalar dependencias backend
)
cd ..
echo [OK] Dependencias instaladas
echo.

REM =============================================================================
REM PASSO 3: Configurar Variáveis de Ambiente
REM =============================================================================

echo [PASSO 3] Configurando Variaveis de Ambiente
echo.

if not exist ".env.local" (
    echo [AVISO] Arquivo .env.local nao encontrado
    echo Criando arquivo de exemplo...
    
    (
        echo # ==================== API ====================
        echo NODE_ENV=production
        echo PORT=3001
        echo API_URL=https://seu-dominio.com.br
        echo REACT_APP_API_URL=https://seu-dominio.com.br
        echo.
        echo # ==================== DATABASE ====================
        echo DATABASE_HOST=localhost
        echo DATABASE_PORT=3306
        echo DATABASE_USER=seu_usuario
        echo DATABASE_PASSWORD=sua_senha
        echo DATABASE_NAME=socialflow_db
        echo.
        echo # ==================== JWT ====================
        echo JWT_SECRET=mudeme_em_producao_com_algo_aleatorio
        echo JWT_EXPIRATION=24h
        echo.
        echo # ==================== OAUTH2 ====================
        echo META_APP_ID=seu_app_id
        echo META_APP_SECRET=seu_app_secret
        echo TIKTOK_CLIENT_ID=seu_client_id
        echo YOUTUBE_CLIENT_ID=seu_client_id
        echo GEMINI_API_KEY=sua_chave_gemini
        echo.
        echo # ==================== MERCADO PAGO ====================
        echo MERCADOPAGO_ACCESS_TOKEN=seu_token
        echo MERCADOPAGO_PUBLIC_KEY=sua_public_key
        echo MERCADOPAGO_MODE=production
        echo.
        echo # ==================== APP ====================
        echo APP_URL=https://seu-dominio.com.br
        echo CORS_ORIGIN=https://seu-dominio.com.br
    ) > .env.local
    
    echo [OK] Arquivo .env.local criado
    echo [!] EDITE O ARQUIVO COM SUAS CREDENCIAIS:
    echo     !APP_DIR!\.env.local
) else (
    echo [OK] Arquivo .env.local ja existe
)
echo.

REM =============================================================================
REM PASSO 4: Build da Aplicação
REM =============================================================================

echo [PASSO 4] Compilando Aplicacao
echo.

REM Build Backend
cd backend
echo [INFO] Compilando backend...
call npm run build
if %errorlevel% neq 0 (
    echo [AVISO] Erro ao compilar backend
)
cd ..

REM Build Frontend
echo [INFO] Compilando frontend...
call npm run build
if %errorlevel% neq 0 (
    echo [AVISO] Erro ao compilar frontend
)

echo [OK] Aplicacao compilada
echo.

REM =============================================================================
REM PASSO 5: Instruções Finais
REM =============================================================================

echo.
echo ======================================================================
echo          ^!^!^! INSTALACAO CONCLUIDA ^!^!^!
echo ======================================================================
echo.

echo [PROXIMOS PASSOS]
echo.
echo 1. EDITAR .env.local COM SUAS CREDENCIAIS
echo    Arquivo: !APP_DIR!\.env.local
echo.
echo 2. CRIAR BANCO DE DADOS NA HOSTINGER
echo    - Acessar cPanel
echo    - MySQL Databases
echo    - Nome: socialflow_db
echo    - Usuario: sf_user
echo    - Senha: algo_seguro
echo.
echo 3. FAZER UPLOAD PARA HOSTINGER
echo    via FTP/SFTP os arquivos:
echo    - /dist (frontend compilado)
echo    - /backend/dist (backend compilado)
echo    - /node_modules (ou instalar na servidor)
echo    - /.env.local (com credenciais)
echo.
echo 4. CONECTAR VIA SSH NA HOSTINGER
echo    ssh seu_usuario@seu-dominio.com.br
echo.
echo 5. INSTALAR DEPENDENCIAS NA HOSTINGER
echo    cd public_html/socialflow
echo    npm install --production
echo.
echo 6. INICIAR COM PM2
echo    npm install -g pm2
echo    pm2 start backend/dist/main.js --name "socialflow-backend"
echo    pm2 save
echo    pm2 startup
echo.
echo 7. ACESSAR APLICACAO
echo    https://seu-dominio.com.br
echo.

echo [FERRAMENTAS NECESSARIAS]
echo - FTP/SFTP Client: FileZilla (https://filezilla-project.org)
echo - SSH Client: PuTTY (https://www.putty.org) ou use PowerShell
echo - Editor: VS Code (https://code.visualstudio.com)
echo.

echo [MONITORAMENTO NA HOSTINGER]
echo - Ver logs:      pm2 logs
echo - Ver status:    pm2 list
echo - Restart:       pm2 restart all
echo - Stop:          pm2 stop all
echo.

echo [DOCUMENTACAO]
echo Guia completo: HOSTINGER_SETUP.md
echo Deployment: DEPLOYMENT.md
echo Database: DATABASE_SETUP.md
echo.

pause
