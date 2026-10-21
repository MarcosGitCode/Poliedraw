import mysql from 'mysql2/promise';
import 'dotenv/config';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'imtdb';
const DB_NAME = process.env.DB_NAME || 'poliedro_ai';

export async function runSeed() {
  console.log('🔄 [Seed] Verificando e provisionando banco de dados MySQL...');
  
  // 1. Conecta sem database para garantir criação do schema poliedro_ai
  const rootConn = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS
  });
  await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_NAME}\`;`);
  await rootConn.end();

  // 2. Conecta no banco poliedro_ai
  const db = await mysql.createConnection({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
  });

  // 3. Cria tabelas (caso ainda não tenham sido criadas)
  await db.query(`
    CREATE TABLE IF NOT EXISTS professores (
      id_professor INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS alunos (
      id_aluno INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS historico_pesquisa (
      id_pesquisa INT AUTO_INCREMENT PRIMARY KEY,
      tipo_usuario ENUM('professor','aluno') NOT NULL,
      id_usuario INT NOT NULL,
      termo_pesquisado TEXT NOT NULL,
      data_pesquisa DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  await db.query(`
    CREATE TABLE IF NOT EXISTS imagens_geradas (
      id_imagem INT AUTO_INCREMENT PRIMARY KEY,
      id_usuario INT NOT NULL,
      tipo_usuario ENUM('professor', 'aluno') NOT NULL,
      prompt TEXT NOT NULL,
      imagem LONGTEXT NOT NULL,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 4. Insere usuários de teste padrão de forma idempotente
  const [prof] = await db.query('SELECT id_professor FROM professores WHERE email = ?', ['gui@sistemapoliedro']);
  if (prof.length === 0) {
    await db.query('INSERT INTO professores (nome, email, senha) VALUES (?, ?, ?)', [
      'Guilherme 43',
      'gui@sistemapoliedro',
      '4343'
    ]);
    console.log('✅ [Seed] Professor de teste inserido (gui@sistemapoliedro / 4343)');
  }

  const [aluno] = await db.query('SELECT id_aluno FROM alunos WHERE email = ?', ['aluno@sistemapoliedro']);
  if (aluno.length === 0) {
    await db.query('INSERT INTO alunos (nome, email, senha) VALUES (?, ?, ?)', [
      'Guilherme43',
      'aluno@sistemapoliedro',
      '43'
    ]);
    console.log('✅ [Seed] Aluno de teste inserido (aluno@sistemapoliedro / 43)');
  }

  await db.end();
  console.log('✨ [Seed] Banco de dados pronto para uso!');
}

if (process.argv[1]?.endsWith('seed.js')) {
  runSeed().catch(err => {
    console.error('❌ [Seed] Erro ao aplicar seeds:', err.message);
    process.exit(1);
  });
}
