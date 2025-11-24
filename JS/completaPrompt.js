document.addEventListener("DOMContentLoaded", function() {
    // --- SELEÇÃO DE ELEMENTOS ---
    const textarea = document.getElementById("promptInput");
    
    // Botões principais
    const botaoQuimica = document.getElementById("quimica");
    const botaoFisica = document.getElementById("fisica");
    
    // Dropdowns (NOVOS)
    const selectFisica = document.getElementById("select-fisica");
    const selectQuimica = document.getElementById("select-quimica");

    // Botões de Detalhes e Estilo
    const botaoDetalhe = document.getElementById("botaoDetalhe");
    const detalheInput = document.getElementById("sidebarPromptInput");
    const botaoApagarPrompt = document.getElementById("apagarPrompt"); // (Verifique se esse botão existe no HTML, senão vai dar erro)
    
    // Botões de estilo (Agrupados para facilitar)
    const botoesEstilo = document.querySelectorAll(".style-button");

    // --- VARIÁVEIS DE CONTROLE ---
    let temaSelecionado = false; 
    let detalheAdicionado = false;
    let assuntoSelecionado = ""; // AQUI ESTÁ A VARIÁVEL QUE VOCÊ PEDIU

    // --- FUNÇÕES AUXILIARES ---

    // Função para atualizar o prompt quando um dropdown muda
    function atualizarPromptComDropdown(materia, selectElement) {
        // Pega o TEXTO da opção (ex: "Cinemática") e não o value (ex: "cinematica")
        // Se quiser o value, use selectElement.value
        let textoOpcao = selectElement.options[selectElement.selectedIndex].text;
        
        // Guarda na variável let
        assuntoSelecionado = textoOpcao;

        // Atualiza a caixa de texto
        textarea.value = `Crie uma imagem de ${materia} sobre ${assuntoSelecionado}`;
        
        // Libera para adicionar detalhes
        temaSelecionado = true;
    }

    // --- EVENTOS ---

    // 1. Clique no botão grande "Física" (apenas inicia o texto)
    botaoFisica.addEventListener("click", function() {
        textarea.value = "Crie uma imagem de física sobre";
        selectFisica.value = ""; // Reseta o dropdown para o padrão
        temaSelecionado = true; 
    });

    // 2. Mudança no Dropdown de Física
    selectFisica.addEventListener("change", function() {
        atualizarPromptComDropdown("física", selectFisica);
    });

    // 3. Clique no botão grande "Química"
    botaoQuimica.addEventListener("click", function() {
        textarea.value = "Crie uma imagem de química sobre";
        selectQuimica.value = ""; // Reseta o dropdown
        temaSelecionado = true; 
    });

    // 4. Mudança no Dropdown de Química
    selectQuimica.addEventListener("change", function() {
        atualizarPromptComDropdown("química", selectQuimica);
    });

    // 5. Botão de Detalhes
    botaoDetalhe.addEventListener("click", function() {
        if (!temaSelecionado) {
            alert("Escolha primeiro uma matéria ou assunto!");
            return; 
        }

        const promptDetalhe = detalheInput.value.trim();
        if (promptDetalhe !== "") {
            textarea.value += " '" + promptDetalhe + "'";
            // detalheAdicionado = true; // Opcional: dependerá se você obriga ter detalhe para escolher estilo
            detalheInput.value = ""; // Limpa o campo de detalhe após enviar
        }
        // Vamos permitir escolher estilo mesmo sem detalhe extra, se já tiver tema
        detalheAdicionado = true; 
    });

    // 6. Botões de Estilo (Lógica otimizada)
    botoesEstilo.forEach(botao => {
        botao.addEventListener("click", function() {
            if (!temaSelecionado) {
                alert("Escolha o tema e os detalhes antes do estilo!");
                return;
            }

            // Remove estilo anterior se houver (regex)
            textarea.value = textarea.value.replace(/ no estilo.*$/i, "");

            // Pega o nome do estilo (pode pegar do h2 ou criar um atributo data-texto)
            let estiloNome = this.querySelector("h2").innerText.toLowerCase();
            
            // Ajuste gramatical simples
            if (estiloNome === "grafico") estiloNome = "de um gráfico";
            else if (estiloNome === "tabela") estiloNome = "de uma tabela";
            else if (estiloNome === "cartoon") estiloNome = "de cartoon";
            else if (estiloNome === "anime") estiloNome = "de anime";
            else if (estiloNome === "pixel art") estiloNome = "de pixel art";
            
            textarea.value += " no estilo " + estiloNome;
        });
    });

    // 7. Botão Limpar (Opcional, se existir no HTML)
    if(botaoApagarPrompt) {
        botaoApagarPrompt.addEventListener("click", function() {
            textarea.value = "";
            selectFisica.value = "";
            selectQuimica.value = "";
            temaSelecionado = false;
            detalheAdicionado = false;
        });
    }
});