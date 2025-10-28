async function carregarAlunos() {
    try {
        console.log('Iniciando busca de alunos...');
        const response = await fetch('http://localhost:3000/alunos');
        const alunos = await response.json();
        console.log('Alunos recebidos:', alunos);
        
        const tbody = document.querySelector('#tabelaAlunos tbody');
        tbody.innerHTML = ''; 
        
        if (alunos.length === 0) {
            tbody.innerHTML = '<tr><td colspan="3">Nenhum aluno encontrado</td></tr>';
            return;
        }
        
        alunos.forEach(aluno => {
            tbody.innerHTML += `
                <tr>
                    <td>${aluno.id_aluno}</td>
                    <td>${aluno.nome}</td>
                    <td>${aluno.email}</td>
                </tr>
            `;
        });
    } catch (erro) {
        console.error('Erro ao carregar alunos:', erro);
        const tbody = document.querySelector('#tabelaAlunos tbody');
        tbody.innerHTML = '<tr><td colspan="3">Erro ao carregar alunos</td></tr>';
    }
}


window.carregarAlunos = carregarAlunos;


document.addEventListener('DOMContentLoaded', carregarAlunos);