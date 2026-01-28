# 🚀 Fazer Upload para GitHub

## ❌ Status Atual
- Projeto está **LOCAL** em `c:\Users\Nitro\Downloads\socialflow-ai`
- **NÃO** está no GitHub

## ✅ Como Publicar no GitHub

### Passo 1: Criar Repositório no GitHub

1. Ir para https://github.com/new
2. Nome do repositório: `socialflow-ai`
3. Descrição: `SocialFlow AI - Social Media Marketing Automation`
4. Deixar como **Public** (ou Private)
5. Clicar em "Create repository"

**Resultado**: Você terá uma URL como:
```
https://github.com/seu-usuario/socialflow-ai
```

---

### Passo 2: Instalar Git no Windows

Se não tiver Git:

**Opção 1: Baixar e Instalar**
```
https://git-scm.com/download/win
```

**Opção 2: Via PowerShell (como admin)**
```powershell
winget install Git.Git
```

Verificar instalação:
```powershell
git --version
```

---

### Passo 3: Configurar Git (Primeira Vez)

```powershell
git config --global user.name "Seu Nome"
git config --global user.email "seu-email@gmail.com"
git config --global user.password "seu-token-github"
```

---

### Passo 4: Inicializar Repositório Local

```powershell
cd c:\Users\Nitro\Downloads\socialflow-ai

# Inicializar git
git init

# Adicionar remote
git remote add origin https://github.com/seu-usuario/socialflow-ai.git

# Verificar
git remote -v
```

---

### Passo 5: Fazer Primeiro Commit

```powershell
# Adicionar todos os arquivos
git add .

# Criar commit
git commit -m "Initial commit - SocialFlow AI deployment ready"

# Fazer push para GitHub
git push -u origin main
```

**Se der erro "branch 'main' não existe"**:
```powershell
git branch -M main
git push -u origin main
```

---

## 🔑 Autenticação GitHub

### Usando Token (Recomendado)

1. GitHub → Settings → Developer settings → Personal access tokens
2. Clicar "Generate new token"
3. Nome: `SocialFlow Deployment`
4. Selecionar: `repo` (full control)
5. Copiar o token

Na primeira vez que fizer push, será solicitado:
- Username: `seu-usuario-github`
- Password: `cole-o-token-aqui`

---

## 📋 Checklist de Upload

- [ ] Criar repositório no GitHub
- [ ] Instalar Git no Windows
- [ ] Configurar user.name e user.email
- [ ] Gerar token pessoal
- [ ] `git init` no diretório
- [ ] `git remote add origin https://...`
- [ ] `git add .`
- [ ] `git commit -m "Initial commit"`
- [ ] `git push -u origin main`

---

## ✨ Próximos Passos (Após Upload)

### 1. Configure Auto-Deploy com Webhook
```
1. GitHub → Settings → Webhooks → Add webhook
2. Payload URL: https://seu-dominio.com.br/api/webhook/deploy.php
3. Content type: application/json
4. Secret: seu_webhook_secret_aleatorio
5. Selecionar "Just the push event"
6. Clicar "Add webhook"
```

**Resultado**: Cada `git push` faz deploy automático na Hostinger!

### 2. Configure GitHub Actions (CI/CD)
Criar arquivo `.github/workflows/deploy.yml`:
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
        run: npm run build
      - name: Deploy
        run: # seu script de deploy
```

### 3. Compartilhar Repositório
Agora você pode:
- ✅ Compartilhar link do repo
- ✅ Colaborar com outros desenvolvedores
- ✅ Fazer backups automáticos
- ✅ Histórico de todas as mudanças
- ✅ Pull requests para features

---

## 📊 Comandos Git Essenciais

```bash
# Status
git status

# Ver histórico
git log

# Ver branches
git branch -a

# Criar nova branch
git checkout -b feature/nova-feature

# Fazer push de mudanças
git add .
git commit -m "Descrição da mudança"
git push

# Atualizar local
git pull origin main

# Ver remotes
git remote -v
```

---

## 🎯 Benefícios de Usar GitHub

✅ Backup automático da nuvem  
✅ Versionamento de código  
✅ Histórico de mudanças  
✅ Colaboração com equipe  
✅ Integração com CI/CD  
✅ Deploy automático  
✅ Issues e pull requests  
✅ Grátis para projetos públicos  

---

## 💡 Dica Pro

Depois que GitHub está configurado, você pode:

1. **Deploy automático com webhook**
   ```
   git push → GitHub recebe → Webhook ativa → Deploy na Hostinger
   ```

2. **Trabalhar em features separadas**
   ```
   git checkout -b feature/nova-feature
   # fazer mudanças
   git commit -m "Descrição"
   git push -u origin feature/nova-feature
   # Criar pull request no GitHub
   ```

3. **Reverter mudanças fácil**
   ```
   git revert HEAD  # Desfaz último commit
   ```

---

**Quer fazer upload agora? Siga os passos acima!** 🚀
