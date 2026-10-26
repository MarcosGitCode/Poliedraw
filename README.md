# ✨ Poliedraw – Gerador de Imagens com IA 🖼️

Plataforma web educacional desenvolvida para a **Escola Poliedro** que permite a alunos e professores transformarem descrições textuais em imagens didáticas geradas por **Inteligência Artificial**, unindo criatividade, tecnologia e educação.

---

## ⚡ Inicialização Rápida (1 Comando - Zero Friction)

Você pode clonar e rodar o projeto imediatamente em qualquer sistema operacional, **sem precisar configurar banco de dados nem cadastrar chave de API**:

### No Linux / macOS:
```bash
git clone https://github.com/MarcosGitCode/Poliedraw.git
cd Poliedraw
./start.sh
```

### No Windows:
Dê duplo clique em `start.bat` ou execute no terminal:
```cmd
start.bat
```
*(ou via PowerShell: `.\start.ps1`)*

> O script instala as dependências, sobe o banco de dados (MySQL via Docker/Podman ou SQLite local automático), aplica os seeds dos usuários de teste, inicializa o backend na porta `3001`, serve o frontend na porta `5502` e abre a aplicação automaticamente no seu navegador padrão!

---

## 🤖 Inteligência Artificial (Modo Híbrido Resiliente)

O Poliedraw opera com arquitetura de IA flexível:

1. **Modo Zero-Key (Gratuito sem Chave):**  
   Se nenhuma chave for informada, o sistema utiliza o provedor comunitário **Pollinations.ai**, sem exigir uma chave do Google. A fidelidade varia conforme o modelo e o pedido; descrições claras ajudam, mas textos e números exatos podem não sair corretamente.
2. **Modo Google Gemini Oficial:**  
   Se desejar utilizar o **Google Gemini 2.5 Flash Image**, basta adicionar sua chave no arquivo `.env`:
   ```env
   GEMINI_API_KEY=sua_chave_do_google_ai_studio
   ```

Pedidos explícitos no formato “número 43” ou “algarismo 43” são renderizados diretamente para preservar os dígitos exatos. Cores conhecidas mencionadas no pedido (como verde e vermelho) são aplicadas ao número; outros pedidos continuam sendo gerados pela IA.

---

## 🔑 Credenciais de Teste

O ambiente já vem pré-configurado com os seguintes usuários de teste:

| Perfil | E-mail | Senha |
| :--- | :--- | :--- |
| **Professor** | `gui@sistemapoliedro` | `4343` |
| **Aluno** | `aluno@sistemapoliedro` | `43` |

*(As senhas são protegidas com criptografia hash **bcrypt** no banco de dados).*

---

## 🔐 Segurança

Para consultar as diretrizes de segurança aplicadas a este repositório público, matriz de correções de vulnerabilidades e política de tratamento de dados sensíveis, consulte:  
👉 **[Política de Segurança (docs/SECURITY.md)](docs/SECURITY.md)**

---

## 🛠️ Tecnologias Utilizadas

| Camada | Tecnologias |
| :--- | :--- |
| **Frontend** | HTML5, CSS3, JavaScript Modular |
| **Backend** | Node.js (ES Modules), Express 5, CORS, Bcrypt |
| **IA / Visão** | Google Gemini 2.5 Flash Image (@google/genai) com fallback para Pollinations.ai |
| **Banco de Dados** | MySQL 8.0 (mysql2) + SQLite 3 portátil |
| **DevOps / DX** | Docker Compose, Podman, Shell Script e Batch/PowerShell para Windows |

---

## 👨‍💻 Membros da Equipe

* Guilherme Britto
* Demetrius Damasio
* Guilherme Calderan
* Marcos de Salles
* Guilherme Nunes
* Nikolas Figura
