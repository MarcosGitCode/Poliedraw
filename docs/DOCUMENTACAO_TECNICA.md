# Poliedraw — Documentação Técnica

**Produto:** Poliedraw — Gerador de imagens educacionais com IA  
**Instituição:** Escola Poliedro  
**Versão documentada:** 1.0.0  
**Data:** 21 de outubro de 2026

## 1. Visão geral e propósito

O Poliedraw é uma plataforma web educacional da Escola Poliedro para transformar descrições em linguagem natural em imagens geradas por inteligência artificial. Professores e alunos podem autenticar-se em fluxos separados, escrever prompts, receber imagens, fazer download e salvar criações em uma galeria.

O backend integra o modelo Google Gemini 2.5 Flash Image por meio de @google/genai. O prompt de sistema orienta imagens claras, simples, fiéis ao pedido e adequadas para fins didáticos, restringindo violência, sexualidade, conteúdo ofensivo ou impróprio, marcas reais, pessoas reais e textos longos não solicitados.

### Escopo funcional

- login de Professor e Aluno;
- geração de imagens por prompt;
- download e salvamento automático para usuário autenticado;
- consulta e exclusão da galeria;
- CRUD de alunos;
- frontend HTML5/CSS3/JavaScript modular.

### Requisitos

| ID | Requisito |
|---|---|
| RF01 | Login de professor por e-mail e senha. |
| RF02 | Login de aluno por e-mail e senha. |
| RF03 | Experiência correspondente ao perfil autenticado. |
| RF04 | Envio de prompt para geração. |
| RF05 | Exibição de texto e imagens retornados pelo Gemini. |
| RF06 | Persistência de imagem, prompt, ID e tipo do usuário. |
| RF07 | Listagem ordenada das imagens do usuário. |
| RF08 | Consulta, criação, edição e exclusão de alunos. |
| RF09 | Exclusão de imagem salva. |
| RNF01 | Node.js, ES Modules e Express 5. |
| RNF02 | Payload JSON de até 50 MB para imagens Base64. |
| RNF03 | Infraestrutura externa via .env. |
| RNF04 | Arquitetura de banco dual: MySQL 8.0 como principal e SQLite 3 como fallback automático integrado. |
| RNF05 | Senhas com hashing criptográfico seguro (bcrypt). |
| RNF06 | Arquitetura de IA resiliente: suporte a Google Gemini e fallback sem chave para Pollinations.ai. |
| RNF07 | Execução Zero-Friction multiplataforma via `./start.sh` (Linux/macOS) e `start.bat`/`start.ps1` (Windows). |

## 2. Arquitetura e fluxo

    Navegador
      HTML5 + CSS3 + JavaScript modular
                 │ HTTP/JSON
                 ▼
    Node.js + Express 5 (backend/conexao.js)
      autenticação · CRUD · tabelas · POST /api/gemini
          ├── mysql2/promise → MySQL (runtime atual)
          └── @google/genai → Gemini 2.5 Flash Image

| Camada | Implementação |
|---|---|
| Runtime | Node.js |
| Módulos | ES Modules, type=module |
| HTTP | Express 5, CORS e JSON |
| IA | backend/gemini.js, modelo gemini-2.5-flash-image |
| Banco | mysql2/promise; sqlite/sqlite3 preparados |
| Frontend | HTML5, CSS3 e JS em HTML/, CSS/ e JS/ |
| Imagens | Data URL/Base64 em LONGTEXT |

### Fluxo completo

1. Usuário escolhe Professor ou Aluno e informa e-mail e senha.
2. JS/login.js chama /professores ou /alunosLogin.
3. Em sucesso, o navegador grava usuarioId, usuarioTipo e usuarioNome no localStorage.
4. JS/frontGemini.js envia POST /api/gemini.
5. O backend valida prompt e delega a backend/gemini.js.
6. O módulo envia o prompt de sistema e o prompt do usuário ao Gemini.
7. Partes textuais formam texto; inlineData vira Data URL em imagens.
8. O frontend apresenta e oferece download.
9. Com usuário autenticado, cada imagem é enviada para /salvarImagem.
10. A galeria usa /minhasImagens e /imagens/:id.

