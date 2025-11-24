document.addEventListener('DOMContentLoaded', () => {
    // Seleção dos elementos da interface
    const textarea = document.getElementById('promptInput');
    const chatContainer = document.querySelector('.chat'); // Renomeei para maior clareza
    const btn = document.getElementById("send-btno");

    
    // Função para rolar o chat para o final
    function scrollToBottom() {
        chatContainer.scrollTo({
            top: chatContainer.scrollHeight,
            behavior: 'smooth' 
        });
    }

    function criarUserId() {
        const id = crypto.randomUUID();
        localStorage.setItem("userId", id);
        return id;
    }

    /**
     * Cria e adiciona um elemento de mensagem ao chat.
     * @param {string} content - O texto ou HTML da mensagem.
     * @param {string} type - 'user' ou 'ai' para estilização.
     */
    function appendMessage(content, type) {
        const messageWrapper = document.createElement('div');
        messageWrapper.classList.add('message-wrapper', `${type}-message-wrapper`);
        
        const messageBubble = document.createElement('div');
        messageBubble.classList.add('message-bubble', `${type}-message-bubble`);
        
        // Se for mensagem de texto simples
        if (typeof content === 'string') {
            if (type === 'user') {
                // Texto do prompt
                const textEl = document.createElement('p');
                textEl.className = 'user-prompt-text';
                textEl.innerText = content;
                messageBubble.appendChild(textEl);

                // Botão de copiar (agora com ícone)
                const copyBtn = document.createElement('button');
                copyBtn.className = 'copy-prompt-btn';
                copyBtn.type = 'button';
                copyBtn.title = 'Copiar prompt';

                const copyIcon = document.createElement('img');
                copyIcon.src = '/assets/copy-regular-full.svg';
                copyIcon.alt = 'Copiar';
                copyIcon.className = 'copy-icon';
                copyBtn.appendChild(copyIcon);

                copyBtn.addEventListener('click', async (e) => {
                    e.stopPropagation();
                    try {
                        await navigator.clipboard.writeText(content);
                        const prev = copyBtn.innerHTML;
                        copyBtn.innerHTML = 'Copiado!';
                        setTimeout(() => copyBtn.innerHTML = prev, 1200);
                    } catch {
                        // fallback para copiar via textarea
                        const ta = document.createElement('textarea');
                        ta.value = content;
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                        const prev = copyBtn.innerHTML;
                        copyBtn.innerHTML = 'Copiado!';
                        setTimeout(() => copyBtn.innerHTML = prev, 1200);
                    }
                });

                messageBubble.appendChild(copyBtn);
            } else {
                messageBubble.innerText = content;
            }
        } else {
            // Se for um elemento (ex: div de resposta da IA), anexamos o conteúdo
            messageBubble.appendChild(content);
        }

        messageWrapper.appendChild(messageBubble);
        chatContainer.appendChild(messageWrapper);
        scrollToBottom();
        return messageBubble; // Retorna o elemento da bolha para manipulação posterior
    }


    async function sendPrompt(prompt) {
        if (!prompt) return;

        // 1. Exibir a mensagem do usuário imediatamente
        appendMessage(prompt, 'user');
        textarea.value = ''; // Limpa o campo de texto

        // 2. Preparar e exibir a "bolha" de resposta da IA (com 'Enviando...')
        const aiResponseContent = document.createElement('div');
        aiResponseContent.className = 'ai-response-content';
        aiResponseContent.innerHTML = '<p>Enviando...</p>';
        
        const aiMessageBubble = appendMessage(aiResponseContent, 'ai');

        const userId = localStorage.getItem("userId") || criarUserId();
        
        try {
            // Chamada à API
            const res = await fetch('http://localhost:3000/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    prompt,
                    userId
                })
            });
            
            const data = await res.json();
            
            // Limpa o conteúdo de 'Enviando...'
            aiResponseContent.innerHTML = ''; 
            
            let imagesLoadedPromises = []; 
            
            // 3. Adicionar o texto da IA
            if (data.texto) {
                const textElement = document.createElement('p');
                textElement.innerText = data.texto;
                aiResponseContent.appendChild(textElement);
            }
            
            // 4. Adicionar as imagens e o botão flutuante
            const listaImagens = data.imagens || data.images;

            if (listaImagens && listaImagens.length > 0) {
                listaImagens.forEach((imgUrl, index) => {
                    
                    // A. Container (Position Relative)
                    const wrapper = document.createElement('div');
                    wrapper.className = 'image-wrapper';

                    // B. A Imagem Gerada pela IA
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.style.maxWidth = '100%';
                    img.style.borderRadius = '8px';
                    img.style.display = 'block'; // Remove espaços extras embaixo

                    // C. O Botão de Download (Position Absolute)
                    const downloadBtn = document.createElement('a');
                    downloadBtn.href = imgUrl;
                    downloadBtn.download = `imagem-gemini-${Date.now()}-${index}.png`;
                    downloadBtn.className = 'download-btn';
                    downloadBtn.title = "Baixar imagem"; // Texto que aparece ao passar o mouse

                    // D. A Imagem do Ícone (dentro do botão)
                    const iconImg = document.createElement('img');
                    iconImg.src = '/assets/navegacao/download.png'; 
                    
                    iconImg.className = 'download-icon-img';
                    downloadBtn.appendChild(iconImg);

                    // E. Lógica de carregamento
                    const loadPromise = new Promise((resolve) => {
                        img.onload = () => {
                            resolve();
                            scrollToBottom();
                        };
                        img.onerror = () => resolve(); 
                    });
                    imagesLoadedPromises.push(loadPromise);

                    // F. Montagem: Botão e Imagem dentro do Wrapper
                    wrapper.appendChild(img);         // 1. Imagem de fundo
                    wrapper.appendChild(downloadBtn); // 2. Botão por cima
                    
                    aiResponseContent.appendChild(wrapper);
                });
            }
            // 5. Rola para o final após o texto ser adicionado
            scrollToBottom(); 

            // Espera o carregamento de todas as imagens antes de considerar a resposta finalizada
            await Promise.all(imagesLoadedPromises);


        } catch (err) {
            console.error('Erro ao chamar o backend:', err);
            aiResponseContent.innerHTML = '<p style="color: red;">Erro na requisição. Verifique o console.</p>';
            scrollToBottom(); 
        }
    }

    // Event Listener para o botão de envio
    btn.addEventListener("click", () => {
        const prompt = textarea.value.trim();
        sendPrompt(prompt);
    });

    // Event Listener para a tecla Enter no textarea
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const prompt = textarea.value.trim();
            sendPrompt(prompt);
        }
    });
});