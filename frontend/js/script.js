const API_URL = 'http://localhost:8000/items';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const button = form.querySelector('button[type="submit"]');
        
        // Desabilitar o botão durante o envio
        button.disabled = true;
        button.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i> Enviando...';
        
        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.detail || 'Erro ao enviar email');
            }
            
            // Mostrar mensagem de sucesso
            showMessage(
                '🎉 Inscrição realizada com sucesso!<br>Em breve você receberá novidades sobre o MyFetus.',
                'success'
            );
            
            // Limpar o formulário
            form.reset();
            
        } catch (error) {
            console.error('Erro:', error);
            
            let errorMessage = 'Erro ao realizar inscrição. Tente novamente.';
            
            // Mensagens específicas para diferentes tipos de erro
            if (error.message.includes('already exists')) {
                errorMessage = 'Este email já está cadastrado.';
            } else if (error.message.includes('invalid email')) {
                errorMessage = 'Por favor, insira um email válido.';
            } else if (!navigator.onLine) {
                errorMessage = 'Sem conexão com a internet. Verifique sua conexão e tente novamente.';
            }
            
            showMessage(`❌ ${errorMessage}`, 'error');
        } finally {
            // Reabilitar o botão
            button.disabled = false;
            button.innerHTML = '<i class="fas fa-paper-plane me-2"></i> Inscreva-se';
        }
    });
});

function showMessage(message, type) {
    // Remover mensagem anterior se existir
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.classList.add('fade-out');
        setTimeout(() => existingMessage.remove(), 300);
    }
    
    // Criar elemento da mensagem
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    
    // Criar conteúdo da mensagem
    const messageContent = document.createElement('div');
    messageContent.className = 'message-content';
    messageContent.innerHTML = message;
    
    // Criar botão OK
    const okButton = document.createElement('button');
    okButton.className = 'btn-ok';
    okButton.innerHTML = '<i class="fas fa-check me-1"></i> OK';
    okButton.onclick = () => {
        messageDiv.classList.add('fade-out');
        setTimeout(() => messageDiv.remove(), 300);
    };
    
    // Adicionar conteúdo e botão à mensagem
    messageDiv.appendChild(messageContent);
    messageDiv.appendChild(okButton);
    
    // Adicionar a mensagem ao formulário
    const formBox = document.querySelector('.form-box');
    formBox.insertBefore(messageDiv, formBox.firstChild);
}
