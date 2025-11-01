// Exibir o nome do usuário logado
document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    if (userData && userData.id) {
        // Buscar dados atualizados do usuário diretamente do banco
        fetch(`/api/usuario/${userData.id}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('user-name').textContent = data.nome;
            })
            .catch(error => {
                console.error('Erro ao buscar dados do usuário:', error);
                // Fallback para dados do localStorage se a API falhar
                if (userData.nome) {
                    document.getElementById('user-name').textContent = userData.nome;
                }
            });
     }
});

// Funções para carregar dados de cursos
async function carregarDadosCursos() {
    try {
        const response = await fetch('../data/cursos.json');
        if (!response.ok) {
            throw new Error('Erro ao carregar dados de cursos');
        }
        const dados = await response.json();
        return dados;
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        return [];
    }
}

// Função para atualizar a interface com os dados dos cursos
async function atualizarInterfaceCursos(cursos) {
    // Atualizar os cursos em andamento
    const cursosContainer = document.querySelector('.courses-grid');
    if (cursosContainer && cursos.length > 0) {
        // Limpar o container
        cursosContainer.innerHTML = '';
        
        // Adicionar os cursos
        cursos.forEach(curso => {
            if (curso.status === 'ativo') {
                const cursoElement = document.createElement('div');
                cursoElement.className = 'course-card';
                cursoElement.innerHTML = `
                    <div class="course-image" style="background-image: url('${curso.imagem}')"></div>
                    <div class="course-content">
                        <h3>${curso.titulo}</h3>
                        <p class="course-category">${curso.categoria}</p>
                        <p class="course-instructor">Instrutor: ${curso.instrutor}</p>
                        <div class="course-progress">
                            <div class="progress-bar" style="width: 65%"></div>
                        </div>
                        <p class="progress-text">65% concluído</p>
                        <a href="#" class="btn btn-primary">Continuar</a>
                    </div>
                `;
                cursosContainer.appendChild(cursoElement);
            }
        });
    }
    
    // Atualizar estatísticas
    const totalCursos = cursos.length;
    const cursosConcluidos = cursos.filter(curso => curso.status === 'concluido').length;
    const cursosEmAndamento = cursos.filter(curso => curso.status === 'ativo').length;
    
    const statsCursos = document.getElementById('stats-cursos');
    const statsConcluidos = document.getElementById('stats-concluidos');
    const statsEmAndamento = document.getElementById('stats-em-andamento');
    
    if (statsCursos) statsCursos.textContent = totalCursos;
    if (statsConcluidos) statsConcluidos.textContent = cursosConcluidos;
    if (statsEmAndamento) statsEmAndamento.textContent = cursosEmAndamento;
}

// Inicializar dados ao carregar a página
async function inicializarDados() {
    const cursos = await carregarDadosCursos();
    await atualizarInterfaceCursos(cursos);
}

document.addEventListener('DOMContentLoaded', function() {
    // Carregar dados
    inicializarDados();
    // Alternador de tema (claro/escuro) para o dashboard
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeToggleBtnMobile = document.getElementById('theme-toggle-btn-mobile');
    const themeIcon = themeToggleBtn.querySelector('i');
    const themeIconMobile = themeToggleBtnMobile.querySelector('i');
    
    // Função para definir tema escuro
    function setDarkTheme() {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        themeIconMobile.classList.remove('fa-moon');
        themeIconMobile.classList.add('fa-sun');
        
        // Atualizar classes dos botões para o tema escuro
        document.querySelectorAll('.btn').forEach(btn => {
            if (btn.classList.contains('btn-primary') || 
                btn.classList.contains('btn-success') || 
                btn.classList.contains('btn-info')) {
                btn.style.color = '#fff';
            }
        });
    }
    
    // Função para definir tema claro
    function setLightTheme() {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        themeIconMobile.classList.remove('fa-sun');
        themeIconMobile.classList.add('fa-moon');
        
        // Resetar estilos dos botões para o tema claro
        document.querySelectorAll('.btn').forEach(btn => {
            if (btn.classList.contains('btn-primary') || 
                btn.classList.contains('btn-success') || 
                btn.classList.contains('btn-info')) {
                btn.style.color = '#fff';
            }
        });
    }
    
    // Verificar se há preferência de tema salva
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        setDarkTheme();
    } else {
        setLightTheme();
    }
    
    // Alternar entre temas claro e escuro
    function toggleTheme() {
        if (document.body.getAttribute('data-theme') === 'dark') {
            setLightTheme();
        } else {
            setDarkTheme();
        }
        
        // Disparar evento personalizado para notificar outras páginas sobre a mudança de tema
        const themeChangeEvent = new CustomEvent('themeChange', {
            detail: { theme: localStorage.getItem('theme') }
        });
        window.dispatchEvent(themeChangeEvent);
    }
    
    themeToggleBtn.addEventListener('click', toggleTheme);
    themeToggleBtnMobile.addEventListener('click', toggleTheme);
    
    // Toggle da sidebar
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    mobileToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
    });
    
    // Fechar sidebar ao clicar em um link (apenas em mobile)
    const sidebarLinks = document.querySelectorAll('.sidebar-menu a');
    
    sidebarLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                sidebar.classList.remove('active');
            }
        });
    });
    
    // Ajustar sidebar ao redimensionar a janela
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
        }
    });
});