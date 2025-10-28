document.addEventListener("DOMContentLoaded", () => {
      const form = document.getElementById("loginForm");
      let tipoUsuario = null;

      document.getElementById("professor").addEventListener("click", () => {
        tipoUsuario = "professor";
      });
      document.getElementById("aluno").addEventListener("click", () => {
        tipoUsuario = "aluno";
      });

      form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const email = document.getElementById("username").value;
        const senha = document.getElementById("password").value;

        try {
          const endpoint = 
            tipoUsuario === "professor"
              ? "http://localhost:3000/professores"
              : "http://localhost:3000/alunosLogin";

          const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, senha }),
          });

          const result = await response.json();

          if (result.success) {
            if (tipoUsuario === "professor") {
              window.location.href = "./poliedraw.html";
            } else {
              window.location.href = "./poliedrawAluno.html";
            }
          } else {
            alert("Usuário ou senha incorretos!");
          }
        } catch (err) {
          alert("Erro ao conectar com o servidor!");
          console.error(err);
        }
      });
    });
