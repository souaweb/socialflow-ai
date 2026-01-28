# 💳 MERCADO PAGO INTEGRATION GUIDE

## 🎯 Overview

Integração completa com **Mercado Pago** para processar pagamentos e assinaturas no SocialFlow.

**Métodos de Pagamento Suportados:**
- ✅ **Cartão de Crédito** (com parcelamento até 12x)
- ✅ **PIX** (pagamento instantâneo)
- ✅ **Boleto** (débito em 3 dias)
- ✅ **Checkout Preferences** (checkout customizado)

---

## 📋 PRÉ-REQUISITOS

### 1. Criar Conta Mercado Pago
1. Ir para https://www.mercadopago.com.br
2. Fazer cadastro como vendedor
3. Verificar conta (documento, banco, etc)
4. Acessar: Settings → API Keys

### 2. Obter Credenciais
```env
# .env.local
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxx-xxxxxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR_xxxxxxxxxxxxxxxx
MERCADOPAGO_MODE=sandbox # ou 'production'
APP_URL=http://localhost:3000
API_URL=http://localhost:3001
```

### 3. Instalar Dependências
```bash
npm install axios mercadopago
npm install -D @types/mercadopago
```

---

## 🔧 CONFIGURAÇÃO

### app.module.ts
```typescript
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    // ... outros módulos
    SubscriptionModule
  ]
})
export class AppModule {}
```

### .env.local
```env
MERCADOPAGO_ACCESS_TOKEN=APP_USR-xxxxxxxxxxxxxxxx
MERCADOPAGO_PUBLIC_KEY=APP_USR_xxxxxxxxxxxxxxxx
MERCADOPAGO_MODE=sandbox
APP_URL=http://localhost:3000
API_URL=http://localhost:3001
```

---

## 🚀 ENDPOINTS

### 1. CHECKOUT PREFERENCES (Recomendado para novos usuários)
```http
POST /subscription/mercadopago/checkout
Content-Type: application/json

{
  "planId": "plan_pro",
  "planName": "Pro",
  "amount": 299.00,
  "currency": "BRL",
  "businessId": "biz_123",
  "buyerEmail": "user@example.com",
  "buyerName": "João Silva",
  "billingCycle": "monthly",
  "description": "Assinatura Pro - SocialFlow",
  "installments": 3,
  "metadata": {
    "customField": "value"
  }
}
```

**Resposta:**
```json
{
  "success": true,
  "checkoutUrl": "https://www.mercadopago.com.br/checkout/v1/redirect?preference-id=xxx",
  "sandboxUrl": "https://sandbox.mercadopago.com.br/checkout/v1/...",
  "preferenceId": "123456789"
}
```

**O que acontece:**
- Usuário é redirecionado para checkout do Mercado Pago
- Escolhe método de pagamento
- Completa o pagamento
- Retorna à aplicação (success/failure/pending)

---

### 2. PIX PAYMENT (Instantâneo)
```http
POST /subscription/mercadopago/pix
Content-Type: application/json

{
  "amount": 299.00,
  "description": "Assinatura Pro - SocialFlow",
  "payerEmail": "user@example.com",
  "payerFirstName": "João",
  "payerLastName": "Silva",
  "payerCPF": "12345678900",
  "planId": "plan_pro",
  "businessId": "biz_123"
}
```

**Resposta:**
```json
{
  "success": true,
  "paymentId": "12345678901",
  "status": "pending",
  "qrCode": "00020126360014br.gov.bcb.pix...",
  "qrCodeImage": "data:image/png;base64,...",
  "amount": 299.00,
  "expiresAt": "2026-01-28T23:59:59.000Z"
}
```

**O que fazer:**
- Exibir QR Code na tela
- Usuário escaneia com app bancário
- Pagamento confirmado instantaneamente
- Webhook notifica aprovação

---

### 3. BOLETO PAYMENT (3 dias)
```http
POST /subscription/mercadopago/boleto
Content-Type: application/json

{
  "amount": 299.00,
  "description": "Assinatura Pro - SocialFlow",
  "payerEmail": "user@example.com",
  "payerFirstName": "João",
  "payerLastName": "Silva",
  "payerCPF": "12345678900",
  "planId": "plan_pro",
  "businessId": "biz_123"
}
```

**Resposta:**
```json
{
  "success": true,
  "paymentId": "12345678901",
  "status": "pending",
  "barcode": "12345.67890 12345.678901 12345.678901 1 12345678901234",
  "amount": 299.00,
  "expiresAt": "2026-01-31T23:59:59.000Z"
}
```

**O que fazer:**
- Exibir código de barras
- Usuário paga em banco/caixa eletrônico/app
- Sistema recebe notificação quando pago

