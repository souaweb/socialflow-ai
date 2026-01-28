<?php
/**
 * SocialFlow AI - Deploy Webhook para Hostinger
 * 
 * Este arquivo recebe webhooks do GitHub e faz auto-deploy
 * Endpoint: https://seu-dominio.com.br/api/webhook/deploy.php
 * 
 * Setup no GitHub:
 * 1. Vá para Settings → Webhooks
 * 2. Payload URL: https://seu-dominio.com.br/api/webhook/deploy.php
 * 3. Content type: application/json
 * 4. Selecione "Just the push event"
 * 5. Copie o secret abaixo para GitHub
 */

// Configuração
define('WEBHOOK_SECRET', 'seu_webhook_secret_aleatorio_32_chars');
define('REPO_PATH', '/home/seu_usuario/public_html/socialflow');
define('LOG_FILE', '/home/seu_usuario/public_html/socialflow/logs/deploy.log');

// Headers
header('Content-Type: application/json');

// Função para logging
function log_message($message) {
    $timestamp = date('Y-m-d H:i:s');
    $log = "[$timestamp] $message\n";
    file_put_contents(LOG_FILE, $log, FILE_APPEND);
    echo json_encode(['status' => 'logged', 'message' => $message]) . "\n";
}

// Validar webhook secret
function verify_webhook() {
    $payload = file_get_contents('php://input');
    $signature = $_SERVER['HTTP_X_HUB_SIGNATURE_256'] ?? '';
    
    $hash = 'sha256=' . hash_hmac('sha256', $payload, WEBHOOK_SECRET);
    
    if (!hash_equals($hash, $signature)) {
        http_response_code(401);
        log_message('Webhook signature inválida!');
        exit(json_encode(['error' => 'Unauthorized']));
    }
    
    return json_decode($payload, true);
}

try {
    // Validar e pegar dados
    $data = verify_webhook();
    
    if (!isset($data['repository']['name']) || $data['repository']['name'] !== 'socialflow-ai') {
        log_message('Repositório inválido: ' . ($data['repository']['name'] ?? 'desconhecido'));
        exit(json_encode(['error' => 'Invalid repository']));
    }
    
    log_message('=== INICIANDO DEPLOY ===');
    log_message('Branch: ' . $data['ref']);
    
    // Apenas fazer deploy na branch main/master
    if ($data['ref'] !== 'refs/heads/main' && $data['ref'] !== 'refs/heads/master') {
        log_message('Deploy cancelado - branch não é main/master');
        exit(json_encode(['status' => 'skipped', 'reason' => 'wrong branch']));
    }
    
    // Mudar para diretório do repositório
    chdir(REPO_PATH);
    log_message('Diretório: ' . getcwd());
    
    // Executar comandos de deploy
    $commands = array(
        'git fetch origin' => 'Atualizando referências Git',
        'git reset --hard HEAD' => 'Reset dos arquivos',
        'git checkout main' => 'Checkout da branch main',
        'git pull origin main' => 'Pull das mudanças',
        'npm install --legacy-peer-deps --production' => 'Instalando dependências frontend',
        'cd backend && npm install --legacy-peer-deps --production' => 'Instalando dependências backend',
        'npm run build' => 'Build frontend',
        'cd backend && npm run build' => 'Build backend',
        'cd ..' => 'Retornar ao diretório raiz',
        'pm2 restart socialflow-backend' => 'Reiniciando aplicação PM2'
    );
    
    $output = '';
    foreach ($commands as $cmd => $description) {
        log_message("Executando: $description");
        
        $result = shell_exec("$cmd 2>&1");
        $output .= "Command: $cmd\n$result\n";
        
        if (strpos($result, 'error') !== false || strpos($result, 'Error') !== false) {
            log_message("⚠️  Possível erro em: $cmd");
        } else {
            log_message("✅ Concluído: $description");
        }
    }
    
    log_message('=== DEPLOY CONCLUÍDO COM SUCESSO ===');
    
    // Retornar sucesso
    http_response_code(200);
    echo json_encode([
        'status' => 'success',
        'message' => 'Deploy concluído',
        'timestamp' => date('Y-m-d H:i:s')
    ]);
    
} catch (Exception $e) {
    log_message('❌ ERRO: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => $e->getMessage()]);
}

?>
