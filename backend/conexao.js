import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import mysql from "mysql2/promise";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔌 Conexão com o banco de dados MySQL
const db = await mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",        // coloque seu usuário
  password: "12345", // coloque sua senha
  database: "poliedro_ai"   // coloque o nome do seu banco
});

console.log("✅ Conectado ao MySQL com sucesso!");

// 🧱 Cria tabela se não existir
await db.execute(`
  CREATE TABLE IF NOT EXISTS professores (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL
  )
`);

// 🧩 Endpoint de login
app.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM professores WHERE email = ? AND senha = ?",
      [email, senha]
    );

    if (rows.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error("Erro ao verificar login:", err);
    res.status(500).json({ success: false, error: "Erro interno no servidor" });
  }
});

app.listen(3000, () => console.log("🚀 Servidor rodando em http://localhost:3000"));
