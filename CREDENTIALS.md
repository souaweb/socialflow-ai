# 🔐 Credenciais de Acesso - SocialFlow AI

## 👤 Usuário Admin Padrão

### Email de Login
```
admin@socialflow.com
```

### Senha Padrão
```
Si173016#
```

**IMPORTANTE**: Use esta senha para o primeiro acesso. Você pode alterar depois em Settings.

1. **Na primeira execução**, usar o endpoint de registro:
   ```
   POST /api/auth/register
   Body: {
     "email": "admin@socialflow.com",
     "password": "sua_senha_forte_aqui",
     "name": "Admin SocialFlow"
   }
   ```

2. **OU executar um script de migration** para resetar:
   ```sql
   -- No banco de dados:
   UPDATE users 
   SET password_hash = bcrypt('sua_nova_senha')
   WHERE email = 'admin@socialflow.com';
   ```

3. **OU usar o endpoint de reset**:
   ```
   POST /api/auth/reset-password
   Body: {
     "email": "admin@socialflow.com",
     "newPassword": "sua_nova_senha"
   }
   ```

---

## 🧪 Usuário de Teste (Opcional)

### Email
```
test@socialflow.com
```

### Usualmente para
- Testes de integração
- Testes de fluxo de pagamento
- Desenvolvimento local

---

## 🎯 Primeiro Acesso

### Na Hostinger:

1. **Acessar a aplicação**
   ```
   https://seu-dominio.com.br
   ```

2. **Fazer login**
   - Email: `admin@socialflow.com`
   - Senha: A que você definir

3. **Se esqueceu a senha**, usar:
   ```
   https://seu-dominio.com.br/forgot-password
   ```

---

## 🔄 Criar Novo Admin

Se precisar criar outro usuário administrador:

```bash
# Via API
curl -X POST https://seu-dominio.com.br/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "novo-admin@seu-dominio.com",
    "password": "senha_forte_123!",
    "name": "Novo Admin"
  }'
```

---

## 💾 Alterar Senha do Admin

### Via Dashboard
1. Login com admin@socialflow.com
2. Ir para Settings
3. Account Settings
4. Change Password

### Via API
```bash
curl -X POST https://seu-dominio.com.br/api/auth/change-password \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "senha_atual",
    "newPassword": "nova_senha_forte"
  }'
```

---

## 🗄️ Banco de Dados

### MySQL (Hospedagem Hostinger)
```
Host: localhost
User: sf_user
Password: (a que você configurou)
Database: socialflow_db
```

### Acessar via cPanel
1. cPanel → MySQL Databases
2. phMyAdmin (interface web)
3. Tabela: users
4. Procurar por: admin@socialflow.com

---

## ⚠️ SEGURANÇA

### NUNCA:
- ❌ Compartilhe credenciais por WhatsApp/Email
- ❌ Use senhas fracas
- ❌ Deixe senha padrão em produção
- ❌ Comit credenciais no Git
- ❌ Use mesma senha em vários serviços

### SEMPRE:
- ✅ Use senhas com 12+ caracteres
- ✅ Combine letras, números, símbolos
- ✅ Altere senha padrão na primeira vez
- ✅ Use gestor de senhas (1Password, LastPass)
- ✅ Ative 2FA (two-factor authentication)
- ✅ Guarde recovery codes em segurança

---

## 🚀 Próximas Ações

1. **Login com admin@socialflow.com**
2. **Alterar senha padrão**
3. **Criar sua primeira business/workspace**
4. **Conectar redes sociais** (Meta, TikTok, YouTube)
5. **Fazer primeiro post** via app
6. **Testar pagamento** (Mercado Pago)
7. **Começar a vender! 💰**

---

**Não compartilhe este arquivo!**  
*Mantenha suas credenciais seguras*
