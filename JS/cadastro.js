
function verificar() {
  const campo = document.getElementById("username").value;
  const campo2 = document.getElementById("password").value;
  const mensagem = document.getElementById("mensagem");

  if (campo.trim() === "" && campo2.trim() === "" ) {
    const abrir = document.getElementById('abrirPopup');
    const fechar = document.getElementById('fecharPopup');
    const popupBg2 = document.getElementById('popupBg2');

    // Abre o pop-up
    abrir.addEventListener('click', () => {
      popupBg2.style.display = 'flex';
    });

    // Fecha o pop-up
    fechar.addEventListener('click', () => {
      popupBg2.style.display = 'none';
    });

    // Fecha se clicar fora do pop-up
    window.addEventListener('click', (e) => {
      if (e.target === popupBg2) {
        popupBg2.style.display = 'none';
      }
    });
  } else {
    const abrir = document.getElementById('abrirPopup');
    const fechar = document.getElementById('fecharPopup');
    const popupBg = document.getElementById('popupBg');

    // Abre o pop-up
    abrir.addEventListener('click', () => {
      popupBg.style.display = 'flex';
    });

    // Fecha o pop-up
    fechar.addEventListener('click', () => {
      popupBg.style.display = 'none';
    });

    // Fecha se clicar fora do pop-up
    window.addEventListener('click', (e) => {
      if (e.target === popupBg) {
        popupBg.style.display = 'none';
      }
    });
  }
}