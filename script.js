const API_URL = 'http://localhost:3000/chamados';

document.addEventListener('DOMContentLoaded', carregarChamados);

document.getElementById('form-chamado').addEventListener('submit', async (e) => {
  e.preventDefault();

  const id = document.getElementById('chamado-id').value;
  const solicitante = document.getElementById('solicitante').value;
  const categoria = document.getElementById('categoria').value;
  const prioridade = document.getElementById('prioridade').value;
  const descricao = document.getElementById('descricao').value;
  const status = document.getElementById('status').value;

  const dados = { solicitante, categoria, prioridade, descricao, status };

  try {
    if (id) {
      // Alteração de chamado existente
      await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    } else {
      // Cadastro de novo chamado
      await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
    }

    limparFormulario();
    carregarChamados();
  } catch (erro) {
    alert('Erro ao processar requisição.');
  }
});

async function carregarChamados() {
  try {
    const res = await fetch(API_URL);
    const chamados = await res.json();

    const tbody = document.getElementById('tabela-corpo');
    tbody.innerHTML = '';

    chamados.forEach(c => {
      tbody.innerHTML += `
        <tr>
          <td>${c.id}</td>
          <td>${c.solicitante}</td>
          <td>${c.categoria}</td>
          <td>${c.prioridade}</td>
          <td>${c.status}</td>
          <td>${c.data_abertura}</td>
          <td>${c.descricao}</td>
          <td>
            <button class="btn-edit" onclick="prepararEdicao(${c.id})">Editar</button>
            <button class="btn-del" onclick="excluirChamado(${c.id})">Excluir</button>
          </td>
        </tr>
      `;
    });
  } catch (erro) {
    console.error('Erro ao buscar chamados:', erro);
  }
}

async function prepararEdicao(id) {
  const res = await fetch(`${API_URL}/${id}`);
  const c = await res.json();

  document.getElementById('chamado-id').value = c.id;
  document.getElementById('solicitante').value = c.solicitante;
  document.getElementById('solicitante').disabled = true;
  document.getElementById('categoria').value = c.categoria;
  document.getElementById('prioridade').value = c.prioridade;
  document.getElementById('descricao').value = c.descricao;

  const statusSelect = document.getElementById('status');
  const labelStatus = document.getElementById('label-status');
  statusSelect.style.display = 'block';
  labelStatus.style.display = 'block';
  statusSelect.value = c.status;

  document.getElementById('form-titulo').innerText = `Editar Chamado #${c.id}`;
  document.getElementById('btn-cancelar').style.display = 'block';
}

async function excluirChamado(id) {
  if (confirm('Deseja remover este chamado?')) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    carregarChamados();
  }
}

function limparFormulario() {
  document.getElementById('form-chamado').reset();
  document.getElementById('chamado-id').value = '';
  document.getElementById('solicitante').disabled = false;
  document.getElementById('status').style.display = 'none';
  document.getElementById('label-status').style.display = 'none';
  document.getElementById('form-titulo').innerText = 'Novo Chamado';
  document.getElementById('btn-cancelar').style.display = 'none';
}