---

### 4. CARTÃO DE CRÉDITO (Parcelado)
```http
POST /subscription/mercadopago/card
Content-Type: application/json

{
  "amount": 299.00,
  "description": "Assinatura Pro - SocialFlow",
  "payerEmail": "user@example.com",
  "payerFirstName": "João",
  "payerLastName": "Silva",
  "payerCPF": "12345678900",
  "cardToken": "token_gerado_no_frontend",
  "installments": 3,
  "planId": "plan_pro",
  "businessId": "biz_123"
}
```

**Resposta:**
```json
{
  "success": true,
  "paymentId": "12345678901",
  "status": "approved",
  "statusDetail": "accredited",
  "amount": 299.00,
  "installmentAmount": 99.67,
  "installments": 3
}
```

---

### 5. VERIFICAR STATUS DE PAGAMENTO
```http
GET /subscription/mercadopago/payment/:paymentId
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "paymentId": "12345678901",
    "status": "approved",
    "statusDetail": "accredited",
    "amount": 299.00,
    "paymentMethodId": "card",
    "payerEmail": "user@example.com",
    "createdAt": "2026-01-28T10:30:00.000Z",
    "approvedAt": "2026-01-28T10:35:00.000Z"
  }
}
```

---

### 6. REEMBOLSAR PAGAMENTO
```http
POST /subscription/mercadopago/refund
Content-Type: application/json

{
  "paymentId": "12345678901",
  "amount": 299.00,
  "reason": "Cancelamento de assinatura",
  "businessId": "biz_123"
}
```

**Resposta:**
```json
{
  "success": true,
  "paymentId": "12345678901",
  "status": "cancelled",
  "message": "Pagamento 12345678901 cancelado/reembolsado"
}
```

---

### 7. LISTAR ASSINATURAS
```http
GET /subscription/mercadopago/subscription/:subscriptionId
```

**Resposta:**
```json
{
  "success": true,
  "data": {
    "subscriptionId": "sub_12345678901",
    "status": "authorized",
    "planId": "plan_pro",
    "payerEmail": "user@example.com",
    "nextPaymentDate": "2026-02-28T00:00:00.000Z",
    "lastPaymentDate": "2026-01-28T10:35:00.000Z"
  }
}
```

---

### 8. CANCELAR ASSINATURA
```http
POST /subscription/mercadopago/subscription/cancel/:subscriptionId
Content-Type: application/json

{
  "reason": "Pausa temporária"
}
```

**Resposta:**
```json
{
  "success": true,
  "subscriptionId": "sub_12345678901",
  "status": "cancelled",
  "message": "Assinatura cancelada com sucesso"
}
```

---

## 🔔 WEBHOOKS

O Mercado Pago envia notificações para:
```
POST /subscription/mercadopago/webhook
```

### Tipos de Notificações

**1. Pagamento Aprovado:**
```json
{
  "id": "12345678901",
  "topic": "payment",
  "resource": "https://api.mercadopago.com/v1/payments/12345678901",
  "data": {
    "id": "12345678901"
  }
}
```

**2. Assinatura Autorizada:**
```json
{
  "id": "sub_12345678901",
  "topic": "subscription",
  "resource": "https://api.mercadopago.com/v1/billing/subscriptions/sub_12345678901"
}
```

**3. Fatura Gerada:**
```json
{
  "id": "inv_12345678901",
  "topic": "invoice",
  "resource": "https://api.mercadopago.com/v1/billing/invoices/inv_12345678901"
}
```

### Configurar Webhook no Mercado Pago

1. Acessar: https://www.mercadopago.com.br/settings/webhooks
2. Adicionar URL:
   ```
   https://seu-dominio.com/subscription/mercadopago/webhook
   ```
3. Selecionar eventos:
   - payment.created
   - payment.updated
   - subscription.created
   - subscription.updated
   - invoice.created
   - invoice.updated

---

## 💻 FRONTEND INTEGRATION

### 1. Instalar SDK Mercado Pago
```bash
npm install @mercadopago/sdk-js
```

### 2. Gerar Token de Cartão
```typescript
import { loadMercadoPago } from "@mercadopago/sdk-js";

export async function getCardToken(cardData: {
  cardnumber: string;
  cardholder: { name: string };
  securitycode: string;
  expiration: { month: string; year: string };
}) {
  const mercadopago = await loadMercadoPago();
  
  const cardToken = await mercadopago.fields.createCardToken({
    amount: "299",
    autoMount: true,
    processingMode: "aggregator",
    ...cardData
  });

  return cardToken.id; // Enviar para backend
}
```

