document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.querySelector(".sidebar");
    const toggleBtn = document.querySelector(".toggle-btn");

    // Botões de abas
    const materiasBtn = document.querySelector('.materias-btn');
    const estiloBtn = document.querySelector('.estilo-btn');
    const detalhesBtn = document.querySelector('.detalhes-btn');
    const fisicaBtn = document.querySelector('.fisica-btn');
    const quimicaBtn = document.querySelector('.quimica-btn');

    // Função para mostrar/ocultar abas
    function animateShow(el) {
        if (!el) return;
        el.classList.remove('fade-out');
        el.style.display = 'block';
        // Força reflow para garantir a animação
        void el.offsetWidth;
        el.classList.add('fade-in');
        // Garante opacidade e transform corretos
        el.style.opacity = '';
        el.style.transform = '';
    }
    function animateHide(el) {
        if (!el) return;
        el.classList.remove('fade-in');
        el.classList.add('fade-out');
        el.addEventListener('transitionend', function handler(e) {
            // Só esconde se a transição for de opacidade
            if (e.propertyName === 'opacity') {
                el.style.display = 'none';
                el.removeEventListener('transitionend', handler);
            }
        });
    }
    function showTab(tab) {
        if (fisicaBtn) animateHide(fisicaBtn);
        if (quimicaBtn) animateHide(quimicaBtn);
        if (tab === 'materias') {
            if (fisicaBtn) animateShow(fisicaBtn);
            if (quimicaBtn) animateShow(quimicaBtn);
        }
        // Salva aba ativa
        localStorage.setItem('activeTab', tab);
    }

    // Restaurar estado da sidebar
    const sidebarClosed = localStorage.getItem("sidebarClosed") === "true";
    if (sidebarClosed) {
        sidebar.classList.add("closed");
        document.body.classList.add("sidebar-closed");
    } else {
        sidebar.classList.remove("closed");
        document.body.classList.remove("sidebar-closed");
    }

    // Restaurar aba ativa
    const lastTab = localStorage.getItem('activeTab') || 'materias';
    // Corrige display inicial para evitar sumiço
    if (lastTab === 'materias') {
        if (fisicaBtn) fisicaBtn.style.display = 'block';
        if (quimicaBtn) quimicaBtn.style.display = 'block';
    } else {
        if (fisicaBtn) fisicaBtn.style.display = 'none';
        if (quimicaBtn) quimicaBtn.style.display = 'none';
    }
    showTab(lastTab);

    toggleBtn.addEventListener("click", () => {
        sidebar.classList.toggle("closed");
        document.body.classList.toggle("sidebar-closed", sidebar.classList.contains("closed"));
        // Salva estado da sidebar
        localStorage.setItem("sidebarClosed", sidebar.classList.contains("closed"));
    });

    materiasBtn.addEventListener('click', () => showTab('materias'));
    estiloBtn.addEventListener('click', () => showTab('estilo'));
    detalhesBtn.addEventListener('click', () => showTab('detalhes'));

    // Quando a sidebar for fechada, os botões somem pelo CSS
    // Quando aberta, restaura a última aba
    sidebar.addEventListener('transitionend', () => {
        if (!sidebar.classList.contains('closed')) {
            const lastTab = localStorage.getItem('activeTab') || 'materias';
            showTab(lastTab);
        }
    });
});