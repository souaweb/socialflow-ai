# 📋 HOSTINGER DEPLOYMENT CHECKLIST

## 🚀 PRÉ-DEPLOYMENT

### Conta e Domínio
- [ ] Conta Hostinger criada (hostinger.com.br)
- [ ] Plano adquirido (Cloud Startup ou superior)
- [ ] Domínio registrado
- [ ] Domínio apontado para Hostinger (Nameservers configurados)
- [ ] Acesso SSH ativado
- [ ] Credenciais SSH salvas com segurança

### Ambiente Local
- [ ] Código atualizado e testado localmente
- [ ] Git repository criado e sincronizado
- [ ] .env.local criado e configurado
- [ ] npm install executado (zero warnings)
- [ ] npm run build executou com sucesso
- [ ] Aplicação testada localmente em http://localhost:3000

### Credenciais Obtidas
- [ ] Meta API (Facebook/Instagram)
  - App ID: ________________
  - App Secret: ________________
  
- [ ] TikTok API
  - Client ID: ________________
  - Client Secret: ________________
  
- [ ] YouTube API
  - API Key: ________________
  
- [ ] Gemini AI
  - API Key: ________________
  
- [ ] Mercado Pago
  - Access Token: ________________
  - Public Key: ________________

### Banco de Dados
- [ ] MySQL Database criado: `socialflow_db`
- [ ] MySQL User criado: `sf_user`
- [ ] Senha MySQL gerada e salva
- [ ] User associado ao database com ALL PRIVILEGES

---

## 🔧 DEPLOYMENT HOSTINGER

### Passo 1: Preparação SSH
- [ ] Conectado via SSH ao servidor Hostinger
- [ ] Verificado Node.js: `node --version`
- [ ] Verificado npm: `npm --version`
- [ ] Verificado Git: `git --version`
- [ ] Diretório público criado: `~/public_html/socialflow/`

### Passo 2: Deploy de Código
- [ ] Repositório clonado: `git clone https://github.com/seu-usuario/socialflow-ai.git socialflow`
- [ ] Branch correta: `git checkout main`
- [ ] .env.local copiado e configurado
  - DATABASE_HOST: `localhost`
  - DATABASE_USER: `sf_user`
  - DATABASE_PASSWORD: [INSERIR]
  - DATABASE_NAME: `socialflow_db`
  - JWT_SECRET: [GERAR NOVO]
  - META_APP_ID: [INSERIR]
  - META_APP_SECRET: [INSERIR]
  - TIKTOK_CLIENT_ID: [INSERIR]
  - YOUTUBE_CLIENT_ID: [INSERIR]
  - GEMINI_API_KEY: [INSERIR]
  - MERCADOPAGO_ACCESS_TOKEN: [INSERIR]
  - MERCADOPAGO_PUBLIC_KEY: [INSERIR]

### Passo 3: Instalar Dependências
- [ ] npm install --legacy-peer-deps --production (frontend)
- [ ] cd backend && npm install --legacy-peer-deps --production
- [ ] npm install --production completado sem erros críticos

### Passo 4: Build
- [ ] npm run build (compilação frontend bem-sucedida)
- [ ] cd backend && npm run build (compilação backend bem-sucedida)
- [ ] Arquivos dist/ criados em ambos diretórios

### Passo 5: Banco de Dados
- [ ] Conectado ao MySQL: `mysql -u sf_user -p socialflow_db`
- [ ] Tables criadas (se necessário)
- [ ] Dados iniciais inseridos (usuários teste)
- [ ] Backup inicial realizado

### Passo 6: PM2 Setup
- [ ] PM2 instalado globalmente: `npm install -g pm2`
- [ ] ecosystem.config.js criado
- [ ] Aplicação iniciada: `pm2 start ecosystem.config.js`
- [ ] PM2 salvo: `pm2 save`
- [ ] Startup automático configurado: `pm2 startup`

### Passo 7: Reverse Proxy (Apache)
- [ ] .htaccess criado em `~/public_html/`
- [ ] RewriteEngine ativado
- [ ] Proxy para localhost:3001 configurado
- [ ] Redirecionamento HTTP→HTTPS ativado
- [ ] Teste de proxy: curl -I http://localhost:3001

### Passo 8: SSL/HTTPS
- [ ] AutoSSL ativado no cPanel Hostinger
- [ ] Certificado SSL gerado para domínio
- [ ] HTTPS funcionando: https://seu-dominio.com.br
- [ ] Redirect automático de HTTP para HTTPS

### Passo 9: Testes de Conectividade
- [ ] Frontend carregando em https://seu-dominio.com.br
- [ ] API respondendo em https://seu-dominio.com.br/api/health
- [ ] Banco de dados conectado
- [ ] Logs do PM2 sem erros: `pm2 logs`
- [ ] Memória/CPU dentro do normal: `pm2 monit`

---

## ✅ PÓS-DEPLOYMENT

### Verificações de Produção
- [ ] Aplicação acessível via domínio
- [ ] SSL funcionando (sem erros de certificado)
- [ ] Usuário admin criado
- [ ] Login funcionando
- [ ] Integrações de API testadas
- [ ] Webhook do Mercado Pago testado
- [ ] Email de notificação enviado com sucesso
- [ ] Storage de arquivos funcionando
- [ ] Rate limiting ativo

