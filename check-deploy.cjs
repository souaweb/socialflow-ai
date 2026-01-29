#!/usr/bin/env node

/**
 * Verificador de Pré-Requisitos para Deployment
 * Este script verifica se tudo está pronto para deploy no Railway.app
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = path.join(__dirname, filePath);
  if (fs.existsSync(fullPath)) {
    log(`  ✓ ${description}`, 'green');
    return true;
  } else {
    log(`  ✗ ${description} (faltando: ${filePath})`, 'red');
    return false;
  }
}

function checkCommand(command, description) {
  try {
    execSync(`${command} --version`, { stdio: 'pipe' });
    log(`  ✓ ${description}`, 'green');
    return true;
  } catch (e) {
    log(`  ✗ ${description}`, 'red');
    return false;
  }
}

async function main() {
  log('\n', 'cyan');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('  SocialFlow AI - Verificador de Pré-Requisitos Deploy', 'cyan');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  log('\n', 'cyan');

  let score = 0;
  const total = 12;

  // Verificar arquivos críticos
  log('📁 Verificando Arquivos:', 'blue');
  if (checkFile('package.json', 'package.json')) score++;
  if (checkFile('Dockerfile', 'Dockerfile')) score++;
  if (checkFile('railway.json', 'railway.json')) score++;
  if (checkFile('docker-compose.prod.yml', 'docker-compose.prod.yml')) score++;
  if (checkFile('.env.local.example', '.env.local.example')) score++;

  log('\n🔧 Verificando Ferramentas:', 'blue');
  if (checkCommand('node', 'Node.js')) score++;
  if (checkCommand('npm', 'npm')) score++;
  if (checkCommand('git', 'Git')) score++;

  log('\n📦 Verificando Backend:', 'blue');
  if (checkFile('backend/package.json', 'backend/package.json')) score++;

  log('\n⚛️  Verificando Frontend:', 'blue');
  if (checkFile('vite.config.ts', 'vite.config.ts')) score++;
  if (checkFile('tsconfig.json', 'tsconfig.json')) score++;

  // Status do repositório Git
  log('\n🌐 Verificando Git:', 'blue');
  try {
    const branch = execSync('git rev-parse --abbrev-ref HEAD', { 
      encoding: 'utf-8',
      stdio: 'pipe'
    }).trim();
    
    const status = execSync('git status --porcelain', {
      encoding: 'utf-8',
      stdio: 'pipe'
    });
    
    if (branch === 'main' || branch === 'master') {
      log(`  ✓ Branch correto (${branch})`, 'green');
      score++;
    } else {
      log(`  ! Branch atual: ${branch}`, 'yellow');
      score++;
    }
  } catch (e) {
    log(`  ✗ Não é um repositório Git`, 'red');
  }

  // Resultado final
  log('\n', 'cyan');
  log('═══════════════════════════════════════════════════════════', 'cyan');
  
  const percentage = ((score / total) * 100).toFixed(0);
  const color = percentage >= 90 ? 'green' : percentage >= 70 ? 'yellow' : 'red';
  
  log(`  Resultado: ${score}/${total} (${percentage}%)`, color);
  log('═══════════════════════════════════════════════════════════', 'cyan');

  if (percentage >= 90) {
    log('\n✨ Parabéns! Seu aplicativo está pronto para deploy no Railway.app!', 'green');
    log('\n📖 Próximos passos:', 'cyan');
    log('  1. Acesse: https://railway.app/dashboard', 'cyan');
    log('  2. Crie um novo projeto', 'cyan');
    log('  3. Conecte seu repositório GitHub', 'cyan');
    log('  4. Configure as variáveis de ambiente', 'cyan');
    log('  5. Railway automaticamente faz o deploy!', 'cyan');
    log('\n💰 Você está pronto para ganhar dinheiro!', 'green');
  } else if (percentage >= 70) {
    log('\n⚠️  Alguns itens ainda precisam de atenção:', 'yellow');
    log('  Verifique os items marcados com ✗ acima', 'yellow');
  } else {
    log('\n❌ Há problemas críticos:', 'red');
    log('  Resolva todos os itens marcados com ✗ antes de fazer deploy', 'red');
  }

  log('\n', 'cyan');
}

main().catch(e => {
  console.error('Erro:', e.message);
  process.exit(1);
});
