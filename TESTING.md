# 🧪 Guia de Testes - SocialFlow AI v1.0.0

## ⚡ Teste Rápido (5 minutos)

### 1. Iniciar a Aplicação
```bash
cd /path/to/socialflow-ai
npm run dev
```
Abra: http://localhost:5173

### 2. Testar os 3 Usuários

#### 🔐 Admin
- Clique no botão **🔐 Admin** na landing page
- Veja: Agência completa com 2 contas sociais
- Verifique: Dashboard mostra dados de teste

#### 👤 Cliente  
- Clique em **👤 Cliente**
- Veja: E-commerce com 1 conta (Instagram)
- Teste: Criar novo negócio, conectar conta

#### 🤝 Afiliado
- Clique em **🤝 Afiliado**
- Veja: Dashboard de afiliados
- Teste: Ver comissões (simulado)

---

## 📋 Testes Funcionais

### 1. Autenticação
- [ ] Login com Admin
- [ ] Login com Cliente
- [ ] Login com Afiliado
- [ ] Logout e retorno à landing

### 2. Negócios
- [ ] Admin vê 2 negócios
- [ ] Clicar para trocar negócio ativo
- [ ] Criar novo negócio (botão "+")
- [ ] Editar nome/descrição

### 3. Contas Sociais
- [ ] Dashboard mostra contas conectadas
- [ ] Ícone de plataforma correto
- [ ] Status "connected" visível
- [ ] Health API = 100%

### 4. Dashboard
- [ ] Cards de resumo aparecem
- [ ] Números não são NaN
- [ ] Logs de atividade carregam
- [ ] Sem erros no console

### 5. Sidebar
- [ ] Todos os links funcionam
- [ ] Permissões respeitadas (Admin > tudo)
- [ ] Ícones aparecem
- [ ] Responsive em mobile

### 6. Checkout
- [ ] Clicar "Teste Grátis" → sem checkout
- [ ] Clicar plano pago → modal checkout
- [ ] Preencher dados
- [ ] Clicar "Finalizar" → sucesso

### 7. Identidade
- [ ] Modal de verificação aparece
- [ ] Campo CPF/CNPJ validado
- [ ] Botão "Verificar" funciona
- [ ] Status muda para verificado

### 8. Team Management
- [ ] Ver membros da equipe (vazio inicialmente)
- [ ] Adicionar novo membro
- [ ] Remover membro
- [ ] Permissões checkbox

### 9. API Settings
- [ ] Abas de API/Billing visíveis
- [ ] Campos de token salvam
- [ ] Histórico de transações (se houver)
- [ ] Webhook URL displays corretamente

### 10. Media Studio
- [ ] Gerar imagem (placeholder OK)
- [ ] Gerar vídeo (placeholder OK)
- [ ] Galeria mostra itens
- [ ] Sem console errors

---

## 🔍 Testes de Performance

### Build
```bash
npm run build
# ✓ Esperado: < 5 segundos
# ✓ Size: ~336KB bundled, 94KB gzipped
```

### Bundle Analysis
```bash
npm install -D rollup-plugin-visualizer
# Add to vite.config.ts and check dist size
```

### Lighthouse
- Abra DevTools > Lighthouse
- Generate report
- Target: > 90 Performance

---

## 🔒 Testes de Segurança

### ✅ Verificações Implementadas
- [x] Sem credenciais no código fonte
- [x] .env.local no .gitignore
- [x] API Key não é enviada ao cliente
- [x] CORS whitelist implementado
- [x] Input sanitization ativa
- [x] Sem console.log de dados sensíveis

### ❌ Verificar (Não implementado em dev)
- [ ] HTTPS em produção
- [ ] HSTS headers
- [ ] CSP headers
- [ ] Rate limiting
- [ ] JWT validation
- [ ] CSRF protection

---

## 📊 Testes de Compatibilidade

### Navegadores
- [ ] Chrome 120+
- [ ] Firefox 121+
- [ ] Safari 17+
- [ ] Edge 120+

### Dispositivos
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile Portrait
- [ ] Mobile Landscape

### Resoluções
- [ ] 320px (muito pequeno)
- [ ] 768px (tablet)
- [ ] 1024px (desktop)
- [ ] 1920px (full HD)

---

