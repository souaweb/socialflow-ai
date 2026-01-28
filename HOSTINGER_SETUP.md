# 🌐 GUIA DE PUBLICAÇÃO NA HOSTINGER

## 📋 Resumo Rápido (5 minutos)

```
Hostinger → cPanel → SSH → Instalador → Pronto!
```

---

## PASSO 1: Contratação Hostinger (Se não tiver)

### 1.1 Escolher Plano
- **Para começar:** Plano Shared Starter ($5.99/mês)
- **Recomendado:** Plano Premium ($9.99/mês) - mais recursos

### 1.2 Registrar Domínio
- Registrar `seu-app.com.br` ou `seu-app.dev`
- Custo: ~R$50/ano

### 1.3 Confirmar Dados
- Email de acesso
- Senha Hostinger
- Domínio apontado

---

## PASSO 2: Acessar cPanel

### 2.1 Login
1. Ir para `seu-dominio.com.br/cpanel`
2. Usar email e senha da Hostinger
3. Clicar em "cPanel"

### 2.2 Interface cPanel
```
Home → File Manager → Terminal
       Database → User Accounts
       Email → Addon Domains
```

---

## PASSO 3: Configurar SSH

### 3.1 Gerar Chave SSH (Recomendado)
1. cPanel → SSH Access
2. Gerar Public Key
3. Salvar Private Key

### 3.2 Conectar via SSH

**Windows (PowerShell):**
```powershell
# Salvar chave privada em C:\Users\seu_usuario\.ssh\id_rsa

ssh -i "C:\Users\seu_usuario\.ssh\id_rsa" seu_cpanel_user@seu-dominio.com.br
```

**Mac/Linux:**
```bash
# Salvar chave em ~/.ssh/id_rsa e dar permissão
chmod 600 ~/.ssh/id_rsa

ssh -i ~/.ssh/id_rsa seu_cpanel_user@seu-dominio.com.br
```

---

## PASSO 4: Instalar Node.js via cPanel

### 4.1 Via Interface cPanel
1. cPanel → Software → Node.js Selector
2. Versão recomendada: **18.x LTS**
3. Clicar "Install"

### 4.2 Ou via SSH
```bash
# Verificar versão disponível
nvm list-remote

# Instalar
nvm install 18
nvm use 18
```

---

## PASSO 5: Criar Banco de Dados

### 5.1 Via cPanel
1. cPanel → Databases → MySQL Databases
2. Nome do banco: `seu_cpanel_user_socialflow`
3. Usuário: `seu_cpanel_user_sf_user`
4. Senha: Usar geradora de senhas
5. Adicionar privilégios ALL

### 5.2 Anotar Credenciais
```
Host: localhost
User: seu_cpanel_user_sf_user
Password: senha_gerada
Database: seu_cpanel_user_socialflow
```

---

## PASSO 6: Executar Instalador

### 6.1 Via SSH
```bash
# 1. Conectar via SSH
ssh seu_usuario@seu-dominio.com.br

# 2. Ir para home
cd ~

# 3. Clonar e executar instalador
git clone https://github.com/seu-usuario/socialflow-ai.git
cd socialflow-ai

chmod +x install-hostinger.sh
./install-hostinger.sh
```

### 6.2 Responder às Perguntas
```
[INFO] Verificando pré-requisitos...
[✓] Node.js encontrado
[✓] npm encontrado
[INFO] Configurando repositório...
[INFO] Deseja configurar .env.local agora? (s/n) s
[INFO] Deseja criar tabelas no banco? (s/n) s
```

### 6.3 Aguardar Instalação
- ⏱️ Duração: ~3-5 minutos
- ✅ Verá mensagens de sucesso

---

## PASSO 7: Configurar .env.local

### 7.1 Editar arquivo
```bash
# Via nano
nano ~/.socialflow-ai/.env.local

# Ou via cPanel File Manager
```

### 7.2 Preencher Valores
```env
# Database (do PASSO 5)
DATABASE_HOST=localhost
DATABASE_USER=seu_cpanel_user_sf_user
DATABASE_PASSWORD=sua_senha_gerada
DATABASE_NAME=seu_cpanel_user_socialflow

# APIs (obter credenciais)
META_APP_ID=seu_app_id
META_APP_SECRET=seu_app_secret
TIKTOK_CLIENT_ID=seu_client_id
YOUTUBE_CLIENT_ID=seu_client_id
GEMINI_API_KEY=sua_api_key

# Mercado Pago
MERCADOPAGO_ACCESS_TOKEN=seu_token
MERCADOPAGO_PUBLIC_KEY=sua_public_key
```

### 7.3 Salvar
```bash
# Tecla Ctrl+X (sair)
# Digitar Y (salvar)
# Pressionar Enter
```

---

## PASSO 8: Configurar Domínio

### 8.1 Apontar para Public HTML
```bash
# Ir para public_html
cd ~/public_html

# Remover arquivos padrão
rm -rf index.html

# Criar link simbólico
ln -s ~/socialflow-ai .
```

