const supabase = require('../supabase');

exports.cadastro = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ erro: "Preencha todos os campos" });
    }

    const { data, error } = await supabase
      .from('usuarios')
      .insert([{ nome, email, senha }]);

    if (error) {
      console.error(error);
      return res.status(500).json({ erro: "Erro ao cadastrar" });
    }

    res.json({ mensagem: "Cadastro realizado com sucesso" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ erro: "Erro no servidor" });
  }
};