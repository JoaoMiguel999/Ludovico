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
      dropdown.classList.toggle("open"); // ✅ corrigido
    });

    document.addEventListener("click", () => {
      dropdown.classList.remove("open"); // ✅ corrigido
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

    // ❌ NÃO LOGADO
    if (!token) {
      if (userName) userName.innerText = "Conta";
      if (userAvatar) userAvatar.src = "/assets/img/user.png"; // ✅ corrigido

      if (dropdown) {
        dropdown.innerHTML = `
          <a href="login.html" class="dropdown-item">🔑 Entrar</a>
          <a href="cadastro.html" class="dropdown-item">📝 Criar conta</a>
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

      // 🔥 token inválido
      if (res.status === 401) {
        localStorage.removeItem("token");
        return carregarUsuario();
      }

      if (!res.ok) throw new Error();

      const user = await res.json();

      // 🔐 proteção básica XSS
      const nomeSeguro = (user.nome || "Usuário").replace(/</g, "&lt;");

      if (userName) userName.innerText = nomeSeguro;
      if (userAvatar) userAvatar.src = "/assets/img/user.png"; // ✅ corrigido

      if (dropdown) {
        dropdown.innerHTML = `
          <div class="dropdown-user-info">
            Olá, ${nomeSeguro}
          </div>

          <a href="#" class="dropdown-item">👤 Meu perfil</a>
          <a href="meuspedidos.html" class="dropdown-item">📦 Meus pedidos</a>

          <div class="dropdown-sep"></div>

          <a href="#" id="logoutBtn" class="dropdown-item danger">🚪 Sair</a>
        `;

        // 🚪 LOGOUT
        document.getElementById("logoutBtn")?.addEventListener("click", (e) => {
          e.preventDefault();

          localStorage.removeItem("token");

          toast("👋 Até logo!");

          setTimeout(() => {
            window.location.href = "login.html"; // ✅ melhor UX
          }, 800);
        });
      }

    } catch (err) {
      console.error("Erro ao carregar usuário:", err);

      localStorage.removeItem("token");

      if (userName) userName.innerText = "Conta";

      if (dropdown) {
        dropdown.innerHTML = `
          <a href="login.html" class="dropdown-item">🔑 Entrar</a>
          <a href="cadastro.html" class="dropdown-item">📝 Criar conta</a>
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
      const controller = new AbortController();
      setTimeout(() => controller.abort(), 5000); // timeout

      const res = await fetch(`${API}/produtos`, {
        signal: controller.signal
      });

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

    produtos.forEach((produto, index) => {
      const div = document.createElement("div");
      div.className = "card-produto";
      div.style.setProperty("--i", index + 1); // animação

      div.innerHTML = `
        <div class="card-img-wrap">
          <img src="${produto.imagem || 'https://via.placeholder.com/300'}">
        </div>

        <div class="card-body">
          <div class="card-nome">${produto.nome}</div>
          <div class="card-desc">${produto.descricao || ''}</div>

          <div class="card-bottom">
            <div class="card-preco">R$ ${produto.preco}</div>

            <div class="card-actions">
              <button class="btn-cart">Adicionar</button>
            </div>
          </div>
        </div>
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
      (p.nome || "").toLowerCase().includes(termo)
    );

    renderizarProdutos(filtrados);
  });

  // =========================
  // 🚀 START
  // =========================
  carregarUsuario();
  carregarProdutos();

});