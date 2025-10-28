document.addEventListener('DOMContentLoaded', () => {
  const nao = document.getElementById('nao');
  const sim = document.getElementById('sim');
  const popupBg = document.getElementById('popupBg');
  const mensagem = document.getElementById('mensagem');

  // fecha o pop-up ao clicar em "Não"
  if (nao) {
    nao.addEventListener('click', () => {
      if (popupBg) popupBg.style.display = 'none';
    });
  }

  // ação ao confirmar (Sim)
  if (sim) {
    sim.addEventListener('click', () => {
      if (popupBg) popupBg.style.display = 'none';
      if (mensagem) {
        mensagem.textContent = 'Aluno cadastrado com sucesso!';
      }
      // limpa campos (opcional)
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const password = document.getElementById('password');
      if (name) name.value = '';
      if (email) email.value = '';
      if (password) password.value = '';
    });
  }

  // fecha se clicar fora do pop-up
  window.addEventListener('click', (e) => {
    if (e.target === popupBg) {
      popupBg.style.display = 'none';
    }
  });
});

// verifica campos e abre o pop-up quando preenchidos
function verificar() {
  const campo = document.getElementById("name")?.value || "";
  const campo2 = document.getElementById("email")?.value || "";
  const campo3 = document.getElementById("password")?.value || "";
  const mensagem = document.getElementById("mensagem");
  const popupBg = document.getElementById('popupBg');

  if (campo.trim() === "" || campo2.trim() === "" || campo3.trim() === "")  {
    if (mensagem) {
      mensagem.textContent = "Pelo menos um dos campos está vazio!";
    }
    if (popupBg) popupBg.style.display = 'none';
  } else {
    if (mensagem) mensagem.textContent = "";
    if (popupBg) popupBg.style.display = 'flex';
  }
}