const inicializarSistemaUsuario = () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    const dropdown = document.getElementById("dropdownUser");
    const userNameText = document.getElementById("userName");
    const naoLogado = document.getElementById("naoLogado");
    const logado = document.getElementById("logado");
    const nomeUsuario = document.getElementById("nomeUsuario");

    // UI Login
    if (usuario) {
        if (naoLogado) naoLogado.style.display = "none";
        if (logado) logado.style.display = "block";
        if (nomeUsuario) nomeUsuario.textContent = `Olá, ${usuario.nome}`;
        if (userNameText) userNameText.textContent = usuario.nome;
    } else {
        if (naoLogado) naoLogado.style.display = "block";
        if (logado) logado.style.display = "none";
        if (userNameText) userNameText.textContent = "Conta";
    }

    // Dropdown
    document.addEventListener("click", (e) => {
        const isUserMenu = e.target.closest(".user-menu");
        const isDropdown = e.target.closest(".dropdown-user");

        if (isUserMenu) {
            e.preventDefault();
            dropdown.classList.toggle("active");
        } else if (!isDropdown) {
            dropdown.classList.remove("active");
        }
    });
};

// Start
if (document.readyState === "complete" || document.readyState === "interactive") {
    inicializarSistemaUsuario();
} else {
    document.addEventListener("DOMContentLoaded", inicializarSistemaUsuario);
}

// Logout
function logout() {
    localStorage.removeItem("usuario");
    window.location.reload();
}