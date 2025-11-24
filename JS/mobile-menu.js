document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.querySelector('.mobile-menu');
    const sidebar = document.querySelector('.barraLateral');

    if (!mobileMenu || !sidebar) return;

    // acessibilidade
    mobileMenu.setAttribute('role', 'button');
    mobileMenu.setAttribute('aria-expanded', 'false');

    const materiasMenu = document.getElementById('materiasMenu');
    const detalhesMenu = document.getElementById('detalhesMenu');
    const estiloMenu = document.getElementById('estiloMenu');
    const menus = [materiasMenu, detalhesMenu, estiloMenu];

    const closeAllMenus = () => {
        menus.forEach(menu => {
            if (!menu) return;
            menu.classList.add('hidden');
            menu.setAttribute('aria-hidden', 'true');
            const btn = document.getElementById(menu.id.replace('Menu', 'Btn'));
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
    };

    // toggle da barra lateral: abrir apenas a barra (botões). Ao fechar, fechar todos os menus.
    mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = sidebar.classList.toggle('open');
        mobileMenu.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
        if (!isOpen) {
            // ao fechar a barra, fechar também todos os menus (voltar à estaca 0)
            closeAllMenus();
        }
        // se abriu, não abrir nenhum menu — apenas mostra os botões (CSS .open deve controlar a visualização)
    });
    // fechar com ESC: fecha sidebar e menus
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            mobileMenu.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
            closeAllMenus();
        }
    });

    // garantir estado inicial consistente
    if (!sidebar.classList.contains('open')) {
        mobileMenu.setAttribute('aria-expanded', 'false');
        closeAllMenus();
    }
});