## 🐛 Checklist de Bugs Comuns

### Frontend
- [ ] Sem erros no console
- [ ] Sem warnings não-esperados
- [ ] Sem memory leaks (DevTools)
- [ ] Scroll smooth
- [ ] Modals fecham
- [ ] Inputs validam
- [ ] Buttons clicáveis

### Estado React
- [ ] State não persiste indevidamente
- [ ] useEffect limpo corretamente
- [ ] Sem batidas de API repetidas
- [ ] localStorage salva corretamente
- [ ] Theme/Dark mode (se tiver)

### Banco de Dados
- [ ] localStorage não excede limite
- [ ] Dados persistem após reload
- [ ] Negócios diferentes isolados
- [ ] Sem erro de chave duplicada

---

## 📱 Teste de Responsividade

```css
/* Breakpoints testados */
xs: 320px  ← Mobile
sm: 640px  ← Tablet Small
md: 768px  ← Tablet
lg: 1024px ← Desktop
xl: 1280px ← Large Desktop
2xl: 1536px ← Ultra Wide
```

### Verificar em cada breakpoint:
- [ ] Layout não quebra
- [ ] Texto legível
- [ ] Botões clicáveis
- [ ] Imagens responsive
- [ ] Sem overflow horizontal

---

## 🎯 Teste de Fluxo Completo

### Cenário 1: Novo Usuário
1. Abre app
2. Vê landing page
3. Clica "Teste Grátis"
4. Cria usuário teste@socialflow.ai
5. Vê dashboard
6. Cria novo negócio
7. Adiciona conta social (mock)
8. Sai da conta

### Cenário 2: Admin Full Flow
1. Login como Admin
2. Ve 2 negócios
3. Troca de negócio
4. Acessa Settings > API
5. Acessa Team Management
6. Acessa Reports
7. Acessa Afiliados
8. Logout

### Cenário 3: Checkout Flow
1. Login como Cliente
2. Clica em plano "Pro"
3. Modal checkout abre
4. Seleciona método (Card/PIX/Boleto)
5. Preenche dados
6. Clica "Finalizar"
7. Vê mensagem de sucesso
8. Modal Identidade aparece
9. Verifica CPF
10. Volta ao dashboard

---

## 📝 Relatório de Teste

### Template
```
DATA: 28/01/2026
TESTADOR: [Seu Nome]
VERSÃO: 1.0.0

✅ PASSOU:
- Autenticação
- Dashboard
- Navegação

⚠️ AVISO:
- Nenhum

❌ FALHOU:
- Nenhum

SCORE: 100% (10/10)
```

---

## 🚀 Deploy Checklist

Antes de fazer deploy em produção:

- [ ] Testes funcionais: OK
- [ ] Build sem erros: OK
- [ ] Performance: OK
- [ ] Segurança: OK
- [ ] .env.example existe
- [ ] README atualizado
- [ ] DEPLOYMENT.md lido
- [ ] API backend preparada
- [ ] Banco dados pronto
- [ ] SSL/HTTPS configurado

---

## 💾 Dados de Teste Pré-carregados

Ao fazer login, você terá:

### Admin
```
Negócios: 2
- Agência Admin (Marketing Digital)
- (pode criar mais)

Contas Sociais: 2
- Instagram (agencia.admin)
- Facebook (agencia.admin)

Leads: 0 (pode criar)
Logs: 0 (gerados ao usar)
```

### Cliente
```
Negócios: 1
- E-commerce João

Contas Sociais: 1
- Instagram (ecommerce.joao)

Leads: 0
Logs: 0
```

### Afiliado
```
(Sem negócios - painel afiliado apenas)

Comissões: 0 (simulado)
Clicks: 0 (simulado)
```

---

## 🎓 Notas de Desenvolvimento

- **Dados Temporários:** Tudo em localStorage - reseta se limpar cache
- **Senhas:** Sistema simulado (não real)
- **Pagamento:** Simulado (não processa real)
- **IA:** Usando placeholders (integrar Gemini depois)
- **APIs Sociais:** Mockadas (integrar Meta/TikTok depois)

---

## ✅ Assinatura do Teste

Testes Completados: ☐  
Testador: _______________  
Data: _______________  
Aprovado para Deploy: ☐

---

**Sucesso na Testagem! 🎉**
