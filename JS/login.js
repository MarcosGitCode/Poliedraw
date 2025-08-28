document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");

  const User = "a";
  const Pass = "a";

  form.addEventListener("submit", function (event) {
    event.preventDefault(); 

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if (username === User && password === Pass) {
      window.location.href = "./poliedraw.html";
    } else {
      alert("Usuário ou senha incorretos!");
    }
  });
});
