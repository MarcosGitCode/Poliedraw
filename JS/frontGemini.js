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
        responseElement.innerText = 'Enviando...'; // Note que mudei de result para resposta

            
        imagemDiv.appendChild(responseElement);
        
        try {
            console.log('Enviando prompt:', prompt);
            

            const res = await fetch('http://localhost:3000/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt })
            });
            
            const data = await res.json();
            console.log('Resposta recebida:', data);
            
            responseElement.innerText = data.resposta;
            textarea.value = '';
        } catch (err) {
            console.error('Erro ao chamar o backend:', err);
            imagemDiv.innerText = 'Erro na requisição';
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