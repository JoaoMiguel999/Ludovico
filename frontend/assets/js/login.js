document.getElementById("formLogin").addEventListener("submit", async (e) => {
  e.preventDefault();

  const API = "https://ludovico.onrender.com";

  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const btn = e.target.querySelector("button");

  if (!email || !senha) {
    return alert("Preencha todos os campos");
  }

  btn.disabled = true;
  btn.innerText = "Entrando...";

  try {
    const response = await fetch(`${API}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, senha })
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = {};
    }

    if (!response.ok) {
      return alert(data.mensagem || "Erro no login");
    }

    // 🔐 salva token
    localStorage.setItem("token", data.token);

    alert("Login realizado com sucesso");

    setTimeout(() => {
      window.location.href = "index.html";
    }, 1000);

  } catch (err) {
    console.error(err);
    alert("Erro ao conectar com o servidor");
  } finally {
    btn.disabled = false;
    btn.innerText = "Entrar";
  }
});