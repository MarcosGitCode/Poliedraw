import express from "express";
import cors from "cors";
import mysql from "mysql2/promise";
import "dotenv/config";
import Gemini from "./gemini.js";
import fs from "fs";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' })); // Aumentado o limite para aceitar imagens grandes

// Configuração do Banco de Dados
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

// Criação das tabelas (garantia)
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

// --- ROTAS DE AUTENTICAÇÃO (LOGIN) ---

app.post("/professores", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await db.query("SELECT * FROM professores WHERE email = ? AND senha = ?", 
    [String(email).trim(), String(senha).trim()]);
    
    if (rows.length > 0) {
        // Retorna sucesso E os dados do usuário
        res.json({ success: true, id: rows[0].id_professor, nome: rows[0].nome });
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
    const [rows] = await db.query("SELECT * FROM alunos WHERE email = ? AND senha = ?", 
    [String(email).trim(), String(senha).trim()]);
    
    if (rows.length > 0) {
        // Retorna sucesso E os dados do usuário
        res.json({ success: true, id: rows[0].id_aluno, nome: rows[0].nome });
    } else {
        res.json({ success: false });
    }
  } catch (err) {
    console.error("Erro login aluno:", err);
    res.status(500).json({ error: "Erro interno" });
  }
});

// --- ROTAS DE IMAGENS (NOVO) ---

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

// --- CRUD DE ALUNOS ---

app.get("/alunos", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM alunos");
    res.json(rows);
  } catch (err) {
    console.error("Erro /alunos:", err);
    res.status(500).json({ error: "Erro complicado" });
  }
});

app.post("/cadastrarAlunos", async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const [result] = await db.query("INSERT INTO alunos (nome, email, senha) VALUES (?, ?, ?)", 
    [nome, email, senha]);
    res.json({ success: result.affectedRows > 0, id: result.insertId });
  } catch (err) {
    console.error("Erro cadastrarAlunos:", err);
    res.status(500).json({ error: "Erro ao cadastrar aluno" });
  }
});

app.put("/alunos/:id", async (req, res) => {
  const { id } = req.params;
  const { nome, email } = req.body;
  try {
    if (email && !email.endsWith("@sistemapoliedro")) {
         return res.status(400).json({ error: "Email deve terminar com @sistemapoliedro" });
    }
    const [result] = await db.query(
      "UPDATE alunos SET nome = ?, email = ? WHERE id_aluno = ?", 
      [nome, email, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: "Aluno não encontrado" });
    res.json({ success: true, message: "Aluno atualizado!" });
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
    res.json({ success: true, message: "Aluno excluído!" });
  } catch (err) {
    if (err.code === 'ER_ROW_IS_REFERENCED_2') {
        return res.status(400).json({ error: "Não é possível excluir aluno com histórico." });
    }
    res.status(500).json({ error: "Erro interno ao excluir" });
  }
});

// --- GEMINI ---

app.post("/api/gemini", async (req, res) => {
  try {
    const { prompt, userId } = req.body;
    if (!prompt) return res.status(400).json({ error: "prompt obrigatório" });

    // --- COMENTE ESTAS LINHAS PARA O LIVE SERVER NÃO RECARREGAR ---
    /*
    const filePath = path.resolve("messages.json");
    let historico = [];
    if (fs.existsSync(filePath)) {
        try { historico = JSON.parse(fs.readFileSync(filePath, "utf8")); } catch (e) {}
    }
    historico.push({ userId, prompt, timestamp: new Date().toISOString() });
    fs.writeFileSync(filePath, JSON.stringify(historico, null, 2));
    */
    // -------------------------------------------------------------

    // Gerar Imagem
    const resposta = await Gemini(prompt);
    res.json({ texto: resposta.text, imagens: resposta.images });
  } catch (err) {
    console.error("Erro /api/gemini:", err);
    res.status(500).json({ error: "Erro no Gemini" });
  }
});
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

// ROTA PARA EXCLUIR IMAGEM
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

// app.listen... (mantém o que já estava)
const PORT = Number(process.env.PORT || 3000);
app.listen(PORT, () => console.log(`Servidor rodando em http://localhost:${PORT}`));

export default db;