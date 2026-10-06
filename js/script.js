// ============================================================
// TELA INICIAL - SEM SUFOCO
// Responsável pela saudação, meses, gastos e receitas.
// ============================================================

const nomesMeses = {
    janeiro: "Janeiro",
    fevereiro: "Fevereiro",
    marco: "Março",
    abril: "Abril",
    maio: "Maio",
    junho: "Junho",
    julho: "Julho",
    agosto: "Agosto",
    setembro: "Setembro",
    outubro: "Outubro",
    novembro: "Novembro",
    dezembro: "Dezembro"
};

// Produtos continuam separados por mês.
let produtosPorMes = carregarProdutos();

// Cada mês guarda a receita fixa daquele mês e suas receitas extras.
// Exemplo:
// receitasPorMes.janeiro = { base: 2500, extras: [{ descricao: "Freela", valor: 300 }] }
let receitasPorMes = carregarReceitas();

// Controla quais meses já foram criados nesta tela.
const mesesCriados = new Set();

document.addEventListener("DOMContentLoaded", function () {
    mostrarSaudacao();

    const botaoAdicionarMes = document.getElementById("botaoAdicionarMes");
    if (botaoAdicionarMes) {
        botaoAdicionarMes.addEventListener("click", adicionarMes);
    }
});

// ============================================================
// 1. SAUDAÇÃO
// ============================================================

function mostrarSaudacao() {
    const saudacao = document.getElementById("saudacao");
    if (!saudacao) return;

    const nomeCompleto = localStorage.getItem("nomeUsuario");

    if (nomeCompleto) {
        const primeiroNome = nomeCompleto.split(" ")[0];
        saudacao.textContent = `Olá, ${primeiroNome}!`;
    } else {
        saudacao.textContent = "Olá!";
    }
}

// ============================================================
// 2. CRIAÇÃO DOS MESES
// ============================================================

function adicionarMes() {
    const selectMes = document.getElementById("mesSelecionado");
    const avisoMes = document.getElementById("avisoMes");
    const mes = selectMes.value;

    avisoMes.textContent = "";

    if (mes === "") {
        avisoMes.textContent = "Selecione um mês antes de continuar.";
        return;
    }

    if (mesesCriados.has(mes)) {
        avisoMes.textContent = `${nomesMeses[mes]} já foi adicionado.`;
        document.getElementById(`mes-${mes}`).scrollIntoView({ behavior: "smooth" });
        return;
    }

    criarCampoDoMes(mes);
    mesesCriados.add(mes);
    selectMes.value = "";
}

