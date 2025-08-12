const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString:
    "postgresql://neondb_owner:npg_4wOJRAf1jExy@ep-divine-star-acgfhauf-pooler.sa-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require",
  ssl: {
    rejectUnauthorized: false,
  },
});
app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM usuarios");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao listar usuarios");
  }
});

app.post("/usuarios", async (req, res) => {
  const { nome, email, senha } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO usuarios (nome, email, senha) VALUES ($1, $2, $3) RETURNING *",
      [nome, email, senha]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.log(err);
  }
});

//rota de login

app.post("/login", async (req, res) => {
  const { email, senha } = req.body;
  try {
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE email = $1 AND senha = $2",
      [email, senha]
    );
    if (result.rowCount > 0) {
      res.status(200).json({ mensagem: "Usuário logado com sucesso!" });
    } else {
      res.status(401).json({ erro: "Email ou senha inválidos" });
    }
  } catch (err) {
    console.log("Erro : ", err);
    res.status(500).json({ erro: "Erro no servidor" });
  }
});

app.listen(3000, () => {
  console.log(`Servidor rodando na porta 3000`);
});
