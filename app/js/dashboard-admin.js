// Variáveis globais
let currentUser = null;
let usuarios = [];
let cursos = [];

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    loadUserData();
    loadDashboardData();
    setupEventListeners();
});

// Carregar dados do usuário
async function loadUserData() {
    try {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (userData) {
            document.getElementById('user-name').textContent = userData.nome;
            currentUser = userData;
        }
    } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
    }
}

// Carregar dados do dashboard
async function loadDashboardData() {
    try {
        await Promise.all([
            loadUsuarios(),
            loadCursos(),
            updateStatistics()
        ]);
    } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
    }
}

// Carregar usuários
async function loadUsuarios() {
    try {
        const response = await fetch('/api/usuarios');
        if (response.ok) {
            usuarios = await response.json();
            displayUsuarios();
            displayUsuariosRecentes();
        } else {
            console.error('Erro ao carregar usuários');
        }
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

// Carregar cursos
async function loadCursos() {
    try {
        const response = await fetch('/api/cursos');
        if (response.ok) {
            cursos = await response.json();
            displayCursos();
        } else {
            console.error('Erro ao carregar cursos');
        }
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
    }
}

// Atualizar estatísticas
function updateStatistics() {
    const totalUsuarios = usuarios.length;
    const totalAlunos = usuarios.filter(u => u.tipo === 'aluno').length;
    const totalInstrutores = usuarios.filter(u => u.tipo === 'instrutor').length;
    const totalCursos = cursos.length;
    
    document.getElementById('total-usuarios').textContent = totalUsuarios;
    document.getElementById('total-alunos').textContent = totalAlunos;
    document.getElementById('total-instrutores').textContent = totalInstrutores;
    document.getElementById('total-cursos').textContent = totalCursos;
}

// Exibir usuários
function displayUsuarios(usuariosFiltrados = usuarios) {
    const tbody = document.getElementById('tabela-usuarios');
    tbody.innerHTML = '';
    
    usuariosFiltrados.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${usuario.tipo}</td>
            <td><span class="status-badge status-active">Ativo</span></td>
            <td>
                <button class="btn-secondary" onclick="editUser(${usuario.id})" style="margin-right: 5px;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-danger" onclick="deleteUser(${usuario.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Exibir usuários recentes
function displayUsuariosRecentes() {
    const tbody = document.getElementById('usuarios-recentes');
    tbody.innerHTML = '';
    
    const usuariosRecentes = usuarios.slice(-5).reverse();
    
    usuariosRecentes.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.nome}</td>
            <td>${usuario.email}</td>
            <td>${usuario.tipo}</td>
            <td><span class="status-badge status-active">Ativo</span></td>
        `;
        tbody.appendChild(tr);
    });
}

// Exibir cursos
function displayCursos(cursosFiltrados = cursos) {
    const tbody = document.getElementById('tabela-cursos');
    tbody.innerHTML = '';
    
    cursosFiltrados.forEach(curso => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${curso.id}</td>
            <td>${curso.nome}</td>
            <td>${curso.categoria || 'N/A'}</td>
            <td>${curso.duracao || 'N/A'}h</td>
            <td>${curso.nivel || 'N/A'}</td>
            <td>
                <button class="btn-secondary" onclick="editCourse(${curso.id})" style="margin-right: 5px;">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="btn-danger" onclick="deleteCourse(${curso.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Menu de navegação
    document.querySelectorAll('.menu-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            if (section) {
                showSection(section);
                
                // Atualizar menu ativo
                document.querySelectorAll('.menu-link').forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });
    
    // Busca de usuários
    document.getElementById('search-usuarios').addEventListener('input', function() {
        const term = this.value.toLowerCase();
        const usuariosFiltrados = usuarios.filter(usuario => 
            usuario.nome.toLowerCase().includes(term) ||
            usuario.email.toLowerCase().includes(term) ||
            usuario.tipo.toLowerCase().includes(term)
        );
        displayUsuarios(usuariosFiltrados);
    });
    
    // Busca de cursos
    document.getElementById('search-cursos').addEventListener('input', function() {
        const term = this.value.toLowerCase();
        const cursosFiltrados = cursos.filter(curso => 
            curso.nome.toLowerCase().includes(term) ||
            (curso.categoria && curso.categoria.toLowerCase().includes(term)) ||
            (curso.nivel && curso.nivel.toLowerCase().includes(term))
        );
        displayCursos(cursosFiltrados);
    });
}

// Mostrar seção
function showSection(sectionName) {
    // Esconder todas as seções
    document.querySelectorAll('.content-section-container').forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar seção selecionada
    const section = document.getElementById(sectionName + '-section');
    if (section) {
        section.style.display = 'block';
    }
    
    // Atualizar título da página
    const titles = {
        'dashboard': 'Dashboard',
        'usuarios': 'Gerenciar Usuários',
        'cursos': 'Gerenciar Cursos',
        'relatorios': 'Relatórios',
        'configuracoes': 'Configurações'
    };
    
    document.getElementById('page-title').textContent = titles[sectionName] || 'Dashboard';
}

// Funções do modal de usuário
function openUserModal(userId = null) {
    const modal = document.getElementById('userModal');
    const title = document.getElementById('userModalTitle');
    const form = document.getElementById('userForm');
    
    form.reset();
    
    if (userId) {
        title.textContent = 'Editar Usuário';
        const usuario = usuarios.find(u => u.id === userId);
        if (usuario) {
            document.getElementById('userId').value = usuario.id;
            document.getElementById('userName').value = usuario.nome;
            document.getElementById('userEmail').value = usuario.email;
            document.getElementById('userTipo').value = usuario.tipo;
            document.getElementById('userPassword').required = false;
        }
    } else {
        title.textContent = 'Novo Usuário';
        document.getElementById('userPassword').required = true;
    }
    
    modal.style.display = 'block';
}

function closeUserModal() {
    document.getElementById('userModal').style.display = 'none';
}

async function saveUser() {
    const form = document.getElementById('userForm');
    const formData = new FormData(form);
    
    const userData = {
        nome: document.getElementById('userName').value,
        email: document.getElementById('userEmail').value,
        senha: document.getElementById('userPassword').value,
        tipo: document.getElementById('userTipo').value
    };
    
    const userId = document.getElementById('userId').value;
    
    try {
        let response;
        if (userId) {
            // Atualizar usuário existente
            response = await fetch(`/api/usuarios/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
        } else {
            // Criar novo usuário
            response = await fetch('/api/usuarios', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });
        }
        
        if (response.ok) {
            closeUserModal();
            await loadUsuarios();
            updateStatistics();
            alert('Usuário salvo com sucesso!');
        } else {
            const error = await response.text();
            alert('Erro ao salvar usuário: ' + error);
        }
    } catch (error) {
        console.error('Erro ao salvar usuário:', error);
        alert('Erro ao salvar usuário');
    }
}

