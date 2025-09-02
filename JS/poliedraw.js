document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.querySelector(".toggle-btn");

    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("closed");
        document.body.classList.toggle("sidebar-closed", sidebar.classList.contains("closed"));
    });

    // Seleciona os botões física e química
    const fisicaBtn = document.querySelector('.fisica-btn');
    const quimicaBtn = document.querySelector('.quimica-btn');

    // Função para mostrar física e química
    function showMateriasExtras() {
        if (!sidebar.classList.contains('closed')) {
            fisicaBtn.style.display = 'block';
            quimicaBtn.style.display = 'block';
        }
    }

    // Função para esconder física e química
    function hideMateriasExtras() {
        fisicaBtn.style.display = 'none';
        quimicaBtn.style.display = 'none';
    }

    // Sessão inicial: mostra física e química
    showMateriasExtras();

    document.querySelector('.estilo-btn').addEventListener('click', hideMateriasExtras);
    document.querySelector('.detalhes-btn').addEventListener('click', hideMateriasExtras);
    document.querySelector('.materias-btn').addEventListener('click', showMateriasExtras);

    // Quando a sidebar for fechada, os botões somem pelo CSS
    // Quando aberta, só reaparecem se clicar em "Matérias"
    sidebar.addEventListener('transitionend', () => {
        if (sidebar.classList.contains('closed')) {
            hideMateriasExtras();
        }
    });
});