document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.querySelector('.mobile-menu');
    const sidebar = document.querySelector('.barraLateral');

    if (!mobileMenu || !sidebar) return;

    // acessibilidade
    mobileMenu.setAttribute('role', 'button');
    mobileMenu.setAttribute('aria-expanded', 'false');

    mobileMenu.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = sidebar.classList.toggle('open');
        mobileMenu.setAttribute('aria-expanded', String(isOpen));
        document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // fechar ao clicar fora
    document.addEventListener('click', (e) => {
        if (!sidebar.classList.contains('open')) return;
        if (sidebar.contains(e.target) || mobileMenu.contains(e.target)) return;
        sidebar.classList.remove('open');
        mobileMenu.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    });

    // fechar com ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            sidebar.classList.remove('open');
            mobileMenu.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
});