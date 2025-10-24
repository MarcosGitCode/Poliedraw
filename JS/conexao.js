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
  password: "imtdb", // coloque sua senha
  database: "login_db"   // coloque o nome do seu banco
});

console.log("✅ Conectado ao MySQL com sucesso!");

// 🧱 Cria tabela se não existir
await db.execute(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(255)
  )
`);

// 🧩 Endpoint de login
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const [rows] = await db.execute(
      "SELECT * FROM usuarios WHERE username = ? AND password = ?",
      [username, password]
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