### Autenticação

A separação é feita por tabela e endpoint: professores/POST /professores e alunos/POST /alunosLogin. O retorno contém success, id e nome. No estado atual não há sessão server-side, JWT, middleware de autorização ou hash de senha; a identificação usa localStorage e os endpoints de CRUD não protegem acesso por papel. Isso deve ser corrigido antes de implantação pública.

## 3. API completa

Base local: http://localhost:3000. Formato padrão: JSON.

### POST /professores

Autentica professor. Request: { "email": "gui@sistemapoliedro", "senha": "4343" }. Sucesso: { success: true, id: 1, nome: "Guilherme 43" }. Credencial inválida retorna { success: false } com 200. Falha de banco retorna 500.

### POST /alunosLogin

Autentica aluno. Recebe o mesmo contrato e retorna { success, id, nome }; credencial inválida retorna { success: false }; falha interna retorna 500.

### POST /salvarImagem

Request:

    {
      "id_usuario": 1,
      "tipo_usuario": "aluno",
      "prompt": "Mapa simples do ciclo da água",
      "imagem": "data:image/png;base64,..."
    }

id_usuario e imagem são obrigatórios; ausência retorna 400. Sucesso retorna confirmação; falha de banco retorna 500.

### GET /minhasImagens?id=<id>&tipo=<tipo>

Exige id e tipo, filtra por id_usuario e tipo_usuario e ordena por data_criacao DESC. Sucesso retorna array; ausência de parâmetro retorna 400; falha de banco retorna 500.

### GET /alunos

Retorna todos os registros da tabela alunos. Sucesso retorna array JSON; falha de banco retorna 500.

### POST /cadastrarAlunos

Cria aluno com nome, email e senha. Retorna { success, id }. Erros de inserção, inclusive e-mail duplicado, são tratados como 500 no código atual.

### PUT /alunos/:id

Atualiza nome e email. Se o e-mail não terminar em @sistemapoliedro, retorna 400; ID inexistente retorna 404; sucesso retorna confirmação; falha interna retorna 500.

### DELETE /alunos/:id

Exclui por id_aluno. Sucesso retorna confirmação; ID inexistente retorna 404; referência impeditiva de histórico retorna 400; demais falhas retornam 500.

### DELETE /imagens/:id

Exclui por id_imagem. Sucesso retorna confirmação; ausência retorna 404; erro de banco retorna 500.

> Observação: backend/conexao.js declara DELETE /imagens/:id duas vezes com implementação equivalente. A duplicidade deve ser removida em manutenção futura.

### POST /api/gemini

Request: { "prompt": "Uma célula vegetal com suas estruturas identificadas" }. userId pode ser enviado pelo frontend, mas não participa da chamada ativa ao banco. Sem prompt retorna 400. Sucesso: { "texto": "...", "imagens": ["data:image/png;base64,..."] }. Falhas do Gemini retornam 500.

#### Regras do prompt didático

- fidelidade máxima ao texto;
- composição limpa, organizada, nítida e didática;
- neutralidade de estilo quando não solicitada;
- interpretação simples para pedidos vagos ou ambíguos;
- versão plausível para ideias impossíveis ou inconsistentes;
- não gerar violência, sexualidade, conteúdo ofensivo ou impróprio;
- não incluir marcas, logotipos, pessoas reais ou celebridades;
- não incluir textos longos sem solicitação explícita;
- responder com interpretação direta e imagem, sem comentário adicional.

## 4. Modelo de dados

O schema está em BD/banco.sql. backend/conexao.js também executa CREATE TABLE IF NOT EXISTS ao iniciar.

### professores

| Campo | Tipo/regras | Descrição |
|---|---|---|
| id_professor | INT, PK, AUTO_INCREMENT | Identificador |
| nome | VARCHAR(100), NOT NULL | Nome |
| email | VARCHAR(100), UNIQUE, NOT NULL | Login |
| senha | VARCHAR(255), NOT NULL | Senha no estado atual |

### alunos

