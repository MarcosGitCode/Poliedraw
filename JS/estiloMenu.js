document.addEventListener('DOMContentLoaded', () => {
    const styleButtons = document.querySelectorAll('.style-button');
    let currentStyle = localStorage.getItem('selectedStyle') || 'realistic';

    // Função para atualizar o estilo selecionado
    function updateSelectedStyle(style) {
        // Remove a classe selected de todos os botões
        styleButtons.forEach(btn => {
            btn.classList.remove('selected');
            if (btn.dataset.style === style) {
                btn.classList.add('selected');
            }
        });

        // Salva a seleção no localStorage
        localStorage.setItem('selectedStyle', style);
        // Aqui você pode adicionar lógica adicional para mudar o estilo da IA
    }

    // Inicializa o botão selecionado
    updateSelectedStyle(currentStyle);

    // Adiciona event listeners para os botões
    styleButtons.forEach(button => {
        button.addEventListener('click', () => {
            const style = button.dataset.style;
            updateSelectedStyle(style);
        });
    });
});