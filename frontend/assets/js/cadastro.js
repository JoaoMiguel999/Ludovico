document.getElementById("formCadastro").addEventListener("submit", async (e) => {
  e.preventDefault();

  // 🔥 URL DO BACKEND
  const API = "https://ludovico.onrender.com";

  const nome = document.getElementById("nome").value.trim();
  const email = document.getElementById("email").value.trim();
  const senha = document.getElementById("senha").value.trim();

  // 🔒 validação
  if (!nome || !email || !senha) {
    return alert("Preencha todos os campos");
  }

  try {
    const response = await fetch(`${API}/cadastro`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ nome, email, senha })
    });

    let data;

    try {
      data = await response.json();
    } catch {
      throw new Error("Resposta inválida do servidor");
    }

    if (!response.ok) {
      return alert(data.mensagem || data.erro || "Erro ao cadastrar");
    }

    // ✅ sucesso
    alert(data.mensagem || "Cadastro realizado com sucesso!");

    document.getElementById("formCadastro").reset();

    // redireciona
    setTimeout(() => {
      window.location.href = "Login.html";
    }, 1000);

  } catch (error) {
    console.error("Erro:", error);
    alert("Erro ao conectar com o servidor");
  }
});