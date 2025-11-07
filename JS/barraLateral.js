document.addEventListener('DOMContentLoaded', () => {
  const pairs = [
    { btn: document.getElementById('materiasBtn'), menu: document.getElementById('materiasMenu') },
    { btn: document.getElementById('detalhesBtn'), menu: document.getElementById('detalhesMenu') },
    { btn: document.getElementById('estiloBtn'), menu: document.getElementById('estiloMenu') },
  ].filter(p => p.btn && p.menu);

  const setActive = (p, active) => {
    if (active) {
      p.btn.classList.add('active');
      p.btn.setAttribute('aria-pressed', 'true');
    } else {
      p.btn.classList.remove('active');
      p.btn.setAttribute('aria-pressed', 'false');
    }
  };

  const closeMenu = (p) => {
    p.menu.classList.add('hidden');
    p.menu.setAttribute('aria-hidden', 'true');
    p.btn.setAttribute('aria-expanded', 'false');
    setActive(p, false);
  };

  const openMenu = (p) => {
    p.menu.classList.remove('hidden');
    p.menu.setAttribute('aria-hidden', 'false');
    p.btn.setAttribute('aria-expanded', 'true');
    setActive(p, true);
  };

  const closeAllExcept = (except) => {
    pairs.forEach(p => { if (p !== except) closeMenu(p); });
  };

  // inicializar estados ARIA e visual
  pairs.forEach(p => {
    const isHidden = p.menu.classList.contains('hidden');
    p.btn.setAttribute('aria-expanded', isHidden ? 'false' : 'true');
    p.menu.setAttribute('aria-hidden', isHidden ? 'true' : 'false');
    setActive(p, !isHidden);

    p.btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const currentlyHidden = p.menu.classList.contains('hidden');
      if (currentlyHidden) {
        closeAllExcept(p);
        openMenu(p);
      } else {
        // clicar novamente fecha
        closeMenu(p);
      }
    });
  });

  // fecha todos ao clicar fora
  document.addEventListener('click', (e) => {
    if (pairs.some(p => p.btn.contains(e.target) || p.menu.contains(e.target))) return;
    pairs.forEach(closeMenu);
  });

  // ESC fecha todos
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') pairs.forEach(closeMenu);
  });
});