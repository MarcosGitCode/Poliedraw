console.log("1. O Script frontGemini foi carregado!");

document.addEventListener('DOMContentLoaded', () => {
    console.log("2. A página terminou de carregar (DOM ready).");

    // Seleção dos elementos
    const mainTextarea = document.getElementById('promptInput');
    const chatContainer = document.querySelector('.chat');
    const sendButtons = document.querySelectorAll(".send-btn"); // pega todos os botões de envio

    // DIAGNÓSTICO
    if (!mainTextarea) console.error("ERRO GRAVE: Não achei a caixa de texto (id='promptInput')");
    if (!chatContainer) console.error("ERRO GRAVE: Não achei o chat (class='chat')");
    if (sendButtons.length === 0) {
        console.error("ERRO GRAVE: Não achei o botão (id='send-btno')");
        return; // Para tudo se não tiver botão
    } else {
        console.log("3. Botão encontrado com sucesso! Adicionando evento de clique...");
    }

    // --- FUNÇÕES ---

    function scrollToBottom() {
        if(chatContainer) {
            chatContainer.scrollTo({ top: chatContainer.scrollHeight, behavior: 'smooth' });
        }
    }

    function appendMessage(content, type) {
        const wrapper = document.createElement('div');
        wrapper.className = `message-wrapper ${type}-message-wrapper`;
        const bubble = document.createElement('div');
        bubble.className = `message-bubble ${type}-message-bubble`;
        // permite posicionar o botão dentro do bubble
        bubble.style.position = 'relative';
        
        if (typeof content === 'string') {
            const p = document.createElement('p');
            p.innerText = content;
            bubble.appendChild(p);

            // --- ADICIONA BOTAO COPIAR PARA MENSAGENS DO USUÁRIO ---
            if (type === 'user') {
                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-btn';
                copyBtn.type = 'button';
                copyBtn.title = 'Copiar prompt';
                // usa imagem SVG como ícone (caminho absoluto a partir da raiz do projeto)
                copyBtn.innerHTML = '<img src="/assets/copy-regular-full.svg" alt="copiar" style="width:18px;height:18px;vertical-align:middle"/>';
                // Remove fundo do botão e deixa só a imagem
                copyBtn.style.background = 'transparent';
                copyBtn.style.border = 'none';
                copyBtn.style.padding = '0';
                // posiciona à direita do bubble (verticalmente centralizado)
                copyBtn.style.position = 'absolute';
                copyBtn.style.right = '8px';
                copyBtn.style.top = '50%';
                copyBtn.style.transform = 'translateY(-50%)';
                copyBtn.style.display = 'inline-flex';
                copyBtn.style.alignItems = 'center';
                copyBtn.style.justifyContent = 'center';
                copyBtn.style.cursor = 'pointer';
                copyBtn.style.boxShadow = 'none';
                // evita que o texto fique embaixo do botão
                bubble.style.paddingRight = '40px';
                copyBtn.addEventListener('click', async (e) => {
                    try {
                        await navigator.clipboard.writeText(p.innerText);
                        const oldHtml = copyBtn.innerHTML;
                        copyBtn.innerHTML = '<span style="font-weight:700;color:limegreen">✓</span>';
                        setTimeout(() => copyBtn.innerHTML = oldHtml, 900);
                    } catch (err) {
                        console.error('Erro ao copiar:', err);
                    }
                });
                // botão no canto do bubble
                bubble.appendChild(copyBtn);
            }
        } else {
            bubble.appendChild(content);
        }

        wrapper.appendChild(bubble);
        chatContainer.appendChild(wrapper);
        scrollToBottom();
    }

    async function sendPrompt(sourceTextarea) {
        const prompt = (sourceTextarea && sourceTextarea.value) ? sourceTextarea.value.trim() : (mainTextarea ? mainTextarea.value.trim() : "");
         console.log("Tentando enviar prompt:", prompt);
 
         if (!prompt) {
             console.log("Prompt vazio, ignorando.");
             return;
         }
 
         // 1. Mostra msg do usuário
        appendMessage(prompt, 'user');
        if (sourceTextarea) sourceTextarea.value = '';
        else if (mainTextarea) mainTextarea.value = '';

        // 2. Mostra "Carregando"
        const loadingDiv = document.createElement('div');
        loadingDiv.innerText = "Gerando imagem...";
        loadingDiv.className = "ai-response-content";
        appendMessage(loadingDiv, 'ai');

        try {
            const userId = localStorage.getItem("userId") || "user-anonimo";
            console.log("Enviando requisição para o backend...");

            const res = await fetch('http://localhost:3000/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt, userId })
            });

            console.log("Resposta do backend recebida. Status:", res.status);

            if (!res.ok) throw new Error(`Erro HTTP: ${res.status}`);

            const data = await res.json();
            loadingDiv.innerHTML = ""; // Limpa o carregando

            // Texto
            if (data.texto) {
                const p = document.createElement('p');
                p.innerText = data.texto;
                loadingDiv.appendChild(p);
            }

            // Imagens
            const listaImagens = data.imagens || data.images;
            if (listaImagens && listaImagens.length > 0) {
                
                // SALVAMENTO AUTOMÁTICO
                const dbUserId = localStorage.getItem("usuarioId");
                const dbUserType = localStorage.getItem("usuarioTipo");

                listaImagens.forEach((imgUrl) => {
                    // Exibir
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.style.maxWidth = "100%";
                    img.style.borderRadius = "8px";
                    img.style.marginTop = "10px";
                    loadingDiv.appendChild(img);

                    // Salvar no Banco
                    if (dbUserId && dbUserType) {
                        console.log("Salvando imagem no banco...");
                        fetch('http://localhost:3000/salvarImagem', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                id_usuario: dbUserId,
                                tipo_usuario: dbUserType,
                                prompt: prompt,
                                imagem: imgUrl
                            })
                        }).then(r => console.log("Salvo OK:", r.status))
                          .catch(e => console.error("Erro ao salvar:", e));
                    }
                });
            }
            scrollToBottom();

        } catch (error) {
            console.error("Erro na função sendPrompt:", error);
            loadingDiv.innerHTML = "<p style='color:red'>Erro ao conectar com a IA.</p>";
        }
    }

    // --- EVENTOS ---

    // Adiciona o evento de clique a TODOS os botões de envio (sidebar + main)
    sendButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            console.log("4. CLIQUE DETECTADO NO BOTÃO DE ENVIO!");
            e.preventDefault();
            // procura o textarea mais próximo dentro do mesmo .prompt
            const container = button.closest(".prompt");
            const localTextarea = container ? container.querySelector("textarea") : mainTextarea;
            sendPrompt(localTextarea);
        });
    });

    if (mainTextarea) {
        mainTextarea.addEventListener('keydown', (e) => {
             if (e.key === 'Enter' && !e.shiftKey) {
                 console.log("Enter pressionado!");
                 e.preventDefault();
                 sendPrompt(mainTextarea);
             }
         });
    }
 });