### 8.2 Ou Criar Addon Domain
1. cPanel → Addon Domains
2. Domain: `seu-dominio.com.br`
3. Document Root: `public_html/socialflow`
4. Criar Domain

---

## PASSO 9: Configurar SSL/HTTPS

### 9.1 Via cPanel (Automático)
1. cPanel → SSL/TLS Status
2. Instalar AutoSSL
3. Aguardar ~5 minutos

### 9.2 Verificar HTTPS
```bash
https://seu-dominio.com.br
# Deve aparecer cadeado verde 🔒
```

---

## PASSO 10: Verificar Status

### 10.1 Ver Processos
```bash
pm2 list
pm2 logs
pm2 status
```

### 10.2 Testar Aplicação
```bash
# Testar API
curl https://seu-dominio.com.br/auth/health

# Esperado: {"status":"ok"}
```

### 10.3 Acessar App
```
https://seu-dominio.com.br
```

---

## 🎯 TROUBLESHOOTING

### Problema: "Comando não encontrado"
```bash
# Carregar Node.js
source ~/.nvm/nvm.sh
nvm use 18

# Tentar novamente
npm run dev
```

### Problema: "Porta 3001 já em uso"
```bash
# Encontrar processo
lsof -i :3001

# Matar processo
kill -9 <PID>

# Reiniciar
pm2 restart all
```

### Problema: "Banco não conecta"
```bash
# Verificar credenciais .env.local
# Testar conexão MySQL
mysql -h localhost -u usuario -p database_name

# Se funcionar, digite QUIT
```

### Problema: "Permissão negada"
```bash
# Corrigir permissões
chmod -R 755 ~/socialflow-ai
chmod 644 ~/socialflow-ai/.env.local
```

### Problema: "Mercado Pago retorna erro"
```
✅ Modo sandbox: Usar dados de teste
✅ Modo production: Usar credenciais reais

Se erro de autenticação:
1. Ir para https://www.mercadopago.com.br
2. Settings → API Keys
3. Copiar Access Token novamente
4. Atualizar .env.local
```

---

## 📊 MONITORAMENTO

### Ver Logs
```bash
# Logs em tempo real
pm2 logs

# Apenas backend
pm2 logs socialflow-backend

# Apenas frontend
pm2 logs socialflow-frontend
```

### Ver Uso de Recursos
```bash
# CPU e Memória
pm2 monit

# Detalhar
pm2 describe socialflow-backend
```

### Reiniciar Aplicação
```bash
# Reiniciar tudo
pm2 restart all

# Reiniciar apenas backend
pm2 restart socialflow-backend

# Parar tudo
pm2 stop all

# Iniciar tudo
pm2 start all
```

---

## 💾 BACKUPS

### Backup do Banco
```bash
# Via SSH
mysqldump -h localhost -u usuario -p database > backup.sql

# Salvar arquivo
scp backup.sql seu-usuario@seu-dominio.com.br:~/backups/
```

### Backup de Arquivos
```bash
# Comprimir
tar -czf socialflow-backup.tar.gz ~/socialflow-ai

# Download
scp seu-usuario@seu-dominio.com.br:~/socialflow-backup.tar.gz .
```

### Restaurar Banco
```bash
# Restaurar de backup
mysql -h localhost -u usuario -p database < backup.sql
```

---

## 🚀 PRÓXIMOS PASSOS

### 1️⃣ Testar Funcionalidades
```
Dashboard → Planos → Contratar Plano
           → Conectar Rede Social
           → Publicar Post
           → Verificar Pagamento Mercado Pago
```

### 2️⃣ Adicionar Domínio Customizado
```
cPanel → Addon Domains → Configurar novo domínio
```

### 3️⃣ Configurar Email
```
cPanel → Email Accounts → Criar contas de suporte
cPanel → Email Forwarders → Redirecionar emails
```

### 4️⃣ Configurar Certificado SSL Premium
```
cPanel → SSL/TLS Status → Let's Encrypt (gratuito)
ou
cPanel → SSL/TLS Status → Certificado pago
```

### 5️⃣ Setup de Email Transacional
```
Adicionar: SendGrid ou Brevo para enviar emails de confirmação
```

---

## 💰 COMEÇAR A GANHAR DINHEIRO

### Passo 1: Listar Aplicação
- Site de divulgação de startups
- ProductHunt
- LinkedIn

### Passo 2: Primeira Campanha
- Email marketing
- Posts em redes sociais
- Anúncios Google Ads (R$100)

### Passo 3: Acompanhar
```
Dashboard → Analytics → Ver conversões
           → Revenue → Ver ganhos
```

---

## 📞 SUPORTE HOSTINGER

Se tiver problemas:
1. Hostinger Live Chat: 24/7 disponível
2. Verificar Status: https://status.hostinger.com
3. Base de conhecimento: https://support.hostinger.com

---

**🎉 Parabéns! Sua aplicação está publicada! 🚀**

Agora é só ganhar dinheiro e escalar!
