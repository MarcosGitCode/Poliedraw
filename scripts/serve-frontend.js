import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import 'dotenv/config';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PORT = Number(process.env.FRONTEND_PORT || 5502);

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp'
};

export function startFrontendServer() {
  const server = http.createServer((req, res) => {
    const rawUrl = req.url || '/';
    const parsedPath = rawUrl.split('?')[0];

    // Redireciona a raiz para a tela de login
    if (parsedPath === '/' || parsedPath === '/index.html') {
      res.writeHead(302, { Location: '/HTML/login.html' });
      return res.end();
    }

    // Resolve caminho seguro relativo à raiz do projeto
    const sanitizedPath = path.normalize(parsedPath).replace(/^(\.\.[/\\])+/, '');
    const filePath = path.join(ROOT_DIR, sanitizedPath);

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end(`404 Não Encontrado: ${parsedPath}`);
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'no-cache, no-store, must-revalidate'
      });
      fs.createReadStream(filePath).pipe(res);
    });
  });

  server.listen(PORT, () => {
    console.log(`🌐 [Frontend] Interface web ativa em: http://localhost:${PORT}/HTML/login.html`);
  });

  return server;
}

if (process.argv[1]?.endsWith('serve-frontend.js')) {
  startFrontendServer();
}
