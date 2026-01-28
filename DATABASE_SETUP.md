# 🗄️ DATABASE SETUP GUIDE - SocialFlow

## 📋 Pré-requisitos

### 1. Instalar Docker Desktop
- **Windows/Mac:** https://www.docker.com/products/docker-desktop
- **Linux:** `sudo apt-get install docker.io docker-compose`

### 2. Verificar Instalação
```bash
docker --version
docker-compose --version
```

---

## 🚀 SETUP RÁPIDO (1 minuto)

### Windows
```cmd
# 1. Abrir PowerShell como administrador
# 2. Navegar até a pasta do projeto
cd C:\Users\Nitro\Downloads\socialflow-ai

# 3. Executar script de setup
.\setup-db.bat
```

### Mac/Linux
```bash
# 1. Navegue até a pasta do projeto
cd ~/Downloads/socialflow-ai

# 2. Tornar script executável
chmod +x setup-db.sh

# 3. Executar script
./setup-db.sh
```

---

## 🐳 INICIAR BANCOS MANUALMENTE

Se preferir não usar o script:

```bash
# Navegar até a pasta do projeto
cd socialflow-ai

# Iniciar todos os containers
docker-compose up -d

# Verificar status
docker-compose ps

# Ver logs
docker-compose logs -f
```

---

## 📊 ACESSAR AS INTERFACES

Após executar o setup, abra nos navegadores:

### 1. **PgAdmin** (PostgreSQL GUI)
```
URL: http://localhost:5050
Email: admin@socialflow.com
Senha: admin123
```

**Para conectar ao PostgreSQL:**
1. Clique em "Add New Server"
2. Nome: `socialflow`
3. Host: `postgres`
4. Port: `5432`
5. Username: `socialflow`
6. Password: `socialflow123`

### 2. **Mongo Express** (MongoDB GUI)
```
URL: http://localhost:8081
(sem autenticação, acesso direto)
```

**Conectar automaticamente:**
- Clica em "socialflow_analytics" para ver as collections

### 3. **Redis Commander** (Redis GUI)
```
URL: http://localhost:8082
(acesso direto ao Redis)
```

---

## 🔧 VARIÁVEIS DE AMBIENTE

### 1. Copiar arquivo de exemplo
```bash
cp .env.local.example .env.local
```

### 2. Editar `.env.local` com suas credenciais

```env
# DATABASE (já configurado via Docker)
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=socialflow
DATABASE_PASSWORD=socialflow123
DATABASE_NAME=socialflow_db

# APIs (você precisa configurar)
META_APP_ID=seu_meta_app_id
META_APP_SECRET=seu_meta_app_secret
TIKTOK_CLIENT_ID=seu_tiktok_client_id
YOUTUBE_CLIENT_ID=seu_youtube_client_id
GEMINI_API_KEY=sua_chave_gemini

# MERCADO PAGO (você precisa configurar)
MERCADOPAGO_ACCESS_TOKEN=APP_USR-seu-token
MERCADOPAGO_PUBLIC_KEY=APP_USR-sua-public-key
```

---

## 📦 INSTALAR DEPENDÊNCIAS

### Backend
```bash
cd backend

# Instalar dependências
npm install

# Executar migrations (se necessário)
npm run typeorm migration:run
```

### Frontend
```bash
# Voltar para raiz
cd ..

# Instalar dependências
npm install
```

---

## 🎬 INICIAR A APLICAÇÃO

### Terminal 1: Backend
```bash
cd backend
npm run dev
```

**Saída esperada:**
```
[Nest] 12345  - 01/28/2026, 10:30:45 AM     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 01/28/2026, 10:30:46 AM     LOG [InstanceLoader] DatabaseModule dependencies initialized...
[Nest] 12345  - 01/28/2026, 10:30:47 AM     LOG [NestFactory] Nest application successfully started
Listening on port 3001
```

### Terminal 2: Frontend
```bash
npm run dev
```

