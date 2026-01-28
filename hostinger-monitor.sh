#!/bin/bash

# ============================================================================
#  SocialFlow AI - Ferramentas de Monitoramento e Troubleshooting
#  Use este script para diagnosticar problemas na Hostinger
#  Uso: chmod +x hostinger-monitor.sh && ./hostinger-monitor.sh
# ============================================================================

# Cores
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

APP_DIR="/home/seu_usuario/public_html/socialflow"
LOG_DIR="$APP_DIR/logs"

# Menu principal
show_menu() {
    echo ""
    echo -e "${CYAN}════════════════════════════════════════════════${NC}"
    echo -e "${CYAN}  SocialFlow AI - Monitoramento e Troubleshooting${NC}"
    echo -e "${CYAN}════════════════════════════════════════════════${NC}"
    echo ""
    echo -e "${BLUE}1)${NC} Status da Aplicação"
    echo -e "${BLUE}2)${NC} Ver Logs em Tempo Real"
    echo -e "${BLUE}3)${NC} Restart da Aplicação"
    echo -e "${BLUE}4)${NC} Ver Uso de Memória/CPU"
    echo -e "${BLUE}5)${NC} Diagnosticar Problemas"
    echo -e "${BLUE}6)${NC} Testar Conectividade"
    echo -e "${BLUE}7)${NC} Fazer Backup Banco de Dados"
    echo -e "${BLUE}8)${NC} Ver Espaço em Disco"
    echo -e "${BLUE}9)${NC} Reiniciar PM2"
    echo -e "${BLUE}10)${NC} Update da Aplicação"
    echo -e "${BLUE}11)${NC} Ver Relatório Completo"
    echo -e "${BLUE}0)${NC} Sair"
    echo ""
}

# ============================================================================
# 1. STATUS DA APLICAÇÃO
# ============================================================================

check_status() {
    echo -e "\n${CYAN}=== STATUS DA APLICAÇÃO ===${NC}\n"
    
    pm2 status
    
    echo -e "\n${CYAN}=== VERIFICANDO PROCESS ===${NC}\n"
    
    if pm2 list | grep -q "socialflow-backend"; then
        echo -e "${GREEN}✅ PM2 gerenciando aplicação${NC}"
    else
        echo -e "${RED}❌ Aplicação não está sob gerência do PM2${NC}"
    fi
    
    echo -e "\n${CYAN}=== VERIFICANDO PORTA 3001 ===${NC}\n"
    
    if lsof -i :3001 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Porta 3001 está em uso${NC}"
        lsof -i :3001
    else
        echo -e "${RED}❌ Nenhuma aplicação na porta 3001${NC}"
    fi
}

# ============================================================================
# 2. VER LOGS
# ============================================================================

view_logs() {
    echo -e "\n${CYAN}=== LOGS EM TEMPO REAL ===${NC}\n"
    echo "Pressione Ctrl+C para parar"
    echo ""
    pm2 logs socialflow-backend
}

# ============================================================================
# 3. RESTART
# ============================================================================

restart_app() {
    echo -e "\n${YELLOW}Restarting aplicação...${NC}\n"
    
    pm2 restart socialflow-backend
    sleep 3
    
    if pm2 list | grep "socialflow-backend" | grep -q "online"; then
        echo -e "${GREEN}✅ Aplicação reiniciada com sucesso${NC}"
    else
        echo -e "${RED}❌ Erro ao reiniciar aplicação${NC}"
        pm2 logs socialflow-backend --lines 20
    fi
}

# ============================================================================
# 4. USO DE MEMÓRIA/CPU
# ============================================================================

check_resources() {
    echo -e "\n${CYAN}=== USO DE RECURSOS ===${NC}\n"
    
    echo -e "${BLUE}Monitoramento em tempo real (Pressione Ctrl+C para parar):${NC}\n"
    pm2 monit
}

# ============================================================================
# 5. DIAGNOSTICAR PROBLEMAS
# ============================================================================

