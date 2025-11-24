console.log("1. O Script frontGemini foi carregado!");

document.addEventListener('DOMContentLoaded', () => {
    console.log("2. A página terminou de carregar (DOM ready).");

    // Seleção dos elementos
    const textarea = document.getElementById('promptInput');
    const chatContainer = document.querySelector('.chat');
    const btn = document.getElementById("send-btno");

    // DIAGNÓSTICO
    if (!textarea) console.error("ERRO GRAVE: Não achei a caixa de texto (id='promptInput')");
    if (!chatContainer) console.error("ERRO GRAVE: Não achei o chat (class='chat')");
    if (!btn) {
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
        
        if (typeof content === 'string') {
            const p = document.createElement('p');
            p.innerText = content;
            bubble.appendChild(p);
        } else {
            bubble.appendChild(content);
        }

        wrapper.appendChild(bubble);
        chatContainer.appendChild(wrapper);
        scrollToBottom();
    }

    async function sendPrompt() {
        const prompt = textarea.value.trim();
        console.log("Tentando enviar prompt:", prompt);

        if (!prompt) {
            console.log("Prompt vazio, ignorando.");
            return;
        }

        // 1. Mostra msg do usuário
        appendMessage(prompt, 'user');
        textarea.value = '';

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

    btn.addEventListener("click", (e) => {
        console.log("4. CLIQUE DETECTADO NO BOTÃO!"); // Se isso não aparecer, o botão está morto
        e.preventDefault(); // Impede recarregar
        sendPrompt();
    });

    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            console.log("Enter pressionado!");
            e.preventDefault();
            sendPrompt();
        }
    });
});