# 🚀 SocialFlow AI - Deploy Hostinger (Kit Completo)

Parabéns! Você agora tem tudo que precisa para publicar sua aplicação na Hostinger e começar a ganhar dinheiro! 

## 📦 Arquivos Inclusos

### 1. **Scripts de Instalação**
- `install-hostinger.bat` - Instalador para Windows (local)
- `hostinger-quickstart.sh` - Instalador rápido para Hostinger via SSH

### 2. **Guias Passo a Passo**
- `HOSTINGER_GUIA_COMPLETO.md` - Guia detalhado em português (150+ passos)
- `HOSTINGER_DEPLOYMENT_CHECKLIST.md` - Checklist para não esquecer nada

### 3. **Ferramentas de Monitoramento**
- `hostinger-monitor.sh` - Ferramenta interativa de diagnóstico
- `api/webhook/deploy.php` - Auto-deploy via GitHub webhook

## ⚡ Quickstart (5 minutos)

### Opção 1: Via Windows Local

```batch
# 1. Abra PowerShell e execute:
cd c:\Users\seu_usuario\Downloads\socialflow-ai
.\install-hostinger.bat

# 2. Siga as instruções na tela
# 3. Configure o arquivo .env.local
# 4. Faça upload via FTP para Hostinger
```

### Opção 2: Via SSH na Hostinger (Recomendado)

```bash
# 1. Conecte via SSH
ssh seu_usuario@seu-dominio.com.br

# 2. Execute o quickstart
cd ~/public_html
git clone https://github.com/seu-usuario/socialflow-ai.git socialflow
cd socialflow
chmod +x hostinger-quickstart.sh
./hostinger-quickstart.sh

# 3. Pronto! Sua app está rodando
```

## 📋 Procedimento Passo a Passo

### Passo 1: Preparação (5 minutos)
1. Crie conta em hostinger.com.br
2. Contrate plano Cloud Startup (R$29.90/mês)
3. Registre seu domínio
4. Ative SSH no cPanel

### Passo 2: Database (5 minutos)
1. Vá para cPanel → MySQL Databases
2. Crie banco: `socialflow_db`
3. Crie usuário: `sf_user`
4. Associe com ALL PRIVILEGES

### Passo 3: Deploy (5 minutos)
1. Conecte via SSH
2. Execute `./hostinger-quickstart.sh`
3. Configure .env.local com suas credenciais
4. Aguarde compilação (2-3 minutos)
5. Acesse https://seu-dominio.com.br

## 🔑 Credenciais Necessárias

Você vai precisar de:
- **Meta API** (Facebook/Instagram)
  - App ID e App Secret
- **TikTok API**
  - Client ID e Secret
- **YouTube API**
  - API Key
- **Gemini AI**
  - API Key do Google
- **Mercado Pago**
  - Access Token e Public Key
- **Banco de Dados**
  - Host, User, Password, Database

## 🛠️ Ferramentas de Suporte

### Ver Status da Aplicação
```bash
ssh seu_usuario@seu-dominio.com.br
cd ~/public_html/socialflow
./hostinger-monitor.sh
```

### Ver Logs em Tempo Real
```bash
pm2 logs socialflow-backend
```

### Fazer Restart
```bash
pm2 restart socialflow-backend
```

### Ver Uso de Recursos
```bash
pm2 monit
```

## 💰 Monetização Ativa

Sua aplicação já está pronta para:
- ✅ Aceitar assinaturas via Mercado Pago (PIX, Boleto, Cartão)
- ✅ Cobrar R$99, R$299 ou R$999/mês
- ✅ Processar pagamentos automaticamente
- ✅ Ativar features por plano

## 🐛 Troubleshooting

### Aplicação não abre
```bash
pm2 logs socialflow-backend
# Ver os erros e corrigir
```

### Porta 3001 em uso
```bash
lsof -i :3001
kill -9 PID
pm2 restart socialflow-backend
```

### Banco de dados não conecta
```bash
# Verificar credenciais em .env.local
nano .env.local

# Testar conexão
mysql -u sf_user -h localhost -p socialflow_db
```

### Erro de SSL/HTTPS
```bash
# Ativar AutoSSL no cPanel
# Ou usar Let's Encrypt
```

## 📊 Monitoramento

### Checklist Diário
- [ ] Verificar logs: `pm2 logs`
- [ ] Ver status: `pm2 status`
- [ ] Monitorar memória: `pm2 monit`
- [ ] Revisar erros: grep ERROR logs/error.log

### Backup Automático
```bash
# Fazer backup manual
mysqldump -u sf_user -p socialflow_db > backup.sql

# Restaurar
mysql -u sf_user -p socialflow_db < backup.sql
```

## 🎯 Próximos Passos

1. **Publicar no GitHub** (se não tiver)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/seu-usuario/socialflow-ai.git
   git push -u origin main
   ```

2. **Configurar Auto-Deploy**
   - GitHub → Settings → Webhooks
   - URL: `https://seu-dominio.com.br/api/webhook/deploy.php`
   - Selecionar "Just the push event"
   - Agora a cada push, seu site atualiza automaticamente!

3. **Criar Planos de Monetização**
   - Editar `components/CheckoutModal.tsx`
   - Adicionar seus planos
   - Testar pagamentos

4. **Divulgar Sua Solução**
   - Criar landing page atrativa
   - Usar seu próprio app para postar sobre ele 😎
   - Ativar programa de afiliados

## 📞 Suporte

### Documentação
- Guia completo: `HOSTINGER_GUIA_COMPLETO.md`
- Checklist: `HOSTINGER_DEPLOYMENT_CHECKLIST.md`
- Database: `DATABASE_SETUP.md`
- Deployment: `DEPLOYMENT.md`

### Hostinger Support
- Chat: https://support.hostinger.com.br
- Email: support@hostinger.com.br

### Comunidade
- Issues: https://github.com/seu-usuario/socialflow-ai/issues
- Discussões: https://github.com/seu-usuario/socialflow-ai/discussions

## 🎉 Parabéns!

Quando sua aplicação estiver rodando na Hostinger, você terá:

✅ **Aplicação online 24/7**  
✅ **Processamento de pagamentos**  
✅ **Publicação em múltiplos canais**  
✅ **IA para criar conteúdo**  
✅ **CRM e analytics**  
✅ **Automações e webhooks**  

**Comece a ganhar dinheiro agora!** 💰

---

## 📝 Versão

- **Aplicação**: SocialFlow AI v1.0
- **Data**: 2024
- **Status**: Pronto para Produção ✅
- **Hospedagem**: Hostinger (Cloud Startup)
- **Gateway de Pagamento**: Mercado Pago

---

## 🔒 Segurança

Lembre-se:
- ✅ Nunca commitar .env.local no git
- ✅ Usar senhas fortes no banco de dados
- ✅ Ativar SSL/HTTPS
- ✅ Fazer backups regulares
- ✅ Monitorar logs de erro
- ✅ Atualizar dependências regularmente

---

**Boa sorte! 🚀 Seu futuro financeiro começa agora!**
