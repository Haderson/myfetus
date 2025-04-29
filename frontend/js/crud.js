const API_URL = 'http://localhost:8000/items';

// Elementos do DOM
const itemForm = document.getElementById('itemForm');
const itemsList = document.getElementById('itemsList');
const cancelBtn = document.getElementById('cancelBtn');

// Carregar itens ao iniciar
document.addEventListener('DOMContentLoaded', loadItems);

// Função para mostrar mensagem de feedback
function showAlert(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
    alertDiv.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    `;
    
    const container = document.querySelector('.container');
    container.insertBefore(alertDiv, container.firstChild);
    
    // Remover o alerta após 3 segundos
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// Função para carregar todos os itens
async function loadItems() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Erro ao carregar dados');
        const items = await response.json();
        displayItems(items);
    } catch (error) {
        console.error('Erro ao carregar itens:', error);
        showAlert('Erro ao carregar a lista de emails', 'danger');
    }
}

// Função para exibir os itens na tabela
function displayItems(items) {
    itemsList.innerHTML = '';
    if (items.length === 0) {
        itemsList.innerHTML = `
            <tr>
                <td colspan="3" class="text-center py-4">
                    <i class="fas fa-inbox fa-2x mb-3 text-muted"></i>
                    <p class="text-muted">Nenhum email cadastrado</p>
                </td>
            </tr>
        `;
        return;
    }
    
    items.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.id}</td>
            <td>${item.email}</td>
            <td class="text-end">
                <button class="btn btn-sm btn-warning me-2" onclick="editItem(${item.id}, '${item.email}')" 
                        title="Editar">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="deleteItem(${item.id})" 
                        title="Excluir">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        itemsList.appendChild(row);
    });
}

// Função para criar ou atualizar um item
itemForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const itemId = document.getElementById('itemId').value;
    const email = document.getElementById('email').value;
    
    const item = { email };
    
    try {
        if (itemId) {
            // Atualizar item existente
            const response = await fetch(`${API_URL}/${itemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            });
            
            if (!response.ok) throw new Error('Erro ao atualizar email');
            showAlert('Email atualizado com sucesso!');
        } else {
            // Criar novo item
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(item)
            });
            
            if (!response.ok) throw new Error('Erro ao criar email');
            showAlert('Email cadastrado com sucesso!');
        }
        
        // Limpar formulário e recarregar lista
        itemForm.reset();
        document.getElementById('itemId').value = '';
        cancelBtn.style.display = 'none';
        loadItems();
    } catch (error) {
        console.error('Erro ao salvar item:', error);
        showAlert('Erro ao salvar o email', 'danger');
    }
});

// Função para editar um item
function editItem(id, email) {
    document.getElementById('itemId').value = id;
    document.getElementById('email').value = email;
    cancelBtn.style.display = 'inline-block';
    
    // Scroll para o formulário
    document.querySelector('.card').scrollIntoView({ behavior: 'smooth' });
}

// Função para excluir um item
async function deleteItem(id) {
    if (confirm('Tem certeza que deseja excluir este email?')) {
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Erro ao excluir email');
            showAlert('Email excluído com sucesso!');
            loadItems();
        } catch (error) {
            console.error('Erro ao excluir item:', error);
            showAlert('Erro ao excluir o email', 'danger');
        }
    }
}

// Função para cancelar edição
cancelBtn.addEventListener('click', () => {
    itemForm.reset();
    document.getElementById('itemId').value = '';
    cancelBtn.style.display = 'none';
}); 