# Política de Segurança & Relatório de Remediações: Poliedraw

Este documento estabelece as diretrizes de segurança aplicadas ao repositório público **Poliedraw** e registra o histórico de vulnerabilidades corrigidas.

---

## 1. Diretrizes de Segurança para Repositório Público

Por se tratar de um repositório aberto, aplicam-se as seguintes regras fundamentais:

1. **Zero Credenciais Hardcoded:** Nenhuma chave de API, senha de banco de dados ou secret de assinatura deve ser inserida em arquivos versionados pelo Git (`.js`, `.html`, `.json`, etc.).
2. **Isolamento de Variáveis de Ambiente:** Todos os parâmetros sensíveis ou específicos do ambiente de execução devem residir exclusivamente no arquivo `.env`.
3. **Bloqueio de Segredos no Git:** O arquivo `.env` deve permanecer listado no `.gitignore` de forma irrevogável. Apenas o modelo `.env.example` (com valores vazios ou didáticos) pode ser versionado.

---

## 2. Matriz de Vulnerabilidades e Remediações

| # | Vulnerabilidade Identificada | Severidade | Impacto | Correção Implementada |
|---|---|---|---|---|
| **V01** | **Senhas em Texto Puro no Banco** | **Crítica** | Vazamento de senhas de professores e alunos em caso de acesso indevido à base de dados. | Migração para hashing criptográfico forte com **bcrypt** (fator de custo 10). Senhas legadas são automaticamente migradas no primeiro login. |
| **V02** | **Credenciais Padrão no Código** | **Média** | Exposição de credenciais locais de laboratório (`imtdb`) no código aberto. | Remoção de fallbacks com senhas sensíveis no código. Todas as credenciais são lidas de `process.env`. |
| **V03** | **CORS Irrestrito (`cors()`)** | **Média** | Qualquer site malicioso rodando no navegador da vítima poderia efetuar chamadas contra a API local. | Implementação de lista branca (*allowlist*) restrita às origens locais legítimas (`localhost:3000`, `localhost:5502`, etc.). |
| **V04** | **Dependência Exclusiva de Chaves Pagas** | **Média** | Falha da aplicação e exposição a erros caso o usuário não possua cota ou chave de API ativa. | Implementação de arquitetura híbrida com **fallback automático para IA gratuita (Pollinations.ai)**, permitindo execução 100% funcional sem API key. |
| **V05** | **Rota Duplicada (`DELETE /imagens/:id`)** | **Baixa** | Redundância e potencial inconsistência na manutenção de rotas Express. | Remoção da declaração duplicada em `backend/conexao.js`. |
| **V06** | **Falha de Inicialização Sem MySQL** | **Alta** | Crash catastrófico da aplicação por acoplamento rígido de porta TCP local. | Implementação de conexão resiliente com fallback automático para banco **SQLite local e portátil**, garantindo operação autônoma sem MySQL. |

---

## 3. Autenticação Segura com Bcrypt

### Cadastro e Armazenamento
Ao cadastrar um novo aluno (`POST /cadastrarAlunos`) ou atualizar dados (`PUT /alunos/:id`), a senha recebida é processada com:
```javascript
const hashedPassword = await bcrypt.hash(String(senha).trim(), 10);
```

### Validação no Login e Migração Transparente
Durante a autenticação (`POST /professores` e `POST /alunosLogin`), o sistema:
1. Compara a senha fornecida com o hash armazenado via `bcrypt.compare()`.
2. Caso a conta possua uma senha antiga legada em texto plano, o sistema valida a correspondência e **atualiza imediatamente o registro para o hash bcrypt correspondente**, garantindo conformidade sem indisponibilidade para o usuário.

---

## 4. Geração de Imagens com IA Segura e Sem Chave

- **Modo Oficial (Google Gemini):** Ativado quando `GEMINI_API_KEY` for informada no arquivo `.env`. Utiliza o modelo `gemini-2.5-flash-image` com prompt didático educacional.
- **Modo Zero-Key (Pollinations.ai):** Ativado automaticamente quando nenhuma chave estiver presente ou caso ocorra indisponibilidade na API do Gemini. A imagem é baixada de forma segura pelo backend, convertida em Base64 Data URL e entregue ao frontend sem alterar o contrato de resposta.

---

## 5. Como Reportar Vulnerabilidades

Caso identifique uma vulnerabilidade de segurança, abra uma *Issue* privada no GitHub ou entre em contato diretamente com os mantenedores do projeto.