function criarCampoDoMes(mes) {
    const containerMeses = document.getElementById("containerMeses");

    // Se ainda não houver receita salva para este mês,
    // usamos como padrão a renda mensal cadastrada pelo usuário.
    prepararReceitaDoMes(mes);

    const campoMes = document.createElement("article");
    campoMes.classList.add("campoMes");
    campoMes.id = `mes-${mes}`;

    campoMes.innerHTML = `
        <div class="cabecalhoMes">
            <div>
                <p class="legendaMes">Controle financeiro</p>
                <h2>${nomesMeses[mes]}</h2>
            </div>

            <div class="resumosFinanceiros">
                <div class="resumoMes resumoGastos">
                    <span>Gastos do mês</span>
                    <strong id="total-${mes}">R$ 0,00</strong>
                </div>

                <div class="resumoMes resumoReceita">
                    <span>Receita atual</span>
                    <strong id="receita-${mes}">R$ 0,00</strong>
                </div>

                <div class="resumoMes resumoLucro">
                    <span>Lucro do mês</span>
                    <strong id="lucro-${mes}">R$ 0,00</strong>
                    <small id="status-${mes}">Sem gastos</small>
                </div>
            </div>
        </div>

        <!-- ==================================================
             ÁREA DE RECEITAS
             ================================================== -->
        <section class="areaReceitas">
            <div class="tituloSecao">
                <div>
                    <h3>Receitas</h3>
                    <p>A receita mensal começa com o valor cadastrado.</p>
                </div>
            </div>

            <div class="formReceita">
                <div class="grupoCampo">
                    <label for="receitaBase-${mes}">Receita mensal</label>
                    <input
                        type="number"
                        id="receitaBase-${mes}"
                        min="0"
                        step="0.01"
                        value="${receitasPorMes[mes].base}"
                        placeholder="0,00"
                    >
                </div>

                <button
                    type="button"
                    class="botaoPrincipal"
                    onclick="salvarReceitaBase('${mes}')"
                >
                    Modificar receita
                </button>
            </div>

            <div class="formReceitaExtra">
                <div class="grupoCampo">
                    <label for="descricaoExtra-${mes}">Descrição da receita extra</label>
                    <input
                        type="text"
                        id="descricaoExtra-${mes}"
                        placeholder="Ex.: Trabalho extra"
                    >
                </div>

                <div class="grupoCampo">
                    <label for="valorExtra-${mes}">Valor da receita extra</label>
                    <input
                        type="number"
                        id="valorExtra-${mes}"
                        min="0.01"
                        step="0.01"
                        placeholder="0,00"
                    >
                </div>

                <button
                    type="button"
                    class="botaoPrincipal"
                    onclick="adicionarReceitaExtra('${mes}')"
                >
                    Adicionar receita extra
                </button>
            </div>

            <p id="avisoReceita-${mes}" class="mensagemAviso"></p>

            <div class="extrasLista" id="extras-${mes}"></div>
        </section>

        <!-- ==================================================
             ÁREA DE PRODUTOS/GASTOS
             ================================================== -->
        <section class="areaGastos">
            <div class="tituloSecao">
                <div>
                    <h3>Produtos e gastos</h3>
                    <p>Adicione os produtos comprados neste mês.</p>
                </div>
            </div>

            <div class="formProduto">
                <input type="hidden" id="indiceEdicao-${mes}" value="">

                <div class="grupoCampo campoNome">
                    <label for="nome-${mes}">Nome do produto</label>
                    <input type="text" id="nome-${mes}" placeholder="Ex.: Arroz">
                </div>

                <div class="grupoCampo">
                    <label for="quantidade-${mes}">Quantidade</label>
                    <input type="number" id="quantidade-${mes}" min="1" step="1" placeholder="1">
                </div>

                <div class="grupoCampo">
                    <label for="valor-${mes}">Valor unitário</label>
                    <input type="number" id="valor-${mes}" min="0.01" step="0.01" placeholder="0,00">
                </div>

                <button
                    type="button"
                    class="botaoPrincipal botaoAdicionarProduto"
                    id="botaoProduto-${mes}"
                    onclick="adicionarOuSalvarProduto('${mes}')"
                >
                    Adicionar
                </button>
            </div>

            <p id="aviso-${mes}" class="mensagemAviso"></p>

            <div class="tabelaResponsiva">
                <table>
                    <thead>
                        <tr>
                            <th>Nome do produto</th>
                            <th>Quantidade</th>
                            <th>Valor unitário</th>
                            <th>Valor total</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody id="corpoTabela-${mes}"></tbody>
                </table>
            </div>
        </section>
    `;

    containerMeses.appendChild(campoMes);

    renderizarReceitas(mes);
    renderizarTabela(mes);
}

// ============================================================
// 3. RECEITAS
// ============================================================

function prepararReceitaDoMes(mes) {
    // Renda informada no cadastro (index.html -> login.js).
    const rendaCadastrada = Number(localStorage.getItem("rendaMensal")) || 0;

    if (!receitasPorMes[mes]) {
        receitasPorMes[mes] = {
            base: rendaCadastrada,
            baseModificada: false,
            extras: []
        };
    }

    // Garante compatibilidade caso uma versão antiga dos dados exista.
    if (!Array.isArray(receitasPorMes[mes].extras)) {
        receitasPorMes[mes].extras = [];
    }

    // Enquanto o usuário não modificar a receita deste mês manualmente,
    // ela acompanha a renda cadastrada (corrige meses salvos com valor antigo/zero).
    if (!receitasPorMes[mes].baseModificada) {
        receitasPorMes[mes].base = rendaCadastrada;
    }

    if (typeof receitasPorMes[mes].base !== "number") {
        receitasPorMes[mes].base = Number(receitasPorMes[mes].base) || 0;
    }

    salvarReceitas();
}

function salvarReceitaBase(mes) {
    const campo = document.getElementById(`receitaBase-${mes}`);
    const aviso = document.getElementById(`avisoReceita-${mes}`);
    const novaReceita = Number(campo.value);

    if (novaReceita < 0 || campo.value === "") {
        aviso.textContent = "Informe uma receita mensal válida.";
        return;
    }

    receitasPorMes[mes].base = novaReceita;
    receitasPorMes[mes].baseModificada = true;
    salvarReceitas();
    renderizarReceitas(mes);

    aviso.textContent = "Receita mensal modificada com sucesso.";
}

function adicionarReceitaExtra(mes) {
    const descricao = document.getElementById(`descricaoExtra-${mes}`).value.trim();
    const campoValor = document.getElementById(`valorExtra-${mes}`);
    const valor = Number(campoValor.value);
    const aviso = document.getElementById(`avisoReceita-${mes}`);

    if (valor <= 0 || campoValor.value === "") {
        aviso.textContent = "Informe um valor válido para a receita extra.";
        return;
    }

    receitasPorMes[mes].extras.push({
        descricao: descricao || "Receita extra",
        valor: valor
    });

    salvarReceitas();
    renderizarReceitas(mes);

    document.getElementById(`descricaoExtra-${mes}`).value = "";
    campoValor.value = "";
    aviso.textContent = "Receita extra adicionada com sucesso.";
}

