document.addEventListener("DOMContentLoaded", function() {
    const botaoQuimica = document.getElementById("quimica");
    const botaoFisica = document.getElementById("fisica");
    const textarea = document.getElementById("promptInput");
    const botaoDetalhe = document.getElementById("botaoDetalhe");
    const detalheInput = document.getElementById("sidebarPromptInput");
    const botaoGrafico = document.getElementById("grafico");
    const botaoTabela = document.getElementById("tabela");
    const botaoRealista = document.getElementById("realista");
    const botao3D = document.getElementById("3D");
    const botaoCartoon = document.getElementById("cartoon");
    const botaoAnime = document.getElementById("anime");
    const botaoPixelArt = document.getElementById("pixelart");
    const botaoApagarPrompt = document.getElementById("apagarPrompt");

    let temaSelecionado = false; 
    let detalheAdicionado = false;
    let estiloSelecionado = false;

    botaoQuimica.addEventListener("click", function() {
        textarea.value = "Crie uma imagem de química sobre";
        temaSelecionado = true; 
    });

    botaoFisica.addEventListener("click", function() {
        textarea.value = "Crie uma imagem de física sobre";
        temaSelecionado = true; 
    });

    botaoDetalhe.addEventListener("click", function() {
        if (!temaSelecionado) {
            alert("Escolha primeiro Química ou Física antes de adicionar detalhes!");
            return; 
        }

        const promptDetalhe = detalheInput.value.trim();
        if (promptDetalhe !== "") {
            textarea.value += (textarea.value ? " " : "") +"'" + promptDetalhe + "'";
            temaSelecionado = false
            detalheAdicionado = true;
        }
    });

    function aplicarEstilo(estiloTexto) {
    if (!detalheAdicionado) {
        alert("Adicione primeiro detalhes antes de escolher um estilo");
        return;
    }

    textarea.value = textarea.value.replace(
        / no estilo.*$/i,
        ""
    );

    textarea.value += " no estilo " + estiloTexto;
    }

    botaoGrafico.addEventListener("click", () => aplicarEstilo("de um gráfico"));
    botaoTabela.addEventListener("click", () => aplicarEstilo("de uma tabela"));
    botaoRealista.addEventListener("click", () => aplicarEstilo("realista"));
    botao3D.addEventListener("click", () => aplicarEstilo("3D"));
    botaoCartoon.addEventListener("click", () => aplicarEstilo("de cartoon"));
    botaoAnime.addEventListener("click", () => aplicarEstilo("de anime"));
    botaoPixelArt.addEventListener("click", () => aplicarEstilo("de pixel art"));

    botaoApagarPrompt.addEventListener("click", function() {
        textarea.value = "";
        temaSelecionado = false;
        detalheAdicionado = false;
        estiloSelecionado = false;
    });
});