@echo off
REM ============================================================================
REM SocialFlow AI - Git Upload to GitHub
REM ============================================================================

setlocal enabledelayedexpansion

echo.
echo ======================================================================
echo         Configurando Git e Upload para GitHub
echo ======================================================================
echo.

cd /d "c:\Users\Nitro\Downloads\socialflow-ai"

REM Configure git
echo [1/5] Configurando Git...
"C:\Program Files\Git\cmd\git.exe" config user.name "SocialFlow Developer"
"C:\Program Files\Git\cmd\git.exe" config user.email "admin@socialflow.com"
"C:\Program Files\Git\cmd\git.exe" config --list | findstr "user."
echo [OK] Git configurado
echo.

REM Add all files
echo [2/5] Adicionando arquivos...
"C:\Program Files\Git\cmd\git.exe" add .
echo [OK] Arquivos adicionados
echo.

REM Create first commit
echo [3/5] Criando primeiro commit...
"C:\Program Files\Git\cmd\git.exe" commit -m "Initial commit - SocialFlow AI deployment ready with 14 modules, Mercado Pago integration, and complete Hostinger automation kit"
echo [OK] Commit criado
echo.

REM Show git status
echo [4/5] Status do Git:
"C:\Program Files\Git\cmd\git.exe" status
echo.

REM Show log
echo [5/5] Histórico:
"C:\Program Files\Git\cmd\git.exe" log --oneline -5
echo.

echo ======================================================================
echo PROXIMO PASSO: Fazer Upload para GitHub
echo ======================================================================
echo.
echo 1. Criar repositorio vazio em: https://github.com/new
echo    Nome: socialflow-ai
echo    Tipo: Public ou Private
echo.
echo 2. Gerar token em: https://github.com/settings/tokens
echo    - Click em "Generate new token"
echo    - Selecione "repo" (full control)
echo    - Copie o token
echo.
echo 3. Execute este comando (substitua os valores):
echo.
echo    git remote add origin https://USUARIO:TOKEN@github.com/USUARIO/socialflow-ai.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo Exemplo:
echo    git remote add origin https://seu-usuario:ghp_abc123xyz@github.com/seu-usuario/socialflow-ai.git
echo    git branch -M main
echo    git push -u origin main
echo.
echo ======================================================================
echo.

pause
