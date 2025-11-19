// Função principal para carregar a tabela
async function carregarAlunos() {
    try {
        const response = await fetch('http://localhost:3000/alunos');
        const alunos = await response.json();
        
        const tbody = document.querySelector('#tabelaAlunos tbody');
        // Limpa a tabela antes de encher (Evita duplicação)
        tbody.innerHTML = ''; 

        if (alunos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4" style="text-align:center">Nenhum aluno encontrado</td></tr>';
            return;
        }

        // Cria o HTML de uma vez só (Melhor performance)
        const html = alunos.map(aluno => `
            <tr data-id="${aluno.id_aluno}">
                <td class="col-id">${aluno.id_aluno}</td>
                <td class="col-nome">${aluno.nome}</td>
                <td class="col-email">${aluno.email}</td>
                <td class="col-actions">
                    <button class="action-btn edit-btn" data-action="edit">Editar</button>
                    <button class="action-btn delete-btn" data-action="delete">Excluir</button>
                </td>
            </tr>
        `).join('');
        
        tbody.innerHTML = html;

    } catch (erro) {
        console.error('Erro ao buscar alunos:', erro);
    }
}

// Função para ATUALIZAR (Editada para usar PATCH e tratar erros)
async function updateAluno(id, data) {
    try {
        const resp = await fetch(`http://localhost:3000/alunos/${id}`, {
            method: 'PUT', 
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (!resp.ok) {
            const errorMsg = await resp.text();
            throw new Error(errorMsg || 'Falha ao atualizar');
        }
        
        alert('Aluno atualizado com sucesso!');
        carregarAlunos(); // Recarrega a tabela
    } catch (err) {
        console.error('Erro:', err);
        alert('Erro ao atualizar: Verifique se o email termina com @sistemapoliedro');
    }
}

async function deleteAluno(id) {
    if (!confirm('Deseja realmente excluir este aluno?')) return;
    try {
        const resp = await fetch(`http://localhost:3000/alunos/${id}`, { method: 'DELETE' });
        if (!resp.ok) throw new Error('Falha ao excluir');
        carregarAlunos();
    } catch (err) {
        console.error(err);
        alert('Erro ao excluir aluno');
    }
}

// CONFIGURAÇÃO DOS EVENTOS (Executa apenas quando a tela carregar)
document.addEventListener('DOMContentLoaded', () => {
    carregarAlunos();

    const tabela = document.querySelector('#tabelaAlunos tbody');
    
    tabela.addEventListener('click', (e) => {
        const btn = e.target.closest('button');
        if (!btn) return;

        const tr = btn.closest('tr');
        const id = tr.dataset.id;
        const action = btn.dataset.action;

        // AÇÃO: EXCLUIR
        if (action === 'delete') {
            deleteAluno(id);
        }

        // AÇÃO: EDITAR (Transforma texto em input)
        if (action === 'edit') {
            const tdNome = tr.querySelector('.col-nome');
            const tdEmail = tr.querySelector('.col-email');
            const tdActions = tr.querySelector('.col-actions');

            // Guarda o valor original para caso cancele
            const nomeAtual = tdNome.textContent;
            const emailAtual = tdEmail.textContent;

            tdNome.innerHTML = `<input type="text" class="edit-nome" value="${nomeAtual}">`;
            tdEmail.innerHTML = `<input type="text" class="edit-email" value="${emailAtual}">`;
            
            tdActions.innerHTML = `
                <button class="action-btn save-btn" data-action="save" style="color:green">Salvar</button>
                <button class="action-btn cancel-btn" data-action="cancel" style="color:red">Cancelar</button>
            `;
        }

        // AÇÃO: CANCELAR
        if (action === 'cancel') {
            carregarAlunos(); // Apenas recarrega a tabela original
        }

        // AÇÃO: SALVAR
        if (action === 'save') {
            const inputNome = tr.querySelector('.edit-nome');
            const inputEmail = tr.querySelector('.edit-email');

            if (!inputNome || !inputEmail) return;

            const newNome = inputNome.value.trim();
            const newEmail = inputEmail.value.trim();

            if (!newNome || !newEmail) {
                alert('Campos não podem ficar vazios.');
                return;
            }

            // Validação simples do Regex do email antes de enviar
            if (!newEmail.endsWith('@sistemapoliedro')) {
                alert('O email deve terminar com @sistemapoliedro');
                return;
            }

            updateAluno(id, { nome: newNome, email: newEmail });
        }
    });
});
const sql = "UPDATE alunos SET nome = ?, email = ? WHERE id_aluno = ?";