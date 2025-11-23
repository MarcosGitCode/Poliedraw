# ✨ Poliedraw – Gerador de Imagens com IA 🖼️

## 💡 Sobre o Projeto

Este projeto foi desenvolvido especificamente para a **Escola Poliedro** com o objetivo de criar uma **plataforma web interativa** que permite aos usuários (alunos e professores) **gerar imagens** utilizando **Inteligência Artificial** (IA) através de descrições em texto (*prompts*).

A iniciativa busca unir **criatividade**, **tecnologia** e **educação** em uma ferramenta simples e acessível, incentivando a experimentação e o aprendizado prático com novas tecnologias.

---

## 🚀 Funcionalidades

* **🎨 Geração de Imagens por Texto (Prompting):** Crie imagens únicas e detalhadas usando apenas a imaginação.
* **🧑‍💻 Interface Otimizada:** Design *clean* e amigável, ideal para uso em ambiente de sala de aula.
* **⬇️ Exportação e Download:** Salve as criações em alta qualidade para uso em trabalhos e apresentações.
* **📜 Histórico Básico de Criações:** Acompanhamento das imagens geradas por sessão (funcionalidade em desenvolvimento).
* **🔐 Autenticação:** Separação entre perfis de Professor e Aluno.

---

## 🛠️ Tecnologias Utilizadas

| Categoria | Tecnologia |
| :--- | :--- |
| **Front-end** | HTML, CSS, JavaScript |
| **Back-end** | Node.js |
| **IA/API** | API de Geração de Imagens (ex: Gemini API, DALL-E, etc.) |

---

## ⚙️ Como Rodar o Projeto Localmente

Siga estes passos para configurar e executar o **Poliedraw** em seu ambiente:

1.  **Clone o Repositório:**
    ```bash
    git clone [URL_DO_SEU_REPOSITORIO]
    cd Poliedraw
    ```

2.  **Instale as Dependências:**
    ```bash
    # Dependendo da sua configuração, pode ser:
    npm install 
    # ou
    yarn install
    ```

3.  **Configure a Chave da API (API Key):**
    * Crie um arquivo chamado **`.env`** na raiz do projeto.
    * Adicione sua chave da API de geração de imagens (ex: API Key do Gemini) neste arquivo. **Isso é crucial para o funcionamento da IA.**
    ```env
    # Exemplo: Chave de API do Gemini
    GEMINI_API_KEY="SUA_CHAVE_DE_API_DO_GEMINI_AQUI"
    ```

4.  **Inicie o Servidor:**
    ```bash
    # Utilize o comando configurado para iniciar o Node.js
    npm start 
    # ou
    node server.js
    ```

O projeto estará acessível no endereço `http://localhost:[PORTA]` (verifique a porta configurada no seu arquivo `server.js` ou `app.js`).

---

## 🔑 Credenciais de Teste

Use as credenciais abaixo para testar os diferentes perfis de acesso:

| Perfil | E-mail | Senha |
| :--- | :--- | :--- |
| **Professor** | `gui@sistemapoliedro` | `4343` |
| **Aluno** | `aluno@sistemapoliedro` | `43` |

---

## 👨‍💻 Membros da Equipe

Agradecimentos aos desenvolvedores que tornaram este projeto possível:

* Guilherme Britto
* Demetrius Damasio
* Guilherme Calderan
* Marcos Salles
* Guilherme Nunes
* Nikolas Figura
