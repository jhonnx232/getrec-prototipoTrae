$(document).ready(function() {
    // Toggle password visibility
    $('.toggle-password').on('click', function() {
        const input = $(this).parent().find('input');
        const type = input.attr('type') === 'password' ? 'text' : 'password';
        input.attr('type', type);
        $(this).toggleClass('fa-eye fa-eye-slash');
    });
    
    // Formulário de login
    $('#login-form').on('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            email: $('#email').val(),
            password: $('#senha').val()
        };
        
        // Enviar para a API
        $.ajax({
            url: '/api/login',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify(formData),
            success: function(response) {
                showMessage('Login realizado com sucesso! Redirecionando...', 'success');
                
                // Salvar dados do usuário no localStorage
                localStorage.setItem('userData', JSON.stringify(response.user));
                
                // Determinar URL de redirecionamento
                let redirect = response && response.redirect;

                // Normaliza o redirect recebido da API para apontar para /app
                if (redirect) {
                    // Se vier sem prefixo /app, adiciona
                    if (!redirect.startsWith('/app/')) {
                        // Garante que começa com barra
                        if (!redirect.startsWith('/')) {
                            redirect = '/' + redirect;
                        }
                        redirect = '/app' + redirect;
                    }
                }

                // Caso não exista redirect explícito, decide pelo tipo
                if (!redirect && response && response.user && response.user.tipo) {
                    switch (response.user.tipo) {
                        case 'aluno':
                            redirect = '/app/dashboard-aluno.html';
                            break;
                        case 'rh':
                            redirect = '/app/dashboard-rh.html';
                            break;
                        case 'admin':
                        case 'instrutor':
                            redirect = '/app/dashboard-admin.html';
                            break;
                        default:
                            redirect = '/index.html';
                    }
                }
                
                // Redirecionar para a página apropriada
                setTimeout(function() {
                    window.location.href = redirect || '/index.html';
                }, 1000);
            },
            error: function(xhr) {
                let errorMsg = 'Erro ao realizar login.';
                if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMsg = xhr.responseJSON.error;
                }
                showMessage(errorMsg, 'error');
            }
        });
    });
    
    // Função para exibir mensagens
    function showMessage(message, type) {
        const messageElement = $('#login-message');
        messageElement.text(message);
        messageElement.removeClass('success error').addClass(type);
        messageElement.show();
    }
});