document.addEventListener("DOMContentLoaded", async () => {
    const main = document.querySelector("main");
    const idUsuario = localStorage.getItem("usuarioId");
    const tipoUsuario = localStorage.getItem("usuarioTipo");

    // Limpa o conteúdo atual do main (se houver)
    main.innerHTML = "";

    // Título
    const titulo = document.createElement("h1");
    titulo.innerText = "Imagens Salvas";
    titulo.style.textAlign = "center";
    titulo.style.marginBottom = "30px";
    main.appendChild(titulo);

    if (!idUsuario || !tipoUsuario) {
        main.innerHTML += "<p style='text-align:center'>Faça login para ver suas imagens.</p>";
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/minhasImagens?id=${idUsuario}&tipo=${tipoUsuario}`);
        const imagens = await response.json();

        if (imagens.length === 0) {
            main.innerHTML += "<p style='text-align:center'>Nenhuma imagem encontrada.</p>";
            return;
        }

        // Grid Container
        const grid = document.createElement("div");
        grid.style.display = "grid";
        grid.style.gridTemplateColumns = "repeat(auto-fill, minmax(280px, 1fr))";
        grid.style.gap = "20px";
        grid.style.padding = "0 20px";

        imagens.forEach(item => {
            const card = document.createElement("div");
            card.style.backgroundColor = "#303030";
            card.style.borderRadius = "12px";
            card.style.padding = "15px";
            card.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
            card.style.display = "flex";
            card.style.flexDirection = "column";
            card.style.alignItems = "center";

            // Imagem
            const img = document.createElement("img");
            img.src = item.imagem;
            img.style.width = "100%";
            img.style.height = "auto";
            img.style.borderRadius = "8px";
            img.style.marginBottom = "10px";
            
            // Botão de Download no Card
            const linkDownload = document.createElement("a");
            linkDownload.href = item.imagem;
            linkDownload.download = `salva-${item.id_imagem}.png`;
            linkDownload.innerText = "Baixar Imagem";
            linkDownload.style.color = "#4DB6AC";
            linkDownload.style.textDecoration = "none";
            linkDownload.style.fontSize = "0.9rem";
            linkDownload.style.marginBottom = "8px";

            // Prompt
            const pPrompt = document.createElement("p");
            pPrompt.innerText = item.prompt;
            pPrompt.style.fontSize = "0.85rem";
            pPrompt.style.color = "#ddd";
            pPrompt.style.textAlign = "center";

            card.appendChild(img);
            card.appendChild(linkDownload);
            card.appendChild(pPrompt);
            grid.appendChild(card);
        });

        main.appendChild(grid);

    } catch (err) {
        console.error(err);
        main.innerHTML += "<p style='text-align:center; color:red'>Erro ao carregar galeria.</p>";
    }
});