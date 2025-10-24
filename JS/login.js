document.addEventListener("DOMContentLoaded", () => {
      const form = document.getElementById("loginForm");

      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("username").value;
        const senha = document.getElementById("password").value;

        try {
          const response = await fetch("http://localhost:3000/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
          });

          const result = await response.json();

          if (result.success) {
            window.location.href = "./poliedraw.html";
          } else {
            alert("Usuário ou senha incorretos!");
          }
        } catch (err) {
          alert("Erro ao conectar com o servidor!");
          console.error(err);
        }
      });
    });