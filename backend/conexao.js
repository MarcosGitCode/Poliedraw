import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão com o banco de dados MySQL
const db = await mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",        // coloque seu usuário
  password: "imtdb", // coloque sua senha
  database: "poliedro_ai"   // coloque o nome do seu banco
});

console.log("Conectado ao MySQL com sucesso");

// Cria tabela se não existir
await db.execute(`
  CREATE TABLE IF NOT EXISTS professores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
  )
`);

// Endpoint de login professor
app.post("/professores", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM professores WHERE email = ? AND senha = ?",
      [email, senha]
    );
    res.json({ success: rows.length > 0 });
  } catch (err) {
    console.error("Erro ao fazer login do professor:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

// endpoint de login alunos
app.post("/alunosLogin", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const [rows] = await db.execute(
      "SELECT * FROM alunos WHERE email = ? AND senha = ?",
      [email, senha]
    );
    res.json({ success: rows.length > 0 });
  } catch (err) {
    console.error("Erro ao fazer login do aluno:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});


// Endpoint para buscar alunos
app.get("/alunos", async (req, res) => {
  try {
    const [rows] = await db.execute("SELECT * FROM alunos");
    res.json(rows);
  } catch (err) {
    console.error("Erro ao buscar alunos:", err);
    res.status(500).json({ error: "Erro interno no servidor" });
  }
});

app.post("/cadastrarAlunos", async (req, res) => {
  const { nome, email, senha } = req.body;

  try {
    const [result] = await db.execute(
      "INSERT INTO alunos(nome, email, senha) VALUES(?, ?, ?)",
      [nome, email, senha]
    );

    res.json({ success: result.affectedRows > 0 });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao cadastrar aluno" });
  }
});

app.listen(3000, () => console.log("Servidor rodando em http://localhost:3000"));