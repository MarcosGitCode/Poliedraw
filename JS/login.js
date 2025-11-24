document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("loginForm");
    let tipoUsuario = null; // Começa nulo

    const btnProfessor = document.getElementById("professor");
    const btnAluno = document.getElementById("aluno");

    // Seleção visual dos botões
    btnProfessor.addEventListener("click", () => {
        tipoUsuario = "professor";
        btnProfessor.style.backgroundColor = "#AE1E41"; // Cor ativa
        btnAluno.style.backgroundColor = "#212121";
    });

    btnAluno.addEventListener("click", () => {
        tipoUsuario = "aluno";
        btnAluno.style.backgroundColor = "#AE1E41"; // Cor ativa
        btnProfessor.style.backgroundColor = "#212121";
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        if (!tipoUsuario) {
            alert("Por favor, selecione se você é Professor ou Aluno.");
            return;
        }

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
                // --- AQUI ESTÁ A MÁGICA: SALVAR QUEM LOGOU ---
                localStorage.setItem("usuarioId", result.id);
                localStorage.setItem("usuarioTipo", tipoUsuario); 
                localStorage.setItem("usuarioNome", result.nome);

                // Redirecionamento
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