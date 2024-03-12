function salvarToken(token) {
    // Aqui salvo o usuário na Storage
    return localStorage.setItem("token", token);
}

function obterToken(token) {
    // Aqui obtenho o token da Storage
    return localStorage.getItem("token");
}

function salvarUsuario(usuario) {
    // Aqui pego o usuário em obj e converto para json e salvo na storage
    return localStorage.setItem("usuario", JSON.stringify(usuario));
}

function obterUsuario(usuario) {
    // Pego o usuário como json na storage e converto para objeto e devolvo no return
    let usuarioStore = localStorage.getItem("usuario");
    return JSON.parse(usuarioStore);
}

function sairDoSistema() {
    // Saindo do sistema removendo token, usuário e retornando para a tela de login
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
    window.open("login.html", "_self");
}