**Saída esperada:**
```
  VITE v4.5.0  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

---

## ✅ VERIFICAR CONEXÃO

### Via Terminal

**PostgreSQL:**
```bash
docker exec socialflow-postgres psql -U socialflow -d socialflow_db -c "SELECT version();"
```

**MongoDB:**
```bash
docker exec socialflow-mongo mongosh --eval "db.adminCommand('ping')"
```

**Redis:**
```bash
docker exec socialflow-redis redis-cli -a socialflow123 ping
```

### Via APIs

**Frontend:**
- Abrir http://localhost:5173
- Fazer login (admin@socialflow.com / password)
- Verificar se dashboard carrega

**Backend Health Check:**
```bash
curl http://localhost:3001/health
```

---

## 🛠️ COMANDOS ÚTEIS

### Gerenciar Containers

```bash
# Ver status de todos
docker-compose ps

# Parar todos os containers
docker-compose stop

# Iniciar todos os containers
docker-compose start

# Remover todos (ATENÇÃO: deleta dados!)
docker-compose down -v

# Ver logs de um container
docker-compose logs postgres
docker-compose logs mongodb
docker-compose logs redis

# Seguir logs em tempo real
docker-compose logs -f postgres
```

### Acessar Bancos via CLI

```bash
# PostgreSQL
docker exec -it socialflow-postgres psql -U socialflow -d socialflow_db

# MongoDB
docker exec -it socialflow-mongo mongosh

# Redis
docker exec -it socialflow-redis redis-cli -a socialflow123
```

---

## 🐛 TROUBLESHOOTING

### Porta já em uso
```bash
# Encontrar processo usando a porta
netstat -ano | findstr :5432  # Windows
lsof -i :5432                  # Mac/Linux

# Parar container
docker-compose stop postgres
```

### Banco não conecta
```bash
# Reiniciar container
docker-compose restart postgres

# Verificar logs
docker-compose logs postgres
```

### Senha errada
```bash
# Parar tudo
docker-compose down -v

# Remover volumes (deleta dados!)
# Editar docker-compose.yml com nova senha
# Reiniciar
docker-compose up -d
```

### Docker não inicia
```bash
# Reiniciar Docker daemon
# Windows: Fechar e abrir Docker Desktop
# Linux: sudo systemctl restart docker
```

---

## 💾 BACKUP E RESTORE

### Backup PostgreSQL
```bash
docker exec socialflow-postgres pg_dump -U socialflow socialflow_db > backup.sql
```

### Restore PostgreSQL
```bash
docker exec -i socialflow-postgres psql -U socialflow socialflow_db < backup.sql
```

### Backup MongoDB
```bash
docker exec socialflow-mongo mongodump --out /tmp/mongo-backup
```

---

## 🔐 SEGURANÇA

### Mudar Senhas Padrão (Produção)

1. **PostgreSQL:** Editar `docker-compose.yml`
   ```yaml
   environment:
     POSTGRES_PASSWORD: nova_senha_segura
   ```

2. **MongoDB:** Editar `docker-compose.yml`
   ```yaml
   environment:
     MONGO_INITDB_ROOT_PASSWORD: nova_senha_segura
   ```

3. **Redis:** Editar `docker-compose.yml`
   ```bash
   command: redis-server --requirepass nova_senha_segura
   ```

4. **Atualizar `.env.local`** com as mesmas senhas

---

## 📈 MONITORAMENTO

### Verificar Uso de Recursos
```bash
# Ver uso de CPU/Memória
docker stats
```

### Limpar Espaço
```bash
# Remover containers parados
docker container prune

# Remover imagens não usadas
docker image prune

# Remover volumes não usados
docker volume prune
```

---

## 🚢 DEPLOYMENT EM PRODUÇÃO

Para deploy em produção:

1. **Usar gerenciador de BD externo**
   - AWS RDS (PostgreSQL)
   - Atlas MongoDB
   - ElastiCache (Redis)

2. **Atualizar `.env`**
   ```env
   DATABASE_HOST=seu-rds-endpoint.amazonaws.com
   MONGODB_URI=seu-atlas-connection-string
   REDIS_HOST=seu-elasticache-endpoint
   ```

3. **Usar Docker Compose em Swarm ou Kubernetes**

---

## 📞 SUPORTE

Se tiver problemas:

1. Verificar logs: `docker-compose logs`
2. Verificar status: `docker-compose ps`
3. Reiniciar: `docker-compose restart`

---

**Database Setup Completo! 🎉**

Agora você pode:
- ✅ Publicar posts em todos os canais
- ✅ Receber pagamentos via Mercado Pago
- ✅ Gerenciar assinaturas
- ✅ Armazenar dados de forma segura

Bora ganhar dinheiro! 💰
