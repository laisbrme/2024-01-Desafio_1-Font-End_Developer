const URL = "http://localhost:3400/produtos"

let listaProdutos = [];
let btnAdicionar = document.querySelector("#btn-adicionar");
let tabelaProdutos = document.querySelector("table>tbody");

// Obtendo produtos da API
function obterProdutos() {
    fetch(URL, {
        method: "GET",
        headers: {
            "Authorization" : obterToken()
        }
    })
    .then(response => response.json())
    .then(produtos => {
        listaProdutos = produtos;
        popularTabela(produtos);
    })
    .catch((erro) => {});
}

obterProdutos();

function popularTabela(produtos) {
    // Limpando a tabela para popular
    tabelaProdutos.textContent = "";

    produtos.forEach(produto => {

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
    
    //tdAcoes.textContent = `<a href="produto.html?id=${produto.id}">Editar</a> | <a href="produto.html?id=${produto.id}">Excluir</a>`;

    // Adicionando as tds na tabela
    tr.appendChild(tdId);
    tr.appendChild(tdNome);
    tr.appendChild(tdValor);
    tr.appendChild(tdQtdEstoque);
    tr.appendChild(tdObservacao);
    tr.appendChild(tdDataCadastro);
    tr.appendChild(tdAcoes);

    // Adicionando a linha na tabela
    tabelaProdutos.appendChild(tr);
}
// Para cada produto, preciso criar uma linha e adicionar as tds
//