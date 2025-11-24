document.addEventListener("DOMContentLoaded", async () => {
    // --- 1. INJEÇÃO DE ESTILOS (CSS NO JAVASCRIPT) ---
    const style = document.createElement('style');
    style.innerHTML = `
        /* Scrollbar Invisível */
        main::-webkit-scrollbar { display: none; }
        main { -ms-overflow-style: none; scrollbar-width: none; }

        /* Grid Responsivo */
        .galeria-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 40px;
            padding: 20px 40px;
            max-width: 1600px;
            margin: 0 auto;
        }

        @media (min-width: 1200px) {
            .galeria-grid { grid-template-columns: repeat(4, 1fr); }
        }

        @media (max-width: 600px) {
            .galeria-grid { grid-template-columns: 1fr; padding: 0 20px; gap: 30px; }
        }

        /* Card Estilo */
        .card-container {
            background: #303030;
            border-radius: 16px;
            padding: 16px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            height: 100%;
            border: 1px solid rgba(255,255,255,0.05);
            transition: transform 0.2s ease;
        }
        .card-container:hover {
            transform: translateY(-5px);
            border-color: rgba(255,255,255,0.2);
            box-shadow: 0 10px 25px rgba(0,0,0,0.5);
        }

        /* Botões Galeria */
        .btn-download {
            background: #1C8590; color: white; padding: 12px; border-radius: 8px;
            text-decoration: none; font-weight: bold; flex: 3; text-align: center;
            font-size: 0.9rem; transition: 0.2s; border: none;
        }
        .btn-download:hover { background: #26b0be; }

        .btn-lixeira {
            background: #AE1E41; border: none; border-radius: 8px; cursor: pointer;
            flex: 1; display: flex; align-items: center; justify-content: center;
            transition: 0.2s; padding: 10px;
        }
        .btn-lixeira:hover { background: #ff4b4b; }

        /* --- NOVO CSS DO POPUP (CORRIGIDO) --- */
        #popupOverlay {
            display: none;
            position: fixed;
            top: 0; left: 0;
            width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.8);
            z-index: 99999; /* Muito alto para ficar na frente de tudo */
            justify-content: center;
            align-items: center;
            backdrop-filter: blur(5px);
        }

        .popup-box {
            background: #212121;
            padding: 40px 30px;
            border-radius: 20px;
            text-align: center;
            width: 90%;
            max-width: 400px;
            border: 2px solid #444; /* Borda mais visível */
            box-shadow: 0 20px 50px rgba(0,0,0,0.8);
            display: flex;
            flex-direction: column;
            align-items: center;
            gap: 25px; /* Espaço entre texto e botões */
        }

        .popup-titulo {
            color: white;
            font-size: 1.2rem;
            font-weight: bold;
            margin: 0; /* Remove margens estranhas */
            font-family: 'Quicksand', sans-serif;
        }

        .popup-botoes {
            display: flex;
            gap: 15px;
            width: 100%;
            justify-content: center;
        }

        .btn-cancelar {
            background: #464646; color: white; border: none; padding: 12px 24px;
            border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 1rem;
            transition: 0.2s;
        }
        .btn-cancelar:hover { background: #5a5a5a; }

        .btn-confirmar {
            background: #AE1E41; color: white; border: none; padding: 12px 24px;
            border-radius: 10px; cursor: pointer; font-weight: bold; font-size: 1rem;
            transition: 0.2s;
        }
        .btn-confirmar:hover { background: #d62652; }
    `;
    document.head.appendChild(style);

    // --- 2. LÓGICA DO JAVASCRIPT ---
    const main = document.querySelector("main");
    const idUsuario = localStorage.getItem("usuarioId");
    const tipoUsuario = localStorage.getItem("usuarioTipo");
    let idParaExcluir = null;

    main.style.height = "93vh";
    main.style.overflowY = "auto";
    main.style.paddingBottom = "60px";
    main.style.boxSizing = "border-box";

    // --- CRIAÇÃO DO POPUP (HTML Estruturado) ---
    const popupOverlay = document.createElement("div");
    popupOverlay.id = "popupOverlay"; // ID usado no CSS acima

    const popupBox = document.createElement("div");
    popupBox.className = "popup-box"; // Classe CSS

    const popupTexto = document.createElement("p");
    popupTexto.className = "popup-titulo";
    popupTexto.innerText = "Tem certeza que deseja excluir esta imagem?";

    const btnContainer = document.createElement("div");
    btnContainer.className = "popup-botoes";

    const btnCancelar = document.createElement("button");
    btnCancelar.innerText = "Cancelar";
    btnCancelar.className = "btn-cancelar";
    btnCancelar.onclick = fecharPopup;

    const btnConfirmar = document.createElement("button");
    btnConfirmar.innerText = "Sim, Excluir";
    btnConfirmar.className = "btn-confirmar";
    
    btnConfirmar.onclick = async () => {
        if (!idParaExcluir) return;
        try {
            const res = await fetch(`http://localhost:3000/imagens/${idParaExcluir}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                fecharPopup();
                carregarGaleria();
            } else {
                alert("Erro ao excluir: " + (data.error || "Erro desconhecido"));
            }
        } catch (err) {
            console.error(err);
            alert("Erro de conexão ao excluir.");
        }
    };

    // Montagem do Popup
    btnContainer.appendChild(btnCancelar);
    btnContainer.appendChild(btnConfirmar);
    popupBox.appendChild(popupTexto);
    popupBox.appendChild(btnContainer);
    popupOverlay.appendChild(popupBox);
    document.body.appendChild(popupOverlay);

    function abrirPopup(id) {
        idParaExcluir = id;
        popupOverlay.style.display = "flex";
    }

    function fecharPopup() {
        idParaExcluir = null;
        popupOverlay.style.display = "none";
    }

    // --- CARREGAMENTO DA GALERIA ---
    async function carregarGaleria() {
        main.innerHTML = "";

        const titulo = document.createElement("h1");
        titulo.innerText = "Imagens Salvas";
        titulo.style.textAlign = "center";
        titulo.style.marginBottom = "40px";
        titulo.style.marginTop = "20px";
        titulo.style.color = "white";
        main.appendChild(titulo);

        if (!idUsuario || !tipoUsuario) {
            main.innerHTML += "<p style='text-align:center; color:white;'>Faça login para ver suas imagens.</p>";
            return;
        }

        try {
            const response = await fetch(`http://localhost:3000/minhasImagens?id=${idUsuario}&tipo=${tipoUsuario}`);
            const imagens = await response.json();

            if (imagens.length === 0) {
                main.innerHTML += "<p style='text-align:center; color:white;'>Nenhuma imagem encontrada.</p>";
                return;
            }

            const grid = document.createElement("div");
            grid.className = "galeria-grid";

            imagens.forEach(item => {
                const card = document.createElement("div");
                card.className = "card-container";

                const img = document.createElement("img");
                img.src = item.imagem;
                img.style.width = "100%";
                img.style.borderRadius = "12px";
                img.style.marginBottom = "15px";
                img.style.objectFit = "cover";
                img.style.aspectRatio = "1 / 1"; 

                const pPrompt = document.createElement("p");
                pPrompt.innerText = item.prompt;
                pPrompt.style.cssText = "font-size: 0.9rem; color: #e0e0e0; text-align: center; margin: 0 0 15px 0; flex-grow: 1; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden;";

                const actionDiv = document.createElement("div");
                actionDiv.style.cssText = "display: flex; gap: 10px; width: 100%; margin-top: auto;";

                const btnDownload = document.createElement("a");
                btnDownload.href = item.imagem;
                btnDownload.download = `poliedraw-${item.id_imagem}.png`;
                btnDownload.innerText = "Baixar";
                btnDownload.className = "btn-download";
                
                const btnExcluir = document.createElement("button");
                btnExcluir.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>`;
                btnExcluir.className = "btn-lixeira";
                btnExcluir.onclick = () => abrirPopup(item.id_imagem);

                actionDiv.appendChild(btnDownload);
                actionDiv.appendChild(btnExcluir);

                card.appendChild(img);
                card.appendChild(pPrompt);
                card.appendChild(actionDiv);
                grid.appendChild(card);
            });

            main.appendChild(grid);

        } catch (err) {
            console.error(err);
            main.innerHTML += "<p style='text-align:center; color:red'>Erro ao carregar galeria.</p>";
        }
    }

    carregarGaleria();
});