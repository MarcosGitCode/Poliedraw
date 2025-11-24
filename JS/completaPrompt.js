document.addEventListener("DOMContentLoaded", function() {
    // --- SELEÇÃO DE ELEMENTOS ---
    const textarea = document.getElementById("promptInput");
    
    // Botões principais
    const botaoQuimica = document.getElementById("quimica");
    const botaoFisica = document.getElementById("fisica");
    
    // Dropdowns
    const selectFisica = document.getElementById("select-fisica");
    const selectQuimica = document.getElementById("select-quimica");

    // Botões de Detalhes e Estilo
    const botaoDetalhe = document.getElementById("send-btno");
    const detalheInput = document.getElementById("sidebarPromptInput");
    const botaoApagarPrompt = document.getElementById("apagarPrompt");
    
    // Botões de estilo
    const botoesEstilo = document.querySelectorAll(".style-button");

    // --- VARIÁVEIS DE CONTROLE ---
    let temaSelecionado = false; 
    let detalheAdicionado = false;
    let assuntoSelecionado = ""; 

    // --- FUNÇÕES AUXILIARES ---
    function atualizarPromptComDropdown(materia, selectElement) {
        if (!selectElement) return;
        let textoOpcao = selectElement.options[selectElement.selectedIndex].text;
        assuntoSelecionado = textoOpcao;
        if (textarea) {
            textarea.value = `Crie uma imagem de ${materia} sobre ${assuntoSelecionado}`;
            temaSelecionado = true;
        }
    }

    // --- EVENTOS (COM PROTEÇÃO CONTRA ERROS) ---

    // 1. Botão Física
    if (botaoFisica) {
        botaoFisica.addEventListener("click", function() {
            if(textarea) textarea.value = "Crie uma imagem de física sobre";
            if(selectFisica) selectFisica.value = ""; 
            temaSelecionado = true; 
        });
    }

    // 2. Dropdown Física
    if (selectFisica) {
        selectFisica.addEventListener("change", function() {
            atualizarPromptComDropdown("física", selectFisica);
        });
    }

    // 3. Botão Química
    if (botaoQuimica) {
        botaoQuimica.addEventListener("click", function() {
            if(textarea) textarea.value = "Crie uma imagem de química sobre";
            if(selectQuimica) selectQuimica.value = ""; 
            temaSelecionado = true; 
        });
    }

    // 4. Dropdown Química
    if (selectQuimica) {
        selectQuimica.addEventListener("change", function() {
            atualizarPromptComDropdown("química", selectQuimica);
        });
    }

    // 5. Botão de Detalhes (O provável causador do erro na linha 71)
    if (botaoDetalhe) {
        botaoDetalhe.addEventListener("click", function() {
            if (!temaSelecionado) {
                alert("Escolha primeiro uma matéria ou assunto!");
                return; 
            }
            if (detalheInput && textarea) {
                const promptDetalhe = detalheInput.value.trim();
                if (promptDetalhe !== "") {
                    textarea.value += " '" + promptDetalhe + "'";
                    detalheInput.value = ""; 
                }
                detalheAdicionado = true; 
            }
        });
    }

    // 6. Botões de Estilo
    if (botoesEstilo) {
        botoesEstilo.forEach(botao => {
            botao.addEventListener("click", function() {
                if (!temaSelecionado) {
                    alert("Escolha o tema e os detalhes antes do estilo!");
                    return;
                }
                if (textarea) {
                    textarea.value = textarea.value.replace(/ no estilo.*$/i, "");
                    const h2 = this.querySelector("h2");
                    if (h2) {
                        let estiloNome = h2.innerText.toLowerCase();
                        
                        if (estiloNome === "grafico") estiloNome = "de um gráfico";
                        else if (estiloNome === "tabela") estiloNome = "de uma tabela";
                        else if (estiloNome === "cartoon") estiloNome = "de cartoon";
                        else if (estiloNome === "anime") estiloNome = "de anime";
                        else if (estiloNome === "pixel art") estiloNome = "de pixel art";
                        
                        textarea.value += " no estilo " + estiloNome;
                    }
                }
            });
        });
    }

    // 7. Botão Limpar
    if(botaoApagarPrompt) {
        botaoApagarPrompt.addEventListener("click", function() {
            if(textarea) textarea.value = "";
            if(selectFisica) selectFisica.value = "";
            if(selectQuimica) selectQuimica.value = "";
            temaSelecionado = false;
            detalheAdicionado = false;
        });
    }
});