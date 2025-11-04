document.addEventListener("DOMContentLoaded", () => {
    const popupBg = document.getElementById("popupBg");
    const btnAbrir = document.getElementById("abrirPopup");
    const btnNao = document.getElementById("nao");
    const btnSim = document.getElementById("sim");

    // Abre o popup
    btnAbrir.addEventListener("click", () => {
        popupBg.style.display = "flex";
    });

    // Fecha o popup
    btnNao.addEventListener("click", () => {
        popupBg.style.display = "none";
    });

    // Cadastrar (se confirmar)
    btnSim.addEventListener("click", async (event) => {
        event.preventDefault();
        const nome = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const senha = document.getElementById("password").value;

        try {
            const response = await fetch("http://localhost:3000/cadastrarAlunos", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nome, email, senha })
            });

            const result = await response.json();

            if (result.success) {
                alert("Aluno cadastrado com sucesso!");
                window.location.href = "./cadastro.html";
            } else {
                alert("Não foi possível cadastrar o aluno");
            }
        } catch (err) {
            alert("Erro ao conectar no servidor");
            console.error(err);
        }
    });
});