diagnose() {
    echo -e "\n${CYAN}=== DIAGNÓSTICO COMPLETO ===${NC}\n"
    
    # 1. Verificar Node.js
    echo -e "${BLUE}1. Node.js${NC}"
    if command -v node &> /dev/null; then
        echo -e "${GREEN}✅ Instalado: $(node --version)${NC}"
    else
        echo -e "${RED}❌ Node.js não encontrado${NC}"
    fi
    
    # 2. Verificar npm
    echo -e "\n${BLUE}2. npm${NC}"
    if command -v npm &> /dev/null; then
        echo -e "${GREEN}✅ Instalado: $(npm --version)${NC}"
    else
        echo -e "${RED}❌ npm não encontrado${NC}"
    fi
    
    # 3. Verificar PM2
    echo -e "\n${BLUE}3. PM2${NC}"
    if command -v pm2 &> /dev/null; then
        echo -e "${GREEN}✅ Instalado: $(pm2 --version)${NC}"
    else
        echo -e "${RED}❌ PM2 não encontrado${NC}"
    fi
    
    # 4. Verificar diretório da app
    echo -e "\n${BLUE}4. Diretório da Aplicação${NC}"
    if [ -d "$APP_DIR" ]; then
        echo -e "${GREEN}✅ Existe: $APP_DIR${NC}"
        echo "   Arquivos: $(ls -1 $APP_DIR | wc -l)"
    else
        echo -e "${RED}❌ Diretório não encontrado: $APP_DIR${NC}"
    fi
    
    # 5. Verificar .env.local
    echo -e "\n${BLUE}5. Arquivo .env.local${NC}"
    if [ -f "$APP_DIR/.env.local" ]; then
        echo -e "${GREEN}✅ Existe${NC}"
        echo "   Variáveis: $(grep -c '=' $APP_DIR/.env.local)"
    else
        echo -e "${RED}❌ Não encontrado${NC}"
    fi
    
    # 6. Verificar conectividade banco de dados
    echo -e "\n${BLUE}6. Banco de Dados MySQL${NC}"
    if [ -f "$APP_DIR/.env.local" ]; then
        DB_USER=$(grep DATABASE_USER $APP_DIR/.env.local | cut -d= -f2)
        DB_NAME=$(grep DATABASE_NAME $APP_DIR/.env.local | cut -d= -f2)
        
        # Tenta conexão (precisa da senha)
        echo "   Usuário: $DB_USER"
        echo "   Database: $DB_NAME"
        echo -e "   ${YELLOW}(Teste manual: mysql -u $DB_USER -h localhost $DB_NAME)${NC}"
    fi
    
    # 7. Verificar porta 3001
    echo -e "\n${BLUE}7. Porta 3001${NC}"
    if lsof -i :3001 > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Porta 3001 em uso${NC}"
    else
        echo -e "${YELLOW}⚠️  Porta 3001 livre (app pode não estar rodando)${NC}"
    fi
    
    # 8. Verificar processo PM2
    echo -e "\n${BLUE}8. Processo PM2${NC}"
    pm2 describe socialflow-backend 2>/dev/null || echo -e "${YELLOW}⚠️  Processo não encontrado${NC}"
    
    # 9. Verificar logs recentes
    echo -e "\n${BLUE}9. Erros Recentes${NC}"
    if [ -d "$LOG_DIR" ]; then
        ERROR_COUNT=$(grep -i "error" $LOG_DIR/*.log 2>/dev/null | wc -l)
        if [ $ERROR_COUNT -gt 0 ]; then
            echo -e "${RED}⚠️  $ERROR_COUNT erros encontrados nos logs${NC}"
            echo -e "${YELLOW}Primeiros 5 erros:${NC}"
            grep -i "error" $LOG_DIR/*.log 2>/dev/null | head -5
        else
            echo -e "${GREEN}✅ Sem erros nos logs${NC}"
        fi
    fi
    
    # 10. Verificar espaço em disco
    echo -e "\n${BLUE}10. Espaço em Disco${NC}"
    df -h | grep -E "^/dev|^Filesystem" | head -3
}

# ============================================================================
# 6. TESTAR CONECTIVIDADE
# ============================================================================

test_connectivity() {
    echo -e "\n${CYAN}=== TESTE DE CONECTIVIDADE ===${NC}\n"
    
    # Ler domínio do .env.local
    DOMAIN=$(grep "APP_URL" $APP_DIR/.env.local 2>/dev/null | cut -d= -f2 | sed 's|https://||' | sed 's|http://||' | sed 's|/||g')
    
    if [ -z "$DOMAIN" ]; then
        echo -e "${YELLOW}⚠️  Domínio não encontrado em .env.local${NC}"
        read -p "Digite seu domínio: " DOMAIN
    fi
    
    echo "Testando conectividade para: $DOMAIN"
    echo ""
    
    # 1. Testar DNS
    echo -e "${BLUE}1. Teste DNS${NC}"
    if nslookup $DOMAIN > /dev/null 2>&1; then
        echo -e "${GREEN}✅ DNS resolvendo${NC}"
        nslookup $DOMAIN | grep "Address" | head -3
    else
        echo -e "${RED}❌ DNS não resolvendo${NC}"
    fi
    
    # 2. Testar porta 80 (HTTP)
    echo -e "\n${BLUE}2. Teste HTTP (porta 80)${NC}"
    if timeout 5 bash -c "echo >/dev/tcp/$DOMAIN/80" 2>/dev/null; then
        echo -e "${GREEN}✅ Porta 80 acessível${NC}"
    else
        echo -e "${RED}❌ Porta 80 bloqueada${NC}"
    fi
    
    # 3. Testar porta 443 (HTTPS)
    echo -e "\n${BLUE}3. Teste HTTPS (porta 443)${NC}"
    if timeout 5 bash -c "echo >/dev/tcp/$DOMAIN/443" 2>/dev/null; then
        echo -e "${GREEN}✅ Porta 443 acessível${NC}"
    else
        echo -e "${RED}❌ Porta 443 bloqueada${NC}"
    fi
    
    # 4. Testar localhost:3001
    echo -e "\n${BLUE}4. Teste localhost:3001${NC}"
    if timeout 5 bash -c "echo >/dev/tcp/localhost/3001" 2>/dev/null; then
        echo -e "${GREEN}✅ Aplicação respondendo na porta 3001${NC}"
    else
        echo -e "${RED}❌ Aplicação não respondendo na porta 3001${NC}"
    fi
    
    # 5. Testar endpoint API
    echo -e "\n${BLUE}5. Teste Endpoint API${NC}"
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/api/health 2>/dev/null)
    if [ "$RESPONSE" = "200" ]; then
        echo -e "${GREEN}✅ API respondendo com sucesso${NC}"
    else
        echo -e "${YELLOW}⚠️  API respondeu com status: $RESPONSE${NC}"
    fi
}

# ============================================================================
# 7. BACKUP BANCO DE DADOS
# ============================================================================

backup_database() {
    echo -e "\n${CYAN}=== BACKUP DO BANCO DE DADOS ===${NC}\n"
    
    # Ler credenciais do .env.local
    DB_USER=$(grep DATABASE_USER $APP_DIR/.env.local | cut -d= -f2)
    DB_NAME=$(grep DATABASE_NAME $APP_DIR/.env.local | cut -d= -f2)
    BACKUP_DIR="$APP_DIR/backups"
    
    if [ -z "$DB_USER" ] || [ -z "$DB_NAME" ]; then
        echo -e "${RED}❌ Credenciais do banco não encontradas${NC}"
        return
    fi
    
    mkdir -p $BACKUP_DIR
    BACKUP_FILE="$BACKUP_DIR/backup_$(date +%Y%m%d_%H%M%S).sql"
    
    echo "Fazendo backup..."
    echo "Arquivo: $BACKUP_FILE"
    echo ""
    
    if mysqldump -u $DB_USER -p $DB_NAME > $BACKUP_FILE 2>/dev/null; then
        SIZE=$(du -h $BACKUP_FILE | cut -f1)
        echo -e "${GREEN}✅ Backup criado com sucesso${NC}"
        echo "   Tamanho: $SIZE"
    else
        echo -e "${YELLOW}⚠️  Digite a senha do MySQL quando solicitado${NC}"
        mysqldump -u $DB_USER -p $DB_NAME > $BACKUP_FILE
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Backup criado com sucesso${NC}"
        else
            echo -e "${RED}❌ Erro ao fazer backup${NC}"
        fi
    fi
}

# ============================================================================
# 8. VER ESPAÇO EM DISCO
# ============================================================================

check_disk() {
    echo -e "\n${CYAN}=== ESPAÇO EM DISCO ===${NC}\n"
    
    df -h
    
    echo -e "\n${CYAN}=== TAMANHO DO DIRETÓRIO DA APP ===${NC}\n"
    du -sh $APP_DIR
    
    echo -e "\n${CYAN}=== TAMANHO DOS LOGS ===${NC}\n"
    du -sh $LOG_DIR 2>/dev/null || echo "Diretório de logs não encontrado"
}

# ============================================================================
# 9. REINICIAR PM2
# ============================================================================

restart_pm2() {
    echo -e "\n${YELLOW}Reiniciando PM2...${NC}\n"
    
    pm2 stop all
    sleep 2
    pm2 start ecosystem.config.js
    sleep 3
    
    echo ""
    pm2 status
}

# ============================================================================
# 10. UPDATE DA APLICAÇÃO
# ============================================================================

update_app() {
    echo -e "\n${CYAN}=== UPDATE DA APLICAÇÃO ===${NC}\n"
    
    cd $APP_DIR
    
    echo -e "${BLUE}1. Atualizando repositório...${NC}"
    git pull origin main || git pull origin master
    
    echo -e "\n${BLUE}2. Instalando dependências...${NC}"
    npm install --legacy-peer-deps --production 2>&1 | tail -3
    cd backend
    npm install --legacy-peer-deps --production 2>&1 | tail -3
    cd ..
    
    echo -e "\n${BLUE}3. Build...${NC}"
    npm run build 2>&1 | tail -3
    cd backend
    npm run build 2>&1 | tail -3
    cd ..
    
    echo -e "\n${BLUE}4. Reiniciando aplicação...${NC}"
    pm2 restart socialflow-backend
    
    sleep 3
    echo ""
    pm2 status
    
    echo -e "\n${GREEN}✅ Update completo${NC}"
}

# ============================================================================
# 11. RELATÓRIO COMPLETO
# ============================================================================

full_report() {
    TIMESTAMP=$(date +"%Y-%m-%d %H:%M:%S")
    REPORT_FILE="/tmp/socialflow_report_$TIMESTAMP.txt"
    
    echo "Gerando relatório..."
    
    {
        echo "=========================================="
        echo "RELATÓRIO SOCIALFLOW AI"
        echo "Data: $TIMESTAMP"
        echo "=========================================="
        echo ""
        
        echo "## STATUS"
        pm2 status
        
        echo ""
        echo "## RECURSOS"
        echo "CPU e Memória:"
        top -b -n 1 | grep socialflow | head -3 || echo "Processo não encontrado em top"
        
        echo ""
        echo "Disco:"
        df -h | head -3
        
        echo ""
        echo "## LOGS (últimas 20 linhas)"
        tail -20 $LOG_DIR/error.log 2>/dev/null || echo "Sem erros recentes"
        
        echo ""
        echo "## DIAGNOSTICO"
        echo "Node.js: $(node --version)"
        echo "npm: $(npm --version)"
        echo "PM2: $(pm2 --version)"
        
    } > $REPORT_FILE
    
    cat $REPORT_FILE
    echo ""
    echo -e "${GREEN}✅ Relatório salvo em: $REPORT_FILE${NC}"
}

# ============================================================================
# MAIN LOOP
# ============================================================================

while true; do
    show_menu
    read -p "Escolha uma opção: " choice
    
    case $choice in
        1) check_status ;;
        2) view_logs ;;
        3) restart_app ;;
        4) check_resources ;;
        5) diagnose ;;
        6) test_connectivity ;;
        7) backup_database ;;
        8) check_disk ;;
        9) restart_pm2 ;;
        10) update_app ;;
        11) full_report ;;
        0) echo -e "${CYAN}Até logo!${NC}"; exit 0 ;;
        *) echo -e "${RED}Opção inválida${NC}" ;;
    esac
    
    echo ""
    read -p "Pressione ENTER para continuar..."
done
