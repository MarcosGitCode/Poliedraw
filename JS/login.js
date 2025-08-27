document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  const User = "gui43";
  const Pass = "4343";

  form.addEventListener("submit", function (event) {
    event.preventDefault(); // Evita o envio automático do form

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === User && password === Pass) {
      window.location.href = "./poliedraw.html";
    } else {
      alert("Usuário ou senha incorretos!");
    }
  });
});
