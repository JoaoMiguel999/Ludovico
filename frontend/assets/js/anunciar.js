document.getElementById("formProduto").addEventListener("submit", function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value;
  const preco = document.getElementById("preco").value;
 const telefone = document.getElementById("telefone").value;
  const descricao = document.getElementById("descricao").value;
  const imagemInput = document.getElementById("imagem");

  const file = imagemInput.files[0];
  const reader = new FileReader();

  reader.onload = function() {
    const produto = {
  nome,
  preco,
  descricao,
  imagem: reader.result,
  telefone
};

    let produtos = JSON.parse(localStorage.getItem("produtos")) || [];
    produtos.push(produto);

    localStorage.setItem("produtos", JSON.stringify(produtos));

    alert("Produto publicado com sucesso!");
    window.location.href = "index.html";
  };

  if (file) {
    reader.readAsDataURL(file);
  }
});