### Monitoramento
- [ ] PM2 monitorando processo
- [ ] Logs sendo gravados em ./logs/
- [ ] Alertas de erro configurados
- [ ] Backup automático agendado
- [ ] Estatísticas de CPU/Memória verificadas

### Segurança
- [ ] .env.local não expostos em git (.gitignore)
- [ ] JWT_SECRET é valor único e forte
- [ ] Senhas do banco não estão no código
- [ ] API keys estão em .env.local
- [ ] CORS_ORIGIN configurado apenas para seu domínio
- [ ] HTTPS forçado em todos os endpoints
- [ ] SQL Injection protegido (ORM usado)
- [ ] CSRF protection ativado

### Backup e Recuperação
- [ ] Script de backup criado e testado
- [ ] Backup automático agendado (cron)
- [ ] Backup do banco de dados funcionando
- [ ] Restauração testada a partir do backup
- [ ] Local de armazenamento de backup seguro

### Documentação
- [ ] HOSTINGER_GUIA_COMPLETO.md lido e entendido
- [ ] Credenciais documentadas em local seguro (gestor de senhas)
- [ ] Procedimentos de manutenção documentados
- [ ] Contatos de suporte salvos
- [ ] Playbook de troubleshooting criado

---

## 💰 MONETIZAÇÃO

### Planos de Assinatura
- [ ] Plano Básico criado (R$99.90/mês)
- [ ] Plano Profissional criado (R$299.90/mês)
- [ ] Plano Enterprise criado (R$999.90/mês)
- [ ] Limites de cada plano configurados
- [ ] Descrição de features clara

### Integração Mercado Pago
- [ ] Conta Mercado Pago criada (mercadopago.com.br)
- [ ] Acesso Token obtido e adicionado em .env
- [ ] Public Key obtida e adicionada em .env
- [ ] Webhook do Mercado Pago configurado
- [ ] Página de checkout testada
- [ ] PIX funcionando
- [ ] Cartão de crédito funcionando
- [ ] Boleto funcionando

### Primeiras Transações
- [ ] Primeira cobrança realizada com sucesso
- [ ] Cliente recebeu confirmação de pagamento
- [ ] Acesso ao plano ativado automaticamente
- [ ] Email de boas-vindas enviado
- [ ] Dashboard do cliente mostrando features disponíveis

### Email e Comunicação
- [ ] Email de suporte configurado (support@seu-dominio.com.br)
- [ ] Email de noreply configurado (noreply@seu-dominio.com.br)
- [ ] Template de email de boas-vindas testado
- [ ] Template de notificação de pagamento testado
- [ ] Emails sendo entregues normalmente (verificar SPAM)

---

## 🎯 MÉTRICAS DE SUCESSO

### 1ª Semana
- [ ] Aplicação online 24/7 sem downtime
- [ ] Latência de resposta < 2 segundos
- [ ] CPU usage < 30%
- [ ] Memory usage < 50%
- [ ] 0 erros críticos nos logs

### 1º Mês
- [ ] Primeiro cliente pagante
- [ ] MRR (Monthly Recurring Revenue) > R$ 0
- [ ] Taxa de retenção medida
- [ ] Feedback de clientes coletado

### 3 Meses
- [ ] 10+ clientes ativos
- [ ] MRR > R$ 1.000,00
- [ ] Churn rate < 5%
- [ ] NPS > 7

---

## 🔄 MANUTENÇÃO PERIÓDICA

### Diariamente
- [ ] Verificar logs de erro: `pm2 logs | grep ERROR`
- [ ] Monitorar CPU/Memory: `pm2 monit`
- [ ] Verificar status: `pm2 status`

### Semanalmente
- [ ] Backup do banco de dados
- [ ] Revisar logs de transações
- [ ] Verificar espaço em disco: `df -h`
- [ ] Monitorar churn de clientes

### Mensalmente
- [ ] Atualizar dependências
- [ ] Revisar segurança
- [ ] Analisar métricas de negócio
- [ ] Planejar features novas

### Trimestralmente
- [ ] Audit de segurança completo
- [ ] Revisão de performance
- [ ] Planejar scaling
- [ ] Revisar roadmap com clientes

---

## 📞 CONTATOS DE EMERGÊNCIA

### Hostinger Support
- Chat: https://support.hostinger.com.br
- Email: support@hostinger.com.br
- Telefone: [verificar no painel]

### Mercado Pago Support
- Site: https://www.mercadopago.com.br
- Email: developers@mercadolibre.com
- Forum: https://developers.mercadopago.com

### Seu Suporte
- Email: support@seu-dominio.com.br
- WhatsApp: [opcional]
- Docs: HOSTINGER_GUIA_COMPLETO.md

---

## 📝 NOTAS

```
[Adicione aqui suas notas pessoais durante o deployment]

Ex:
- Database password: [SALVO EM GESTOR DE SENHAS]
- JWT Secret: [GERADO ALEATORIAMENTE]
- Primeiro admin criado em: [DATA/HORA]
- Servidor respondendo normalmente
- SSL certificate válido até: [DATA]
```

---

## ✨ PARABÉNS!

Quando TODO os itens acima estiverem marcados com ✅, você está pronto para:

✅ Aceitar clientes  
✅ Processar pagamentos  
✅ Publicar anúncios  
✅ Ganhar dinheiro  

**Boa sorte! 🚀**