function editarReceitaExtra(mes, indice) {
    const receita = receitasPorMes[mes].extras[indice];

    const novaDescricao = prompt("Descrição da receita extra:", receita.descricao);
    if (novaDescricao === null) return;

    const novoValorTexto = prompt("Valor da receita extra:", receita.valor);
    if (novoValorTexto === null) return;

    const novoValor = Number(novoValorTexto.replace(",", "."));

    if (novoValor <= 0 || Number.isNaN(novoValor)) {
        document.getElementById(`avisoReceita-${mes}`).textContent = "Informe um valor válido.";
        return;
    }

    receitasPorMes[mes].extras[indice] = {
        descricao: novaDescricao.trim() || "Receita extra",
        valor: novoValor
    };

    salvarReceitas();
    renderizarReceitas(mes);
}

function apagarReceitaExtra(mes, indice) {
    receitasPorMes[mes].extras.splice(indice, 1);
    salvarReceitas();
    renderizarReceitas(mes);
}

function renderizarReceitas(mes) {
    const dados = receitasPorMes[mes];
    const lista = document.getElementById(`extras-${mes}`);

    if (!dados || !lista) return;

    document.getElementById(`receitaBase-${mes}`).value = dados.base;

    lista.innerHTML = "";

    if (dados.extras.length > 0) {
        const titulo = document.createElement("p");
        titulo.classList.add("tituloExtras");
        titulo.textContent = "Receitas extras adicionadas:";
        lista.appendChild(titulo);

        dados.extras.forEach(function (receita, indice) {
            const item = document.createElement("div");
            item.classList.add("itemReceitaExtra");

            item.innerHTML = `
                <div>
                    <strong>${escaparHTML(receita.descricao)}</strong>
                    <span>${formatarDinheiro(receita.valor)}</span>
                </div>
                <div class="acoesTabela">
                    <button
                        type="button"
                        class="botaoAcao botaoEditar"
                        onclick="editarReceitaExtra('${mes}', ${indice})"
                    >
                        Modificar
                    </button>
                    <button
                        type="button"
                        class="botaoAcao botaoApagar"
                        onclick="apagarReceitaExtra('${mes}', ${indice})"
                    >
                        Apagar
                    </button>
                </div>
            `;

            lista.appendChild(item);
        });
    }

    atualizarResumoFinanceiro(mes);
}

function calcularReceitaTotal(mes) {
    const dados = receitasPorMes[mes];

    if (!dados) return 0;

    const totalExtras = dados.extras.reduce(function (soma, receita) {
        return soma + receita.valor;
    }, 0);

    return dados.base + totalExtras;
}

// ============================================================
// 4. PRODUTOS/GASTOS
// ============================================================

function adicionarOuSalvarProduto(mes) {
    const inputNome = document.getElementById(`nome-${mes}`);
    const inputQuantidade = document.getElementById(`quantidade-${mes}`);
    const inputValor = document.getElementById(`valor-${mes}`);
    const indiceEdicao = document.getElementById(`indiceEdicao-${mes}`);
    const aviso = document.getElementById(`aviso-${mes}`);

    const nome = inputNome.value.trim();
    const quantidade = Number(inputQuantidade.value);
    const valorUnitario = Number(inputValor.value);
    const valorTotal = quantidade * valorUnitario;

    if (nome === "" || quantidade <= 0 || valorUnitario <= 0) {
        aviso.textContent = "Preencha nome, quantidade e valor unitário corretamente.";
        return;
    }

    aviso.textContent = "";

    const produto = {
        nome: nome,
        quantidade: quantidade,
        valorUnitario: valorUnitario,
        valorTotal: valorTotal
    };

    if (!produtosPorMes[mes]) {
        produtosPorMes[mes] = [];
    }

    if (indiceEdicao.value === "") {
        produtosPorMes[mes].push(produto);
    } else {
        const indice = Number(indiceEdicao.value);
        produtosPorMes[mes][indice] = produto;
    }

    salvarProdutos();
    renderizarTabela(mes);
    limparFormularioProduto(mes);
}

function editarProduto(mes, indice) {
    const produto = produtosPorMes[mes][indice];

    document.getElementById(`nome-${mes}`).value = produto.nome;
    document.getElementById(`quantidade-${mes}`).value = produto.quantidade;
    document.getElementById(`valor-${mes}`).value = produto.valorUnitario;
    document.getElementById(`indiceEdicao-${mes}`).value = indice;

    const botao = document.getElementById(`botaoProduto-${mes}`);
    botao.textContent = "Salvar alteração";

    document.getElementById(`nome-${mes}`).focus();
}

