document.addEventListener("DOMContentLoaded", function() {
    // --- SELEÇÃO DE ELEMENTOS ---
    const textarea = document.getElementById("promptInput");
    
    // Botões principais
    const botaoQuimica = document.getElementById("quimica");
    const botaoFisica = document.getElementById("fisica");
    const botaoHistoria = document.getElementById("historia");
    
    // Dropdowns
    const selectFisica = document.getElementById("select-fisica");
    const selectQuimica = document.getElementById("select-quimica");
    const selectHistoria = document.getElementById("select-historia");
    const selectsMateria = [selectFisica, selectQuimica, selectHistoria].filter(Boolean);

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
    function atualizarPrompt(texto) {
        if (!textarea) return;
        textarea.value = texto;
        textarea.dispatchEvent(new Event("input", { bubbles: true }));
    }

    function atualizarPromptComDropdown(materia, selectElement) {
        if (!selectElement) return;
        const textoOpcao = selectElement.options[selectElement.selectedIndex].text;
        assuntoSelecionado = textoOpcao;
        if (textarea) {
            selectsMateria.forEach(select => {
                if (select !== selectElement) select.value = "";
            });
            atualizarPrompt(`Crie uma imagem de ${materia} sobre ${assuntoSelecionado}`);
            temaSelecionado = true;
        }
    }

    function selecionarMateria(materia, selectElement) {
        atualizarPrompt(`Crie uma imagem de ${materia} sobre`);
        selectsMateria.forEach(select => {
            select.value = "";
        });
        temaSelecionado = true;
        selectElement?.focus();
    }

    // --- EVENTOS (COM PROTEÇÃO CONTRA ERROS) ---

    // 1. Botão Física
    if (botaoFisica) {
        botaoFisica.addEventListener("click", () => selecionarMateria("física", selectFisica));
    }

    // 2. Dropdown Física
    if (selectFisica) {
        selectFisica.addEventListener("change", function() {
            atualizarPromptComDropdown("física", selectFisica);
        });
    }

    // 3. Botão Química
    if (botaoQuimica) {
        botaoQuimica.addEventListener("click", () => selecionarMateria("química", selectQuimica));
    }

    // 4. Dropdown Química
    if (selectQuimica) {
        selectQuimica.addEventListener("change", function() {
            atualizarPromptComDropdown("química", selectQuimica);
        });
    }

    // 5. Botão História e dropdown
    if (botaoHistoria) {
        botaoHistoria.addEventListener("click", () => selecionarMateria("história", selectHistoria));
    }

    if (selectHistoria) {
        selectHistoria.addEventListener("change", function() {
            atualizarPromptComDropdown("história", selectHistoria);
        });
    }

    // 6. Botão de Detalhes
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

    // 7. Botões de Estilo
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

    // 8. Botão Limpar
    if(botaoApagarPrompt) {
        botaoApagarPrompt.addEventListener("click", function() {
            if(textarea) textarea.value = "";
            selectsMateria.forEach(select => {
                select.value = "";
            });
            temaSelecionado = false;
            detalheAdicionado = false;
        });
    }
});