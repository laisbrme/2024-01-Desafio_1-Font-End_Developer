const URL = "http://localhost:3400/produtos"

let listaProduto = [];
let btnAdicionar = document.querySelector("#btn-adicionar");
let tabelaProduto = document.querySelector("table>tbody");
let modalProduto = new bootstrap.Modal(document.getElementById("modal-produto"));

let formModal = {
    id: document.querySelector("#id"),
    nome: document.querySelector("#nome"),
    valor: document.querySelector("#valor"),
    qtdEstoque: document.querySelector("#qtdEstoque"),
    observacao: document.querySelector("#observacao"),
    dataCadastro: document.querySelector("#dataCadastro"),
    btnSalvar: document.querySelector("#btn-salvar"),
    btnCancelar: document.querySelector("#btn-cancelar")
}

btnAdicionar.addEventListener("click", () => {
    limparModalProduto(),
    modalProduto.show()
});

// Obtendo produtos da API
function obterProduto() {
    fetch(URL, {
        method: "GET",
        headers: {
            "Authorization" : obterToken()
        }
    })
    .then(response => response.json())
    .then(produto => {
        listaProduto = produto;
        popularTabela(produto);
    })
    .catch((erro) => {});
}

obterProduto();

function popularTabela(produto) {

    // Limpando a tabela para popular
    tabelaProduto.textContent = "";

    produto.forEach(produto => {
        criarLinhaNaTabela(produto)
    });
}

function criarLinhaNaTabela(produto) {

    // Criando uma linha na tabela
    let tr = document.createElement('tr');

    // Criando as tds dos conteúdos da tabela
    let tdId = document.createElement('td');
    let tdNome = document.createElement('td');
    let tdValor = document.createElement('td');
    let tdQtdEstoque = document.createElement('td');
    let tdObservacao = document.createElement('td');
    let tdDataCadastro = document.createElement('td');
    let tdAcoes = document.createElement('td');

    // Atualizando com base no produto
    tdId.textContent = produto.id;
    tdNome.textContent = produto.nome;
    tdValor.textContent = produto.valor;
    tdQtdEstoque.textContent = produto.qtdEstoque;
    tdObservacao.textContent = produto.observacao;
    tdDataCadastro.textContent = new Date(produto.dataCadastro).toLocaleDateString();
    tdAcoes.innerHTML =    `<button onclick="editarProduto ${produto.id}" class="btn btn-outline-success btn-sm mr-3">
                                Editar
                            </button>
                            <button onclick="excluirProduto ${produto.id}" class="btn btn-outline-success btn-sm mr-3">
                                Excluir
                            </button>`;

    // Adicionando as tds na tabela
    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdValor);
    tr.appendChild(tdQtdEstoque);
    tr.appendChild(tdObservacao);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    // Adicionando a linha na tabela
    tabelaProduto.appendChild(tr);
}

formModal.btnSalvar.addEventListener("click", () => {

    // Capturando os dados da tela do modal e transformar em um produto
    let produto = obterProdutoDoModal();

    // Verificando se os campos obrigatórios foram preenchidos
    if (!produto.validar()){
        alert("Preencha todos os campos obrigatórios");
        return;
    }

    // Adicionando na API - Backend
    adicionarProdutoNoBackend(produto);
});

function obterProdutoDoModal() {

    return new Produto({
        id: formModal.id.value,
        nome: formModal.nome.value,
        valor: formModal.valor.value,
        qtdEstoque: formModal.qtdEstoque.value,
        observacao: formModal.observacao.value,
        dataCadastro: (formModal.dataCadastro.value) // Condição
            ? new Date(formModal.dataCadastro.value).toISOString() // Se verdadero
            : new Date().toDateString() // Se falso
    });
}

function adicionarProdutoNoBackend(produto) {

    fetch(URL, {
        method: "POST",
        headers: {
            Authorization: obterToken(),
            "Content-Type": "application/json"
        },
        body: JSON.stringify(produto)
    })
    .then(response => response.json())
    .then(response => {
        let novoProduto = new Produto(response);
        listaProduto.push(novoProduto);

        popularTabela(listaProduto);

        // Fechar modal
        modalProduto.hide();

        // Exibir mensagem de produto cadastrado com sucesso
        alert(`Produto ${produto.nome} cadastrado com sucesso!`)
    })
}

function limparModalProduto() {

    formModal.id.value = "";
    formModal.nome.value = "";
    formModal.valor.value = "";
    formModal.qtdEstoque.value = "";
    formModal.observacao.value = "";
    formModal.dataCadastro.value = "";
}

function excluirProduto(id) {

    let produto = listaProduto.find(produto => produto.id == id);

    if (confirm("Deseja realmente excluir o produto " + produto.nome)) {
        excluirProdutoNoBackend(id);
    }
}

function excluirProdutoNoBackend(id) {

    fetch(`${URL}/${id}`, {
        method: "DELETE",
        headers: {
            Authorization: obterToken()
        }
    })
   .then(() => {
        removerProdutoDaLista(id);
        popularTabela(listaProduto);
   })
}

function removerProdutoDaLista(id) {

    let indice = listaProduto.findIndex(produto => produto.id == id);

    listaProduto.splice(indice, 1);
}

function logout() {
    // Saindo do sistema removendo token, usuário e retornando para a tela de login
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.open("login.html", "_self");
}

function editarProduto(id) {

    let produto = listaProduto.find(produto => produto.id == id);
    
    if (confirm("Deseja realmente editar o produto " + produto.nome)) {
        editarProdutoNoBackend(id);
    }
}

function editarProdutoNoBackend(id) {
    fetch(`${URL}/${id}`, {
        method: "PUT",
        headers: {
            "Authorization" : obterToken()
        },
    })
    .then(() => {
        editarProdutoProdutoDaLista(id);
        popularTabela(listaProduto);
    })
}

function editarProdutoProdutoDaLista(id) {
    let indice = listaProduto.findIndex(produto => produto.id == id);
    listaProduto[indice] = obterProdutoDoModal();
    popularTabela(listaProduto);
    alert("Produto editado com sucesso!");
    modalProduto.hide();
}