function apagarProduto(mes, indice) {
    produtosPorMes[mes].splice(indice, 1);

    salvarProdutos();
    renderizarTabela(mes);
    limparFormularioProduto(mes);
}

function limparFormularioProduto(mes) {
    document.getElementById(`nome-${mes}`).value = "";
    document.getElementById(`quantidade-${mes}`).value = "";
    document.getElementById(`valor-${mes}`).value = "";
    document.getElementById(`indiceEdicao-${mes}`).value = "";
    document.getElementById(`botaoProduto-${mes}`).textContent = "Adicionar";
}

// ============================================================
// 5. TABELA E RESUMO FINANCEIRO
// ============================================================

function renderizarTabela(mes) {
    const corpoTabela = document.getElementById(`corpoTabela-${mes}`);
    const produtos = produtosPorMes[mes] || [];

    corpoTabela.innerHTML = "";

    if (produtos.length === 0) {
        corpoTabela.innerHTML = `
            <tr class="linhaVazia">
                <td colspan="5">Nenhum produto adicionado neste mês.</td>
            </tr>
        `;
    } else {
        produtos.forEach(function (produto, indice) {
            const linha = document.createElement("tr");

            linha.innerHTML = `
                <td>${escaparHTML(produto.nome)}</td>
                <td>${produto.quantidade}</td>
                <td>${formatarDinheiro(produto.valorUnitario)}</td>
                <td><strong>${formatarDinheiro(produto.valorTotal)}</strong></td>
                <td class="acoesTabela">
                    <button
                        type="button"
                        class="botaoAcao botaoEditar"
                        onclick="editarProduto('${mes}', ${indice})"
                    >
                        Modificar
                    </button>
                    <button
                        type="button"
                        class="botaoAcao botaoApagar"
                        onclick="apagarProduto('${mes}', ${indice})"
                    >
                        Apagar
                    </button>
                </td>
            `;

            corpoTabela.appendChild(linha);
        });
    }

    atualizarResumoFinanceiro(mes);
}

function calcularGastoTotal(mes) {
    const produtos = produtosPorMes[mes] || [];

    return produtos.reduce(function (soma, produto) {
        return soma + produto.valorTotal;
    }, 0);
}

function atualizarResumoFinanceiro(mes) {
    const totalGastos = calcularGastoTotal(mes);
    const totalReceita = calcularReceitaTotal(mes);
    const lucro = totalReceita - totalGastos;

    document.getElementById(`total-${mes}`).textContent = formatarDinheiro(totalGastos);
    document.getElementById(`receita-${mes}`).textContent = formatarDinheiro(totalReceita);
    document.getElementById(`lucro-${mes}`).textContent = (lucro < 0 ? "-" : "") + formatarDinheiro(Math.abs(lucro));

    const status = document.getElementById(`status-${mes}`);
    const resumoLucro = document.querySelector(`#mes-${mes} .resumoLucro`);

    // Removemos as classes antigas antes de colocar o novo estado.
    resumoLucro.classList.remove("situacaoPositiva", "situacaoNegativa", "situacaoNeutra");

    if (lucro < 0) {
        status.textContent = `Você está devendo ${formatarDinheiro(Math.abs(lucro))}`;
        resumoLucro.classList.add("situacaoNegativa");
    } else if (lucro > 0) {
        status.textContent = `Você não está devendo • sobra ${formatarDinheiro(lucro)}`;
        resumoLucro.classList.add("situacaoPositiva");
    } else {
        status.textContent = "Receita e gastos estão iguais";
        resumoLucro.classList.add("situacaoNeutra");
    }
}

// ============================================================
// 6. LOCALSTORAGE
// ============================================================

function salvarProdutos() {
    localStorage.setItem("produtosPorMes", JSON.stringify(produtosPorMes));
}

function carregarProdutos() {
    const produtosSalvos = localStorage.getItem("produtosPorMes");

    if (produtosSalvos) {
        try {
            return JSON.parse(produtosSalvos);
        } catch (erro) {
            return {};
        }
    }

    return {};
}

function salvarReceitas() {
    localStorage.setItem("receitasPorMes", JSON.stringify(receitasPorMes));
}

function carregarReceitas() {
    const receitasSalvas = localStorage.getItem("receitasPorMes");

    if (receitasSalvas) {
        try {
            return JSON.parse(receitasSalvas);
        } catch (erro) {
            return {};
        }
    }

    return {};
}

// ============================================================
// 7. FUNÇÕES AUXILIARES
// ============================================================

function formatarDinheiro(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function escaparHTML(texto) {
    const elemento = document.createElement("div");
    elemento.textContent = texto;
    return elemento.innerHTML;
}
