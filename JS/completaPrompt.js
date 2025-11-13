document.addEventListener("DOMContentLoaded", function() {
    const botaoQuimica = document.getElementById("quimica");
    const botaoFisica = document.getElementById("fisica");
    const textarea = document.getElementById("promptInput");
    const botaoDetalhe = document.getElementById("botaoDetalhe");
    const detalheInput = document.getElementById("sidebarPromptInput");

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
        textarea.value = "no estilo de um gráfico";
        temaSelecionado = true; 
    });

    botaoTabela.addEventListener("click", function() {
        textarea.value = "no estilo de uma tabela";
        temaSelecionado = true; 
    });

    botaoRealista.addEventListener("click", function() {
        textarea.value = "no estilo realista";
        temaSelecionado = true; 
    });

    botao3D.addEventListener("click", function() {
        textarea.value = "no estilo 3D";
        temaSelecionado = true; 
    });

    botaoCartoon.addEventListener("click", function() {
        textarea.value = "no estilo de cartoon";
        temaSelecionado = true; 
    });

    botaoAnime.addEventListener("click", function() {
        textarea.value = "no estilo de anime";
        temaSelecionado = true; 
    });

    botaoPixelArt.addEventListener("click", function() {
        textarea.value = "no estilo de pixel art";
        temaSelecionado = true; 
    });
});