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
            messageBubble.innerText = content;
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

        
        try {
            // Chamada à API
            const res = await fetch('http://localhost:3000/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
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
            
            // 4. Adicionar as imagens e rastrear o carregamento
            if (data.imagens && data.imagens.length > 0) {
                data.imagens.forEach(imgUrl => {
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    
                    const loadPromise = new Promise((resolve) => {
                        img.onload = () => {
                            resolve();
                            scrollToBottom(); // Rola após o carregamento de CADA imagem
                        };
                        img.onerror = () => resolve(); 
                    });

                    imagesLoadedPromises.push(loadPromise);
                    aiResponseContent.appendChild(img);
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