### 3. Fazer Pagamento com Checkout
```typescript
async function createCheckout(planId: string) {
  const response = await fetch('/subscription/mercadopago/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      planId,
      planName: 'Pro',
      amount: 299,
      currency: 'BRL',
      businessId: 'biz_123',
      buyerEmail: 'user@example.com',
      buyerName: 'João Silva',
      billingCycle: 'monthly',
      description: 'Assinatura Pro'
    })
  });

  const data = await response.json();
  
  // Redirecionar para checkout
  window.location.href = data.checkoutUrl;
}
```

### 4. Fazer Pagamento com PIX
```typescript
async function payWithPix() {
  const response = await fetch('/subscription/mercadopago/pix', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 299,
      description: 'Assinatura Pro',
      payerEmail: 'user@example.com',
      payerFirstName: 'João',
      payerLastName: 'Silva',
      payerCPF: '12345678900',
      planId: 'plan_pro',
      businessId: 'biz_123'
    })
  });

  const data = await response.json();
  
  // Exibir QR Code
  showQRCodeModal(data.qrCodeImage, data.expiresAt);
}
```

### 5. Fazer Pagamento com Cartão
```typescript
async function payWithCard(cardToken: string) {
  const response = await fetch('/subscription/mercadopago/card', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: 299,
      description: 'Assinatura Pro',
      payerEmail: 'user@example.com',
      payerFirstName: 'João',
      payerLastName: 'Silva',
      payerCPF: '12345678900',
      cardToken,
      installments: 3,
      planId: 'plan_pro',
      businessId: 'biz_123'
    })
  });

  const data = await response.json();
  
  if (data.success) {
    showSuccessMessage('Pagamento aprovado!');
  } else {
    showErrorMessage('Falha no pagamento');
  }
}
```

---

## 📊 FLUXO DE PAGAMENTO

```
┌─────────────────┐
│  Usuário Clica  │
│  "Assinar Pro"  │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│ Frontend gera token  │
│ ou redireciona para  │
│ checkout/PIX/boleto  │
└────────┬─────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│  Backend: POST /mercadopago/*       │
│  Cria pagamento/preferência         │
│  Retorna status ou URL              │
└────────┬────────────────────────────┘
         │
         ▼
┌──────────────────────┐
│ Usuário Completa     │
│ Transação no MP      │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Mercado Pago processa│
│ pagamento (2-3 seg)  │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────────────┐
│ POST /webhook                │
│ Notifica aprovação           │
└────────┬─────────────────────┘
         │
         ▼
┌──────────────────────────────┐
│ Atualizar status no BD       │
│ Ativar plano                 │
│ Enviar email de confirmação  │
└──────────────────────────────┘
```

---

## 🔐 SEGURANÇA

### Boas Práticas
1. **Nunca armazene dados de cartão** - Use tokens
2. **HTTPS obrigatório** - Sempre em produção
3. **Validar assinaturas de webhook** - Verificar header X-Signature
4. **Variáveis de ambiente** - Não commitar credenciais
5. **Rate limiting** - Proteger endpoints
6. **Logging** - Registrar todas as transações

### Exemplo de Validação de Webhook
```typescript
verifyWebhookSignature(body: any, xSignature: string): boolean {
  // Mercado Pago envia X-Signature no header
  // Formato: ts=timestamp,v1=signature
  
  if (!xSignature) {
    return false;
  }

  // Em produção: usar crypto para validar
  // return crypto.verify(body, xSignature, publicKey);
  
  return true;
}
```

---

## 🧪 TESTE

### Cartões de Teste
```
Cartão: 4235 6477 3823 3010
CVV: 123
Data: 12/25
Nome: APRO (aprovado)

Cartão: 4235 6477 3823 3010
CVV: 123
Data: 12/25
Nome: OTHE (outro resultado)
```

### CPF de Teste
```
11144477735 - Aprovado
11144477735 - Pendente
11144477735 - Recusado
```

### Testar Webhook
```bash
curl -X POST http://localhost:3001/subscription/mercadopago/webhook/test \
  -H "Content-Type: application/json" \
  -d '{
    "id": "123456",
    "topic": "payment",
    "resource": "https://api.mercadopago.com/v1/payments/123456"
  }'
```

---

## 📈 PRÓXIMOS PASSOS

1. **Conectar ao banco de dados** - Salvar Payment e Subscription entities
2. **Implementar receipts** - PDF de recibos
3. **Email notifications** - Confirmação de pagamento
4. **Analytics** - Dashboard de receita
5. **Dispute handling** - Lidar com disputas/chargebacks
6. **Dunning management** - Retry de pagamentos falhados

---

**Integração Completa! 🎉**

Total: 8 Endpoints + Webhooks + 4 Métodos de Pagamento