| Campo | Tipo/regras | Descrição |
|---|---|---|
| id_aluno | INT, PK, AUTO_INCREMENT | Identificador |
| nome | VARCHAR(100), NOT NULL | Nome |
| email | VARCHAR(100), UNIQUE, NOT NULL | Login |
| senha | VARCHAR(255), NOT NULL | Senha no estado atual |

### historico_pesquisa

| Campo | Tipo/regras | Descrição |
|---|---|---|
| id_pesquisa | INT, PK, AUTO_INCREMENT | Identificador |
| tipo_usuario | ENUM professor/aluno, NOT NULL | Perfil lógico |
| id_usuario | INT, NOT NULL | ID lógico do autor |
| termo_pesquisado | TEXT, NOT NULL | Prompt/termo |
| data_pesquisa | DATETIME, default current timestamp | Data/hora |

Não há chave estrangeira; o vínculo é lógico por tipo e ID.

### imagens_geradas

| Campo | Tipo/regras | Descrição |
|---|---|---|
| id_imagem | INT, PK, AUTO_INCREMENT | Identificador |
| id_usuario | INT, NOT NULL | Proprietário lógico |
| tipo_usuario | ENUM professor/aluno, NOT NULL | Perfil |
| prompt | TEXT, NOT NULL | Prompt usado |
| imagem | LONGTEXT, NOT NULL | Data URL/Base64 |
| data_criacao | DATETIME, default current timestamp | Data/hora |

O schema inicial usa LONGBLOB e termina com ALTER TABLE para LONGTEXT; o backend já cria LONGTEXT, alinhado ao payload do frontend.

## 5. Configuração e execução

### Pré-requisitos

- Node.js com ES Modules e npm;
- MySQL em execução;
- chave da API Gemini;
- Chrome/Chromium ou LibreOffice para gerar o PDF.

### Instalação

    git clone https://github.com/MarcosGitCode/Poliedraw.git
    cd Poliedraw
    npm install

### .env

    GEMINI_API_KEY=SUA_CHAVE_DE_API_DO_GEMINI
    DB_HOST=localhost
    DB_PORT=3306
    DB_USER=root
    DB_PASS=sua_senha
    DB_NAME=poliedro_ai
    PORT=3000

Nunca publique chave Gemini, senha do banco ou credenciais de teste.

### Inicialização do banco

    mysql -u root -p < BD/banco.sql

O script cria poliedro_ai, quatro tabelas e registros de exemplo. O backend também garante a estrutura na inicialização.

### Execução

    npm start
    # node backend/conexao.js

Servidor: http://localhost:3000.

    npm run dev
    # nodemon backend/conexao.js

O script dev depende de nodemon, que não está declarado nas devDependencies observadas. Use npm start ou disponibilize nodemon no ambiente.

### Verificação rápida

    curl -s -X POST http://localhost:3000/alunosLogin \
      -H 'Content-Type: application/json' \
      -d '{"email":"aluno@sistemapoliedro","senha":"43"}'

## 6. Estrutura e evolução

    poliedraw/
    ├── backend/       # Express, banco, Gemini e módulos
    ├── BD/banco.sql   # schema e dados iniciais
    ├── HTML/          # páginas
    ├── CSS/           # estilos
    ├── JS/            # comportamento modular
    ├── assets/        # imagens e ícones
    ├── docs/          # documentação técnica e PDF
    ├── package.json
    └── README.md

Antes de publicação externa, priorize: hash de senhas; sessão/token; middleware de autorização por perfil; validação de tipo e propriedade das imagens; limite de Base64, rate limiting e mensagens sem detalhes internos; segredos fora do repositório; integridade referencial; testes automatizados; e adaptador real caso SQLite seja oferecido como alternativa.

Também é recomendável remover a rota duplicada, alinhar schema e código em uma fonte de verdade e retirar credenciais de teste do fluxo de produção.

## 7. Evidência

Esta documentação foi baseada no código presente em backend/, BD/banco.sql, HTML/, CSS/, JS/, README.md e package.json. A versão visual está em docs/documentacao_poliedraw.html e o PDF correspondente em docs/documentacao_poliedraw.pdf.