function editUser(userId) {
    openUserModal(userId);
}

function deleteUser(userId) {
    const usuario = usuarios.find(u => u.id === userId);
    if (usuario) {
        showConfirmModal(
            `Tem certeza que deseja excluir o usuário "${usuario.nome}"?`,
            async () => {
                try {
                    const response = await fetch(`/api/usuarios/${userId}`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        await loadUsuarios();
                        updateStatistics();
                        alert('Usuário excluído com sucesso!');
                    } else {
                        alert('Erro ao excluir usuário');
                    }
                } catch (error) {
                    console.error('Erro ao excluir usuário:', error);
                    alert('Erro ao excluir usuário');
                }
            }
        );
    }
}

// Funções do modal de curso
function openCourseModal(courseId = null) {
    const modal = document.getElementById('courseModal');
    const title = document.getElementById('courseModalTitle');
    const form = document.getElementById('courseForm');
    
    form.reset();
    
    if (courseId) {
        title.textContent = 'Editar Curso';
        const curso = cursos.find(c => c.id === courseId);
        if (curso) {
            document.getElementById('courseId').value = curso.id;
            document.getElementById('courseName').value = curso.nome;
            document.getElementById('courseCategory').value = curso.categoria || '';
            document.getElementById('courseDuration').value = curso.duracao || '';
            document.getElementById('courseLevel').value = curso.nivel || '';
            document.getElementById('courseDescription').value = curso.descricao || '';
        }
    } else {
        title.textContent = 'Novo Curso';
    }
    
    modal.style.display = 'block';
}

function closeCourseModal() {
    document.getElementById('courseModal').style.display = 'none';
}

async function saveCourse() {
    const courseData = {
        nome: document.getElementById('courseName').value,
        categoria: document.getElementById('courseCategory').value,
        duracao: document.getElementById('courseDuration').value,
        nivel: document.getElementById('courseLevel').value,
        descricao: document.getElementById('courseDescription').value
    };
    
    const courseId = document.getElementById('courseId').value;
    
    try {
        let response;
        if (courseId) {
            // Atualizar curso existente
            response = await fetch(`/api/cursos/${courseId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(courseData)
            });
        } else {
            // Criar novo curso
            response = await fetch('/api/cursos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(courseData)
            });
        }
        
        if (response.ok) {
            closeCourseModal();
            await loadCursos();
            updateStatistics();
            alert('Curso salvo com sucesso!');
        } else {
            const error = await response.text();
            alert('Erro ao salvar curso: ' + error);
        }
    } catch (error) {
        console.error('Erro ao salvar curso:', error);
        alert('Erro ao salvar curso');
    }
}

function editCourse(courseId) {
    openCourseModal(courseId);
}

function deleteCourse(courseId) {
    const curso = cursos.find(c => c.id === courseId);
    if (curso) {
        showConfirmModal(
            `Tem certeza que deseja excluir o curso "${curso.nome}"?`,
            async () => {
                try {
                    const response = await fetch(`/api/cursos/${courseId}`, {
                        method: 'DELETE'
                    });
                    
                    if (response.ok) {
                        await loadCursos();
                        updateStatistics();
                        alert('Curso excluído com sucesso!');
                    } else {
                        alert('Erro ao excluir curso');
                    }
                } catch (error) {
                    console.error('Erro ao excluir curso:', error);
                    alert('Erro ao excluir curso');
                }
            }
        );
    }
}

// Modal de confirmação
function showConfirmModal(message, onConfirm) {
    document.getElementById('confirmMessage').textContent = message;
    document.getElementById('confirmButton').onclick = () => {
        closeConfirmModal();
        onConfirm();
    };
    document.getElementById('confirmModal').style.display = 'block';
}

function closeConfirmModal() {
    document.getElementById('confirmModal').style.display = 'none';
}

// Fechar modais ao clicar fora
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}