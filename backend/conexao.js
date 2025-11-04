import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import "dotenv/config";
import Gemini from "./gemini.js";

const app = express();
app.use(cors());
app.use(express.json());

const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = Number(process.env.DB_PORT || 3306);
const DB_USER = process.env.DB_USER || "root";
const DB_PASS = process.env.DB_PASS || "imtdb";
const DB_NAME = process.env.DB_NAME || "poliedro_ai";

const db = await mysql.createPool({
  host: DB_HOST,
  port: DB_PORT,
  user: DB_USER,
  password: DB_PASS,
  database: DB_NAME
});

console.log("Conectado ao MySQL:", `${DB_HOST}:${DB_PORT}/${DB_NAME}`);

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

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  const e = String(email ?? "").trim();
  const s = String(senha ?? "").trim();

  try {
    const [profRows] = await db.query("SELECT * FROM professores WHERE email = ?", [e]);
    if (profRows.length && String(profRows[0].senha).trim() === s) {
      return res.json({ success: true, tipo: "professor", id: profRows[0].id_professor, nome: profRows[0].nome });
    }

    const [alunoRows] = await db.query("SELECT * FROM alunos WHERE email = ?", [e]);
    if (alunoRows.length && String(alunoRows[0].senha).trim() === s) {
      return res.json({ success: true, tipo: "aluno", id: alunoRows[0].id_aluno, nome: alunoRows[0].nome });
    }

    res.json({ success: false });
  } catch (err) {
    console.error("Erro /login:", err);
    res.status(500).json({ success: false, error: "INTERNAL" });
  }
});

app.post("/professores", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM professores WHERE email = ? AND senha = ?", [String(email).trim(), String(senha).trim()]);
    res.json({ success: rows.length > 0 });
  } catch (err) {
    console.error("Erro login professor:", err);
    res.status(500).json({ error: "INTERNAL" });
  }
});

app.post("/alunosLogin", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM alunos WHERE email = ? AND senha = ?", [String(email).trim(), String(senha).trim()]);
    res.json({ success: rows.length > 0 });
  } catch (err) {
    console.error("Erro login aluno:", err);
    res.status(500).json({ error: "INTERNAL" });
  }
});

app.get("/alunos", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM alunos");
    res.json(rows);
  } catch (err) {
    console.error("Erro /alunos:", err);
    res.status(500).json({ error: "INTERNAL" });
  }
});

app.post("/cadastrarAlunos", async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const [result] = await db.query("INSERT INTO alunos (nome, email, senha) VALUES (?, ?, ?)", [nome, email, senha]);
    res.json({ success: result.affectedRows > 0, id: result.insertId });
  } catch (err) {
    console.error("Erro cadastrarAlunos:", err);
    res.status(500).json({ error: "INTERNAL" });
  }
});

app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt obrigatório" });

    const resposta = await Gemini(prompt);
    res.json({ texto: resposta.text, imagens: resposta.images });
  } catch (err) {
    console.error("Erro /api/gemini:", err);
    res.status(500).json({ error: "GEMINI_ERROR" });
  }
});

const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

export default db;