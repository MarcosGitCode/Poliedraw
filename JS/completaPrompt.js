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

    let temaSelecionado = false; 

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
        }
    });

    botaoGrafico.addEventListener("click", function() {
        textarea.value += (textarea.value ? " " : "") + "no estilo de um gráfico"; 
    });

    botaoTabela.addEventListener("click", function() {
        textarea.value += (textarea.value ? " " : "") + "no estilo de uma tabela"; 
    });

    botaoRealista.addEventListener("click", function() {
        textarea.value += (textarea.value ? " " : "") + "no estilo realista"; 
    });

    botao3D.addEventListener("click", function() {
        textarea.value += (textarea.value ? " " : "") + "no estilo 3D"; 
    });

    botaoCartoon.addEventListener("click", function() {
        textarea.value += (textarea.value ? " " : "") + "no estilo de um cartoon"; 
    });

    botaoAnime.addEventListener("click", function() {
        textarea.value += (textarea.value ? " " : "") + "no estilo de anime"; 
    });

    botaoPixelArt.addEventListener("click", function() {
        textarea.value += (textarea.value ? " " : "") + "no estilo de pixel art"; 
    });
});