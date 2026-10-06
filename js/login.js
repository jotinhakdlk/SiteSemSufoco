// ============================================================
// CADASTRO DO USUÁRIO
// Este arquivo é usado apenas na página index.html.
// ============================================================

function CadastroConta() {
    // 1. Pegamos os valores digitados pelo usuário.
    const nomeUsuario = document.getElementById("nomeUsuario").value.trim();
    const emailUsuario = document.getElementById("emailUsuario").value.trim();
    const rendaMensal = Number(document.getElementById("rendaMensal").value);
    const aviso = document.getElementById("aviso");

    // 2. Conferimos se todos os campos foram preenchidos corretamente.
    if (nomeUsuario === "" || emailUsuario === "" || !(rendaMensal > 0)) {
        aviso.innerHTML = "<strong>Preencha todos os campos corretamente!</strong>";
        return;
    }

    // 3. Salvamos os dados. O try/catch evita que um erro do localStorage
    //    (ex.: navegador bloqueando armazenamento) pare o código antes do redirecionamento.
    try {
        localStorage.setItem("nomeUsuario", nomeUsuario);
        localStorage.setItem("emailUsuario", emailUsuario);
        localStorage.setItem("rendaMensal", String(rendaMensal));

        // Novo cadastro = começa do zero. Isso evita que meses criados antes
        // continuem com a renda antiga.
        localStorage.removeItem("receitasPorMes");
        localStorage.removeItem("produtosPorMes");
    } catch (erro) {
        console.error("Erro ao salvar no localStorage:", erro);
        aviso.innerHTML = "<strong>Não foi possível salvar seus dados neste navegador.</strong>";
        return;
    }

    // 4. Só depois de salvar os dados fazemos o redirecionamento.
    //    O caminho é calculado a partir da URL da página atual (index.html).
    window.location.href = new URL("html/telaInicial.html", window.location.href).href;
}
