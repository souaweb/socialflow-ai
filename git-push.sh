#!/bin/bash
# SocialFlow AI - Push to GitHub

cd "c:\Users\Nitro\Downloads\socialflow-ai"

echo "[1/3] Adicionando arquivos..."
"C:\Program Files\Git\cmd\git.exe" add .

echo "[2/3] Criando commit..."
"C:\Program Files\Git\cmd\git.exe" commit -m "Initial commit - SocialFlow AI deployment ready with 14 modules, Mercado Pago integration, and Hostinger automation kit"

echo "[3/3] Push para GitHub..."
echo ""
echo "Execute este comando quando criar o repositório:"
echo "git remote add origin https://souaweb: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@github.com/souaweb/socialflow-ai.git"
echo "git branch -M main"
echo "git push -u origin main"
