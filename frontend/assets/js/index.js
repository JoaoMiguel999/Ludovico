document.addEventListener("DOMContentLoaded", () => {

  // 🔥 URL DO BACKEND
  const API = "https://ludovico.onrender.com";

  // Elementos
  const lista = document.getElementById("listaProdutos");
  const inputBusca = document.querySelector(".search-box input");
  const userMenu = document.querySelector(".user-menu");
  const dropdown = document.getElementById("dropdownUser");
  const userName = document.getElementById("userName");
  const userAvatar = document.getElementById("userAvatar");

  let produtosCache = [];

  // =========================
  // 🔔 TOAST
  // =========================
  function toast(msg) {
    const div = document.createElement("div");
    div.className = "toast";
    div.innerText = msg;
    document.body.appendChild(div);
    setTimeout(() => div.classList.add("show"), 100);
    setTimeout(() => {
      div.classList.remove("show");
      setTimeout(() => div.remove(), 300);
    }, 2000);
  }

  // =========================
  // 👤 DROPDOWN
  // =========================
  if (userMenu && dropdown) {
    userMenu.addEventListener("click", (e) => {
      e.stopPropagation();
      dropdown.classList.toggle("active");
    });

    document.addEventListener("click", () => {
      dropdown.classList.remove("active");
    });

    dropdown.addEventListener("click", (e) => {
      e.stopPropagation();
    });
  }

  // =========================
  // 🔐 USUÁRIO (JWT)
  // =========================
  async function carregarUsuario() {
    const token = localStorage.getItem("token");

    if (!token) {
      if (userName) userName.innerText = "Conta";
      if (userAvatar) userAvatar.src = "../ASSETS/IMG/user.png";

      if (dropdown) {
        dropdown.innerHTML = `
          <a href="login.html" class="item"><span>🔑</span> Entrar</a>
          <a href="cadastro.html" class="item"><span>📝</span> Cadastrar</a>
        `;
      }
      return;
    }

    try {
      const res = await fetch(`${API}/me`, {
        headers: {
          Authorization: "Bearer " + token
        }
      });

      if (!res.ok) throw new Error();

      const user = await res.json();

      if (userName) userName.innerText = user.nome;
      if (userAvatar) userAvatar.src = "../ASSETS/IMG/user.png";

      if (dropdown) {
        dropdown.innerHTML = `
          <div style="padding: 12px 18px; font-weight: 600; color: var(--primary); border-bottom: 1px solid var(--border);">
             Olá, ${user.nome}
          </div>
          <a href="#" class="item"><span>👤</span> Meu perfil</a>
          <a href="meuspedidos.html" class="item"><span>📦</span> Meus pedidos</a>
          <a href="#" id="logoutBtn" class="item logout"><span>🚪</span> Sair</a>
        `;

        document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
          e.preventDefault();
          localStorage.removeItem("token");
          toast("👋 Até logo!");
          setTimeout(() => location.reload(), 800);
        });
      }

    } catch (err) {
      console.error("Erro ao carregar usuário:", err);

      localStorage.removeItem("token");

      if (userName) userName.innerText = "Conta";
      if (dropdown) {
        dropdown.innerHTML = `
          <a href="login.html" class="item"><span>🔑</span> Entrar</a>
          <a href="cadastro.html" class="item"><span>📝</span> Cadastrar</a>
        `;
      }
    }
  }

  // =========================
  // 🌙 DARK MODE
  // =========================
  const btnIcon = document.getElementById("toggleDark");

  if (localStorage.getItem("dark") === "true") {
    document.body.classList.add("dark");
    if (btnIcon) btnIcon.textContent = "☀️";
  } else {
    if (btnIcon) btnIcon.textContent = "🌙";
  }

  document.addEventListener("click", (e) => {
    const btn = e.target.closest("#toggleDark");

    if (btn) {
      document.body.classList.toggle("dark");

      const isDark = document.body.classList.contains("dark");
      localStorage.setItem("dark", isDark);

      btn.textContent = isDark ? "☀️" : "🌙";
    }
  });

  // =========================
  // 🛍️ PRODUTOS
  // =========================
  async function carregarProdutos() {
    if (!lista) return;

    lista.innerHTML = "<p>Carregando produtos...</p>";

    try {
      const res = await fetch(`${API}/produtos`);

      if (!res.ok) throw new Error();

      const produtos = await res.json();
      produtosCache = produtos;

      renderizarProdutos(produtos);

    } catch (err) {
      console.error("Erro ao carregar produtos:", err);
      lista.innerHTML = "<p>Erro ao conectar com o servidor.</p>";
    }
  }

  function renderizarProdutos(produtos) {
    if (!lista) return;

    lista.innerHTML = "";

    if (!produtos.length) {
      lista.innerHTML = "<p>Nenhum produto disponível.</p>";
      return;
    }

    produtos.forEach(produto => {
      const div = document.createElement("div");
      div.className = "card-produto";

      div.innerHTML = `
        <img src="${produto.imagem || 'https://via.placeholder.com/300'}">
        <h3>${produto.nome}</h3>
        <p>${produto.descricao || ''}</p>
        <span>R$ ${produto.preco}</span>
        <button class="btn-cart">Adicionar</button>
      `;

      div.querySelector(".btn-cart")?.addEventListener("click", () => {
        toast("🛒 Adicionado ao carrinho");
      });

      lista.appendChild(div);
    });
  }

  // =========================
  // 🔍 BUSCA
  // =========================
  inputBusca?.addEventListener("input", () => {
    const termo = inputBusca.value.toLowerCase();

    const filtrados = produtosCache.filter(p =>
      p.nome.toLowerCase().includes(termo)
    );

    renderizarProdutos(filtrados);
  });

  // =========================
  // 🚀 START
  // =========================
  carregarUsuario();
  carregarProdutos();

});