import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import bcrypt from "bcryptjs";
import "dotenv/config";
import Gemini from "./gemini.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const app = express();

// Proteção CORS com lista de origens autorizadas locais
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "http://localhost:5500",
  "http://localhost:5502",
  "http://127.0.0.1:3000",
  "http://127.0.0.1:3001",
  "http://127.0.0.1:5500",
  "http://127.0.0.1:5502"
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin) || origin.startsWith("http://localhost:")) {
      return callback(null, true);
    }
    return callback(new Error("CORS: Origem não permitida"));
  },
  credentials: true
}));

app.use(express.json({ limit: '50mb' })); // Limite para suportar imagens Base64 grandes

// Servir frontend estático diretamente pelo Express
app.use(express.static(ROOT_DIR));
app.get("/", (req, res) => {
  res.redirect("/HTML/login.html");
});

// Configuração do Banco de Dados com credenciais estritamente do ambiente (.env)
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "";
const DB_NAME = process.env.DB_NAME || "poliedro_ai";

let db;
let dbDriver = "mysql";

try {
  const pool = await mysql.createPool({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME,
    connectTimeout: 3000
  });

  // Validação ativa da conexão MySQL
  await pool.query("SELECT 1");
  db = pool;
  console.log("Conectado ao MySQL:", `${DB_HOST}:${DB_PORT}/${DB_NAME}`);

  // DDL MySQL
  await db.query(`
    CREATE TABLE IF NOT EXISTS professores (
      id_professor INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS alunos (
      id_aluno INT AUTO_INCREMENT PRIMARY KEY,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS historico_pesquisa (
      id_pesquisa INT AUTO_INCREMENT PRIMARY KEY,
      tipo_usuario ENUM('professor','aluno') NOT NULL,
      id_usuario INT NOT NULL,
      termo_pesquisado TEXT NOT NULL,
      data_pesquisa DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS imagens_geradas (
      id_imagem INT AUTO_INCREMENT PRIMARY KEY,
      id_usuario INT NOT NULL,
      tipo_usuario ENUM('professor', 'aluno') NOT NULL,
      prompt TEXT NOT NULL,
      imagem LONGTEXT NOT NULL,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
} catch (mysqlErr) {
  console.warn(`⚠️ MySQL não disponível (${mysqlErr.message}). Ativando SQLite portátil local como fallback...`);
  const sqliteDb = await open({
    filename: path.join(ROOT_DIR, "BD", "poliedro.sqlite"),
    driver: sqlite3.Database
  });
  dbDriver = "sqlite";

  // Interface compatível com db.query(sql, params) => [rows / result]
  db = {
    async query(sql, params = []) {
      const cleanSql = sql.trim();
      const isSelect = /^SELECT/i.test(cleanSql);
      if (isSelect) {
        const rows = await sqliteDb.all(cleanSql, params);
        return [rows];
      } else {
        const result = await sqliteDb.run(cleanSql, params);
        return [{
          affectedRows: result.changes || 0,
          insertId: result.lastID || 0
        }];
      }
    }
  };

  // DDL SQLite
  await db.query(`
    CREATE TABLE IF NOT EXISTS professores (
      id_professor INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS alunos (
      id_aluno INTEGER PRIMARY KEY AUTOINCREMENT,
      nome VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      senha VARCHAR(255) NOT NULL
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS historico_pesquisa (
      id_pesquisa INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo_usuario TEXT NOT NULL,
      id_usuario INT NOT NULL,
      termo_pesquisado TEXT NOT NULL,
      data_pesquisa DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await db.query(`
    CREATE TABLE IF NOT EXISTS imagens_geradas (
      id_imagem INTEGER PRIMARY KEY AUTOINCREMENT,
      id_usuario INT NOT NULL,
      tipo_usuario TEXT NOT NULL,
      prompt TEXT NOT NULL,
      imagem LONGTEXT NOT NULL,
      data_criacao DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("Conectado ao SQLite local: BD/poliedro.sqlite");
}

// --- ROTAS DE AUTENTICAÇÃO (LOGIN COM BCRYPT & MIGRAÇÃO TRANSPARENTE) ---

app.post("/professores", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await db.query(
      "SELECT * FROM professores WHERE email = ?",
      [String(email).trim()]
    );

    if (rows.length > 0) {
      const user = rows[0];
      const inputPass = String(senha).trim();
      let isValid = false;

      // 1. Tenta validação via hash bcrypt
      try {
        isValid = await bcrypt.compare(inputPass, user.senha);
      } catch {
        isValid = false;
      }

      // 2. Fallback para senha em texto puro legada com migração automática para hash
      if (!isValid && user.senha === inputPass) {
        isValid = true;
        const hashed = await bcrypt.hash(inputPass, 10);
        await db.query("UPDATE professores SET senha = ? WHERE id_professor = ?", [hashed, user.id_professor]);
        console.log(`🔐 [Segurança] Senha do professor ${user.email} migrada para hash bcrypt com sucesso.`);
      }

      if (isValid) {
        res.json({ success: true, id: user.id_professor, nome: user.nome });
      } else {
        res.json({ success: false });
      }
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error("Erro login professor:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

app.post("/alunosLogin", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await db.query(
      "SELECT * FROM alunos WHERE email = ?",
      [String(email).trim()]
    );

    if (rows.length > 0) {
      const user = rows[0];
      const inputPass = String(senha).trim();
      let isValid = false;

      // 1. Tenta validação via hash bcrypt
      try {
        isValid = await bcrypt.compare(inputPass, user.senha);
      } catch {
        isValid = false;
      }

      // 2. Fallback para senha em texto puro legada com migração automática para hash
      if (!isValid && user.senha === inputPass) {
        isValid = true;
        const hashed = await bcrypt.hash(inputPass, 10);
        await db.query("UPDATE alunos SET senha = ? WHERE id_aluno = ?", [hashed, user.id_aluno]);
        console.log(`🔐 [Segurança] Senha do aluno ${user.email} migrada para hash bcrypt com sucesso.`);
      }

      if (isValid) {
        res.json({ success: true, id: user.id_aluno, nome: user.nome });
      } else {
        res.json({ success: false });
      }
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error("Erro login aluno:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// --- ROTAS DE IMAGENS ---

// 1. Salvar Imagem
app.post("/salvarImagem", async (req, res) => {
  const { id_usuario, tipo_usuario, prompt, imagem } = req.body;

  if (!id_usuario || !imagem) {
    return res.status(400).json({ error: "Dados incompletos" });
  }

  try {
    await db.query(
      "INSERT INTO imagens_geradas (id_usuario, tipo_usuario, prompt, imagem) VALUES (?, ?, ?, ?)",
      [id_usuario, tipo_usuario, prompt, imagem]
    );
    res.json({ success: true, message: "Imagem salva com sucesso!" });
  } catch (err) {
    console.error("Erro ao salvar imagem:", err);
    res.status(500).json({ error: "Erro ao salvar no banco" });
  }
});

// 2. Listar Minhas Imagens
app.get("/minhasImagens", async (req, res) => {
  const { id, tipo } = req.query; // Recebe via URL ?id=1&tipo=aluno

  if (!id || !tipo) return res.status(400).json({ error: "ID e Tipo obrigatórios" });

  try {
    const [rows] = await db.query(
      "SELECT * FROM imagens_geradas WHERE id_usuario = ? AND tipo_usuario = ? ORDER BY data_criacao DESC",
      [id, tipo]
    );
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar imagens:", err);
    res.status(500).json({ error: "Erro ao buscar imagens" });
  }
});

// --- CRUD DE ALUNOS COM SENHAS HASH BCRYPT ---

app.get("/alunos", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT id_aluno, nome, email FROM alunos");
    res.json(rows);
  } catch (err) {
    console.error("Erro /alunos:", err);
    res.status(500).json({ error: "Erro ao consultar alunos" });
  }
});

app.post("/cadastrarAlunos", async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(String(senha || "").trim(), 10);
    const [result] = await db.query(
      "INSERT INTO alunos (nome, email, senha) VALUES (?, ?, ?)",
      [nome, email, hashedPassword]
    );
    res.json({ success: result.affectedRows > 0, id: result.insertId });
  } catch (err) {
    console.error("Erro cadastrarAlunos:", err);
    res.status(500).json({ error: "Erro ao cadastrar aluno" });
  }
});

app.put("/alunos/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email, senha } = req.body;
  try {
    if (email && !email.endsWith("@sistemapoliedro")) {
      return res.status(400).json({ error: "Email deve terminar com @sistemapoliedro" });
    }

    let query = "UPDATE alunos SET nome = ?, email = ? WHERE id_aluno = ?";
    let params = [nome, email, id];

    if (senha && String(senha).trim().length > 0) {
      const hashedPassword = await bcrypt.hash(String(senha).trim(), 10);
      query = "UPDATE alunos SET nome = ?, email = ?, senha = ? WHERE id_aluno = ?";
      params = [nome, email, hashedPassword, id];
    }

    const [result] = await db.query(query, params);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Aluno não encontrado" });
    res.json({ success: true, message: "Aluno atualizado com sucesso!" });
  } catch (err) {
    console.error("Erro ao atualizar aluno:", err);
    res.status(500).json({ error: "Erro interno ao atualizar" });
  }
});

app.delete("/alunos/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM alunos WHERE id_aluno = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Aluno não encontrado" });
    res.json({ success: true, message: "Aluno excluído com sucesso!" });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
      return res.status(400).json({ error: "Não é possível excluir aluno com histórico." });
    }
    res.status(500).json({ error: "Erro interno ao excluir" });
  }
});

// --- ROTA DE EXCLUSÃO DE IMAGEM ---

app.delete("/imagens/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM imagens_geradas WHERE id_imagem = ?", [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Imagem não encontrada" });
    }
    res.json({ success: true, message: "Imagem excluída com sucesso!" });
  } catch (err) {
    console.error("Erro ao excluir imagem:", err);
    res.status(500).json({ error: "Erro interno ao excluir" });
  }
});

// --- ROTA DE GERAÇÃO COM IA (GEMINI OU ZERO-KEY FALLBACK) ---

app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt, userId } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt obrigatório" });

    // Gerar Imagem (Gemini 2.5 Flash Image ou Pollinations.ai gratuito)
    const resposta = await Gemini(prompt);
    res.json({ texto: resposta.text, imagens: resposta.images });
  } catch (err) {
    console.error("Erro /api/gemini:", err);
    res.status(500).json({ error: "Erro na geração da imagem" });
  }
});

const PORT = Number(process.env.PORT || 3001);
app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
  console.log(`Acesse a interface web em: http://localhost:${PORT}/HTML/login.html`);
});

export default db;
