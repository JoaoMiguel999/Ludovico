require('dotenv').config();

const express = require('express');
const cors = require('cors');
const supabase = require('../supabase');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// 🔐 CONFIG
const SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 3000;

// 🌐 MIDDLEWARES
app.use(cors()); // libera acesso (depois você pode restringir)
app.use(express.json());


// ===============================
// 🔎 ROTA /ME (USUÁRIO LOGADO)
// ===============================
app.get('/me', async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ erro: "Sem token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET);

    const { data, error } = await supabase
      .from('usuarios')
      .select('id, nome, email')
      .eq('id', decoded.id)
      .single();

    if (error || !data) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json(data);

  } catch (err) {
    res.status(401).json({ erro: "Token inválido" });
  }
});


// ===============================
// 📝 CADASTRO
// ===============================
app.post('/cadastro', async (req, res) => {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Preencha todos os campos"
    });
  }

  try {
    // 🔒 criptografar senha
    const senhaHash = await bcrypt.hash(senha, 10);

    const { error } = await supabase
      .from('usuarios')
      .insert([{ nome, email, senha: senhaHash }]);

    if (error) {
      return res.status(400).json({
        sucesso: false,
        mensagem: error.message
      });
    }

    res.json({
      sucesso: true,
      mensagem: "Usuário cadastrado com sucesso"
    });

  } catch (err) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro no servidor"
    });
  }
});


// ===============================
// 🔑 LOGIN
// ===============================
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({
      sucesso: false,
      mensagem: "Preencha todos os campos"
    });
  }

  try {
    const { data, error } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', email)
      .single();

    if (error || !data) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Email ou senha inválidos"
      });
    }

    // 🔒 comparar senha
    const senhaValida = await bcrypt.compare(senha, data.senha);

    if (!senhaValida) {
      return res.status(401).json({
        sucesso: false,
        mensagem: "Email ou senha inválidos"
      });
    }

    // 🔐 gerar token
    const token = jwt.sign(
      { id: data.id, email: data.email },
      SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      sucesso: true,
      token,
      usuario: {
        nome: data.nome,
        email: data.email
      }
    });

  } catch (err) {
    res.status(500).json({
      sucesso: false,
      mensagem: "Erro no servidor"
    });
  }
});


// ===============================
// 🚀 START SERVIDOR
// ===============================
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT} 🚀`);
});