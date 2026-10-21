import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import { spawn, execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('\n========================================================');
console.log('       🎨 POLIEDRAW - INICIALIZADOR ZERO-FRICTION       ');
console.log('========================================================\n');

// 1. Garantir arquivo .env
const envPath = path.join(__dirname, '.env');
const envExamplePath = path.join(__dirname, '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.log('📄 [Config] Arquivo .env criado a partir de .env.example.');
  } else {
    fs.writeFileSync(
      envPath,
      'PORT=3000\nFRONTEND_PORT=5502\nDB_HOST=localhost\nDB_PORT=3306\nDB_USER=root\nDB_PASS=imtdb\nDB_NAME=poliedro_ai\nGEMINI_API_KEY=\n'
    );
    console.log('📄 [Config] Arquivo .env padrão criado.');
  }
  console.log('⚠️  [Atenção] Adicione sua GEMINI_API_KEY no arquivo .env para gerar imagens com IA!\n');
}

// 2. Função para testar porta TCP (MySQL)
function checkPort(port, host = '127.0.0.1', timeout = 1000) {
  return new Promise(resolve => {
    const socket = new net.Socket();
    socket.setTimeout(timeout);
    socket.once('connect', () => {
      socket.destroy();
      resolve(true);
    });
    socket.once('timeout', () => {
      socket.destroy();
      resolve(false);
    });
    socket.once('error', () => {
      socket.destroy();
      resolve(false);
    });
    socket.connect(port, host);
  });
}

// 3. Aguardar porta aberta com retry
async function waitForPort(port, host = '127.0.0.1', maxAttempts = 35) {
  for (let i = 1; i <= maxAttempts; i++) {
    const open = await checkPort(port, host, 800);
    if (open) return true;
    await new Promise(r => setTimeout(r, 1000));
  }
  return false;
}

// 4. Verificação e subida do Banco
async function setupDatabase() {
  const isMysqlOpen = await checkPort(3306);
  if (!isMysqlOpen) {
    console.log('🔍 [Database] MySQL não detectado na porta 3306. Tentando subir via container...');
    let startedContainer = false;

    // Detecta ferramenta de container disponível (docker ou podman)
    let containerTool = null;
    try {
      execSync('docker --version', { stdio: 'ignore' });
      containerTool = 'docker';
    } catch {
      try {
        execSync('podman --version', { stdio: 'ignore' });
        containerTool = 'podman';
      } catch {
        containerTool = null;
      }
    }

    if (containerTool) {
      // 1. Tenta iniciar container existente se já estiver criado
      try {
        execSync(`${containerTool} start poliedraw-mysql`, { stdio: 'ignore' });
        startedContainer = true;
        console.log(`🐳 [Database] Container existente 'poliedraw-mysql' iniciado com sucesso via ${containerTool}.`);
      } catch {
        // 2. Se não existir, tenta criar novo container
        try {
          console.log(`🐳 [Database] Criando novo container MySQL com ${containerTool}...`);
          execSync(
            `${containerTool} run -d --name poliedraw-mysql -p 3306:3306 -e MYSQL_ROOT_PASSWORD=imtdb -e MYSQL_DATABASE=poliedro_ai docker.io/library/mariadb:10.11`,
            { stdio: 'inherit' }
          );
          startedContainer = true;
          console.log(`🐳 [Database] Container poliedraw-mysql criado via ${containerTool}.`);
        } catch (e) {
          console.warn(`⚠️ [Database] Falha ao criar container: ${e.message}`);
          startedContainer = false;
        }
      }
    }

    if (startedContainer) {
      console.log('⏳ [Database] Aguardando MySQL inicializar e liberar porta 3306...');
      const ready = await waitForPort(3306);
      if (!ready) {
        throw new Error('Tempo limite excedido aguardando o MySQL na porta 3306.');
      }
      // Pausa para estabilizar handshake do MySQL antes de consultas
      await new Promise(r => setTimeout(r, 3000));
    } else {
      console.warn('⚠️  [Database] Nenhum container runtime ativo. Certifique-se de que o MySQL local esteja em execução na porta 3306 com senha "imtdb".');
    }
  } else {
    console.log('✅ [Database] MySQL detectado e ativo na porta 3306.');
  }

  // Executa seed dos dados com retry para garantir que o MySQL aceita conexões completas
  const { runSeed } = await import('./scripts/seed.js');
  let retries = 5;
  while (retries > 0) {
    try {
      await runSeed();
      break;
    } catch (err) {
      retries--;
      if (retries === 0) throw err;
      console.log(`⏳ [Database] Aguardando autenticação MySQL... (${retries} tentativas restantes)`);
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

// 5. Função para abrir o navegador
function openBrowser(url) {
  const cmd = process.platform === 'win32' ? 'start' : process.platform === 'darwin' ? 'open' : 'xdg-open';
  try {
    spawn(cmd, [url], { detached: true, stdio: 'ignore' }).unref();
  } catch {}
}

// 6. Bootstrap Principal
async function main() {
  try {
    await setupDatabase();

    console.log('\n🚀 [Backend] Inicializando API Express...');
    const backendProc = spawn('node', ['backend/conexao.js'], {
      stdio: 'inherit',
      env: process.env
    });

    console.log('🚀 [Frontend] Inicializando Servidor Web Estático...');
    const { startFrontendServer } = await import('./scripts/serve-frontend.js');
    startFrontendServer();

    const frontendUrl = 'http://localhost:5502/HTML/login.html';
    console.log('\n========================================================');
    console.log('🎉 POLIEDRAW RODANDO COM SUCESSO!');
    console.log(`👉 Acesse a aplicação em: \x1b[36m${frontendUrl}\x1b[0m`);
    console.log(`👉 API Backend em:        \x1b[32mhttp://localhost:3000\x1b[0m`);
    console.log('\n🔑 Credenciais de Teste:');
    console.log('   - Professor: gui@sistemapoliedro   | Senha: 4343');
    console.log('   - Aluno:     aluno@sistemapoliedro | Senha: 43');
    console.log('========================================================\n');

    setTimeout(() => openBrowser(frontendUrl), 1500);

    const cleanup = () => {
      console.log('\n🛑 Encerrando Poliedraw...');
      backendProc.kill();
      process.exit(0);
    };

    process.on('SIGINT', cleanup);
    process.on('SIGTERM', cleanup);

  } catch (err) {
    console.error('\n❌ Erro na inicialização:', err.message);
    process.exit(1);
  }
}

main();
