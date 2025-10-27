document.addEventListener('DOMContentLoaded', () => {
    const textarea = document.getElementById('promptInput');
    const imagemDiv = document.querySelector('.imagem');
    const btn = document.querySelector(".send-btn");

    async function sendPrompt(prompt) {
        textarea.value = '';

        const responseElement = document.createElement('div');
        responseElement.className = 'response-text';
        responseElement.style.color = '#fff';
        responseElement.style.margin = '20px';
        responseElement.style.fontSize = '14px';
        responseElement.innerText = 'Enviando...'; // Note que mudei de result para resposta

            
        imagemDiv.appendChild(responseElement);
        
        try {
            const res = await fetch('http://localhost:3000/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });
            
            const data = await res.json();
            responseElement.innerHTML = '';
            
            // Adiciona o texto se existir
            if (data.texto) {
                const textElement = document.createElement('p');
                textElement.innerText = data.texto;
                textElement.style.fontSize = '14px';
                responseElement.appendChild(textElement);
            }
            
            // Adiciona as imagens se existirem
            if (data.imagens && data.imagens.length > 0) {
                data.imagens.forEach(imgUrl => {
                    const img = document.createElement('img');
                    img.src = imgUrl;
                    img.style.maxWidth = '100%';
                    img.style.marginTop = '10px';
                    responseElement.appendChild(img);
                });
            }
        } catch (err) {
            console.error('Erro ao chamar o backend:', err);
            responseElement.innerText = 'Erro na requisição';
        }
    }

    
    btn.addEventListener("click", () => {
        const prompt = textarea.value.trim();
        if (!prompt) return;
        sendPrompt(prompt);
    });

    // Evento de tecla Enter
    textarea.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const prompt = textarea.value.trim();
            if (!prompt) return;
            sendPrompt(prompt);
        }
    });
});