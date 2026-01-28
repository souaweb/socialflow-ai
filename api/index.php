<?php
// Configurações de CORS SEGURO
$allowed_origins = [
  'https://socialflow.ai',
  'https://app.socialflow.ai',
  'http://localhost:5173',
  'http://localhost:3000'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowed_origins)) {
  header("Access-Control-Allow-Origin: $origin");
} else {
  header("HTTP/1.1 403 Forbidden");
  exit();
}

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// ============ CARREGAR VARIÁVEIS DE AMBIENTE ============
$env_file = __DIR__ . '/../.env.local';
if (file_exists($env_file)) {
  $lines = file($env_file, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
  foreach ($lines as $line) {
    if (strpos($line, '#') === 0) continue; // Ignorar comentários
    if (strpos($line, '=') === false) continue;
    list($key, $value) = explode('=', $line, 2);
    $key = trim($key);
    $value = trim($value);
    putenv("$key=$value");
  }
}

// ============ CREDENCIAIS DO BANCO DE DADOS ============
$host = getenv('DB_HOST') ?: 'localhost';
$db_name = getenv('DB_NAME') ?: 'u546804217_social';
$username = getenv('DB_USER') ?: 'u546804217_social';
$password = getenv('DB_PASSWORD') ?: '';
$db_port = getenv('DB_PORT') ?: 3306;

// ============ CHAVE JWT PARA AUTENTICAÇÃO ============
$jwt_secret = getenv('JWT_SECRET') ?: 'seu_segredo_aqui';

// ============ VALIDAÇÃO DE AUTENTICAÇÃO ============
function validateToken() {
  global $jwt_secret;
  
  $headers = getallheaders();
  $auth_header = $headers['Authorization'] ?? '';
  
  if (!preg_match('/Bearer\s+(.+)/i', $auth_header, $matches)) {
    http_response_code(401);
    exit(json_encode(['error' => 'Token não fornecido']));
  }
  
  $token = $matches[1];
  // Em produção: validar JWT assinado
  // Por enquanto: validação simples
  if (empty($token)) {
    http_response_code(401);
    exit(json_encode(['error' => 'Token inválido']));
  }
  
  return true;
}

// ============ VALIDAÇÃO DE INPUT ============
function sanitizeInput($input) {
  if (is_array($input)) {
    return array_map('sanitizeInput', $input);
  }
  return htmlspecialchars($input, ENT_QUOTES, 'UTF-8');
}

function validateEmail($email) {
  return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

function validateCPF($cpf) {
  $cpf = preg_replace('/\D/', '', $cpf);
  return strlen($cpf) === 11;
}

function validateCNPJ($cnpj) {
  $cnpj = preg_replace('/\D/', '', $cnpj);
  return strlen($cnpj) === 14;
}

try {
    $conn = new PDO(
      "mysql:host=$host;port=$db_port;dbname=$db_name;charset=utf8",
      $username,
      $password,
      [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(["error" => "Erro de conexão"]);
    exit();
}

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents('php://input'), true) ?? $_GET;

$action = $_GET['action'] ?? '';
$data = json_decode(file_get_contents('php://input'), true) ?? $_GET;

// ============ VALIDAÇÃO DE AÇÕES E INPUT ============
switch($action) {
    case 'get_user':
        $email = sanitizeInput($_GET['email'] ?? '');
        if (!validateEmail($email)) {
          http_response_code(400);
          exit(json_encode(['error' => 'Email inválido']));
        }
        $stmt = $conn->prepare("SELECT * FROM profiles WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($user) {
            $user['identityVerified'] = (bool)$user['identity_verified'];
            $user['subscriptionActive'] = (bool)$user['subscription_active'];
            $user['permissions'] = json_decode($user['permissions']);
        }
        echo json_encode($user);
        break;

    case 'save_profile':
        if (!isset($data['id']) || !isset($data['email'])) {
          http_response_code(400);
          exit(json_encode(['error' => 'Dados incompletos']));
        }
        $email = sanitizeInput($data['email']);
        if (!validateEmail($email)) {
          http_response_code(400);
          exit(json_encode(['error' => 'Email inválido']));
        }
        $stmt = $conn->prepare("INSERT INTO profiles (id, email, name, role, plan, affiliate_code, permissions, identity_verified, subscription_active, subscription_status) 
                               VALUES (:id, :email, :name, :role, :plan, :affiliate_code, :permissions, :identity_verified, :subscription_active, :subscription_status)
                               ON DUPLICATE KEY UPDATE name=:name, plan=:plan, permissions=:permissions, identity_verified=:identity_verified, subscription_active=:subscription_active, subscription_status=:subscription_status");
        $stmt->execute([
            ':id' => sanitizeInput($data['id']),
            ':email' => $email,
            ':name' => sanitizeInput($data['name']),
            ':role' => sanitizeInput($data['role']),
            ':plan' => sanitizeInput($data['plan']),
            ':affiliate_code' => sanitizeInput($data['affiliateCode'] ?? ''),
            ':permissions' => json_encode($data['permissions']),
            ':identity_verified' => $data['identityVerified'] ? 1 : 0,
            ':subscription_active' => $data['subscriptionActive'] ? 1 : 0,
            ':subscription_status' => sanitizeInput($data['subscriptionStatus'] ?? 'active')
        ]);
        echo json_encode(["success" => true]);
        break;

    case 'get_businesses':
        $owner_id = sanitizeInput($_GET['owner_id'] ?? '');
        if (empty($owner_id)) {
          http_response_code(400);
          exit(json_encode(['error' => 'owner_id obrigatório']));
        }
        $stmt = $conn->prepare("SELECT * FROM businesses WHERE owner_id = ?");
        $stmt->execute([$owner_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'save_business':
        if (!isset($data['id']) || !isset($data['ownerId'])) {
          http_response_code(400);
          exit(json_encode(['error' => 'Dados incompletos']));
        }
        $stmt = $conn->prepare("INSERT INTO businesses (id, owner_id, name, industry, knowledge_base) VALUES (:id, :owner_id, :name, :industry, :kb) 
                               ON DUPLICATE KEY UPDATE name=:name, industry=:industry, knowledge_base=:kb");
        $stmt->execute([
            ':id' => sanitizeInput($data['id']),
            ':owner_id' => sanitizeInput($data['ownerId']),
            ':name' => sanitizeInput($data['name']),
            ':industry' => sanitizeInput($data['industry']),
            ':kb' => sanitizeInput($data['knowledgeBase'] ?? '')
        ]);
        echo json_encode(["success" => true]);
        break;

    case 'get_accounts':
        $business_id = sanitizeInput($_GET['business_id'] ?? '');
        if (empty($business_id)) {
          http_response_code(400);
          exit(json_encode(['error' => 'business_id obrigatório']));
        }
        $stmt = $conn->prepare("SELECT * FROM accounts WHERE business_id = ?");
        $stmt->execute([$business_id]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'save_account':
        if (!isset($data['id']) || !isset($data['businessId'])) {
          http_response_code(400);
          exit(json_encode(['error' => 'Dados incompletos']));
        }
        $stmt = $conn->prepare("INSERT INTO accounts (id, business_id, platform, username, status) VALUES (:id, :business_id, :platform, :username, :status)
                               ON DUPLICATE KEY UPDATE status=:status");
        $stmt->execute([
            ':id' => sanitizeInput($data['id']),
            ':business_id' => $data['businessId'],
            ':platform' => $data['platform'],
            ':username' => $data['username'],
            ':status' => $data['status']
        ]);
        echo json_encode(["success" => true]);
        break;

    case 'delete_account':
        $stmt = $conn->prepare("DELETE FROM accounts WHERE id = ?");
        $stmt->execute([$data['id']]);
        echo json_encode(["success" => true]);
        break;

    case 'get_leads':
        $stmt = $conn->prepare("SELECT * FROM leads WHERE business_id = ? ORDER BY last_interaction DESC");
        $stmt->execute([$_GET['business_id']]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'get_logs':
        $stmt = $conn->prepare("SELECT * FROM activity_logs WHERE business_id = ? ORDER BY created_at DESC LIMIT 50");
        $stmt->execute([$_GET['business_id']]);
        echo json_encode($stmt->fetchAll(PDO::FETCH_ASSOC));
        break;

    case 'save_transaction':
        $stmt = $conn->prepare("INSERT INTO transactions (id, amount, status, method, gateway, plan) VALUES (:id, :amount, :status, :method, :gateway, :plan)");
        $stmt->execute([
            ':id' => $data['id'],
            ':amount' => $data['amount'],
            ':status' => $data['status'],
            ':method' => $data['method'],
            ':gateway' => $data['gateway'],
            ':plan' => $data['plan']
        ]);
        echo json_encode(["success" => true]);
        break;

    default:
        echo json_encode(["status" => "SocialFlow API Online"]);
        break;
}
?>