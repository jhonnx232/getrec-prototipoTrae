// Script para cadastrar curso no banco de dados
document.getElementById('course-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Coleta os dados do formulário com os nomes corretos do INSERT
    const formData = {
        titulo: document.getElementById('course-title').value,
        descricao: document.getElementById('course-description').value,
        instrutor: document.getElementById('course-instructor').value,
        categoria: document.getElementById('course-category').value,
        duracao: parseInt(document.getElementById('course-duration').value, 10),
        preco: parseFloat(document.getElementById('course-price').value),
        nivel: document.getElementById('course-level').value,
        imagem_url: document.getElementById('course-image-url').value
    };
    
    // Validação básica
    if (!formData.titulo || !formData.descricao || !formData.instrutor || !formData.categoria || isNaN(formData.duracao) || isNaN(formData.preco) || !formData.nivel ) {
        showMessage('Preencha todos os campos obrigatórios', 'error');
        return;
    }
    
    // Enviar para o servidor
    fetch('/api/cursos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erro ao cadastrar curso');
        }
        return response.json();
    })
    .then(data => {
        showMessage('Curso cadastrado com sucesso!', 'success');
        document.getElementById('course-form').reset();
        // Atualiza imediatamente o grid com todos os cursos do banco
        loadCursosFromDB();
    })
    .catch(error => {
        console.error('Erro:', error);
        showMessage('Erro ao cadastrar curso. Tente novamente.', 'error');
    });
});

// Função para exibir mensagens
function showMessage(message, type) {
    const messageElement = document.getElementById('form-message');
    messageElement.textContent = message;
    messageElement.className = 'mt-3 alert';
    
    if (type === 'success') {
        messageElement.classList.add('alert-success');
    } else if (type === 'error') {
        messageElement.classList.add('alert-danger');
    }
    
    messageElement.style.display = 'block';
    
    // Esconder a mensagem após 5 segundos
    setTimeout(() => {
        messageElement.style.display = 'none';
    }, 5000);
}

// Funções para carregar dados de cursos
async function carregarDadosCursos() {
    try {
        const response = await fetch('/api/cursos');
        if (!response.ok) {
            throw new Error('Erro ao carregar dados de cursos');
        }
        const dados = await response.json();
        const cursos = Array.isArray(dados) ? dados : (dados.cursos || []);
        return cursos;
    } catch (error) {
        console.error('Erro ao carregar cursos:', error);
        return [];
    }
}
 
// Função para atualizar a interface com os dados dos cursos
async function atualizarInterfaceCursos(cursos) {
    // Atualizar a tabela de cursos
    const tabelaCursos = document.querySelector('.courses-table tbody');
    if (tabelaCursos && cursos.length > 0) {
        // Limpar a tabela
        tabelaCursos.innerHTML = '';
        
        // Adicionar os cursos
        cursos.forEach(curso => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${curso.id}</td>
                <td>${curso.titulo}</td>
                <td>${curso.categoria}</td>
                <td>${curso.instrutor}</td>
                <td>${curso.numeroAlunos || 0}</td>
                <td><span class="status-badge ${curso.status === 'ativo' ? 'status-active' : 'status-inactive'}">${curso.status || 'ativo'}</span></td>
                <td>
                    <button class="action-btn"><i class="fas fa-edit"></i></button>
                    <button class="action-btn"><i class="fas fa-trash-alt"></i></button>
                </td>
            `;
            tabelaCursos.appendChild(row);
        });
    }
    
    // Atualizar estatísticas
   const lista = Array.isArray(cursos) ? cursos : [];
   const totalCursos = lista.length;
   const cursosAtivos = lista.filter(curso => curso.status === 'ativo').length;
   const totalAlunos = lista.reduce((total, curso) => total + (curso.numeroAlunos || 0), 0);
    
    const statsCursos = document.getElementById('stats-cursos');
    const statsCursosAtivos = document.getElementById('stats-cursos-ativos');
    const statsAlunos = document.getElementById('stats-alunos');
    
    if (statsCursos) statsCursos.textContent = totalCursos;
    if (statsCursosAtivos) statsCursosAtivos.textContent = cursosAtivos;
    if (statsAlunos) statsAlunos.textContent = totalAlunos;
}

// Renderizar todos os cursos no grid (RH)
function renderCursosGrid(cursos) {
    const grid = document.getElementById('courses-grid');
    if (!grid) return;
   grid.innerHTML = '';
    
   (Array.isArray(cursos) ? cursos : []).forEach(curso => {
        const precoFormatado = !curso.preco || Number(curso.preco) === 0 ? 'Gratuito' : `R$ ${Number(curso.preco).toFixed(2)}`;
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <div class="course-image">
                <img src="${curso.imagem_url || '../img/hero-image.svg'}" alt="${curso.titulo || 'Curso'}">
            </div>
            <div class="course-content">
                <span class="course-category">${curso.categoria || 'Categoria'}</span>
                <h3 class="course-title">${curso.titulo || curso.nome || 'Curso'}</h3>
                <div class="course-info">
                    <span><i class="fas fa-user-tie"></i> ${curso.instrutor || 'Instrutor'}</span>
                    <span><i class="fas fa-clock"></i> ${curso.duracao || 0} horas</span>
                </div>
                <div class="course-stats">
                    <div class="course-stat">
                        <span>${curso.numeroAlunos || 0}</span>
                        <span>Alunos</span>
                    </div>
                    <div class="course-stat">
                        <span>${curso.avaliacao || '4.5'}</span>
                        <span>Avaliação</span>
                    </div>
                    <div class="course-stat">
                        <span>${precoFormatado}</span>
                        <span>Preço</span>
                    </div>
                </div>
            </div>
            <div class="course-actions">
                <button class="btn-outline btn-edit">Editar</button>
                <button class="btn-delete">Excluir</button>
            </div>
        `;
        const btnEdit = card.querySelector('.btn-edit');
        if (btnEdit) btnEdit.addEventListener('click', () => openEditModal(curso));
        const btnDelete = card.querySelector('.btn-delete');
        if (btnDelete) btnDelete.addEventListener('click', () => handleDeleteCurso(curso.id));
        grid.appendChild(card);
    });
}

// Buscar cursos direto do banco e renderizar no grid
async function loadCursosFromDB() {
    try {
        const res = await fetch('/api/cursos');
        if (!res.ok) throw new Error('Falha ao carregar cursos');
        const cursos = await res.json();
        renderCursosGrid(cursos);
       // Também atualiza estatísticas e tabela se existirem
       atualizarInterfaceCursos(cursos);
    } catch (err) {
        console.error('Erro ao buscar cursos do banco:', err);
    }
}

// Suporte a edição e gerenciamento de cursos
let currentCursoId = null;

function openEditModal(curso) {
   currentCursoId = curso.id;
   const modal = document.getElementById('edit-curso-modal');
   if (!modal) return;
   const f = {
      titulo: document.getElementById('edit-titulo'),
      instrutor: document.getElementById('edit-instrutor'),
      descricao: document.getElementById('edit-descricao'),
      categoria: document.getElementById('edit-categoria'),
      duracao: document.getElementById('edit-duracao'),
      preco: document.getElementById('edit-preco'),
      nivel: document.getElementById('edit-nivel')
   };
   if (f.titulo) f.titulo.value = curso.titulo || '';
   if (f.instrutor) f.instrutor.value = curso.instrutor || '';
   if (f.descricao) f.descricao.value = curso.descricao || '';
   if (f.categoria) f.categoria.value = curso.categoria || '';
   if (f.duracao) f.duracao.value = curso.duracao || '';
   if (f.preco) f.preco.value = curso.preco != null ? curso.preco : '';
   if (f.nivel) f.nivel.value = curso.nivel || '';
   modal.style.display = 'flex';
}

function closeEditModal() {
   const modal = document.getElementById('edit-curso-modal');
   if (modal) modal.style.display = 'none';
   currentCursoId = null;
}

const closeBtn = document.getElementById('close-edit-modal');
if (closeBtn) closeBtn.addEventListener('click', closeEditModal);
const modalEl = document.getElementById('edit-curso-modal');
if (modalEl) modalEl.addEventListener('click', (e) => { if (e.target === modalEl) closeEditModal(); });

const editForm = document.getElementById('edit-curso-form');
if (editForm) editForm.addEventListener('submit', async (e) => {
   e.preventDefault();
   if (!currentCursoId) return;
   const titulo = document.getElementById('edit-titulo')?.value?.trim();
   const instrutor = document.getElementById('edit-instrutor')?.value?.trim();
   const descricao = document.getElementById('edit-descricao')?.value?.trim();
   const categoria = document.getElementById('edit-categoria')?.value?.trim();
   const duracao = document.getElementById('edit-duracao')?.value?.trim();
   const precoStr = document.getElementById('edit-preco')?.value;
   const nivel = document.getElementById('edit-nivel')?.value?.trim();
   const preco = precoStr !== '' && precoStr != null ? parseFloat(precoStr) : null;
   if (!titulo || !instrutor || !descricao || !categoria || !duracao || preco == null || !nivel) {
      showMessage('Preencha todos os campos obrigatórios.', 'error');
      return;
   }
   try {
      const res = await fetch(`/api/cursos/${currentCursoId}`, {
         method: 'PUT',
         headers: { 'Content-Type': 'application/json' },
         body: JSON.stringify({ titulo, descricao, instrutor, categoria, duracao, preco, nivel })
      });
      if (!res.ok) throw new Error('Falha ao atualizar curso');
      showMessage('Curso atualizado com sucesso!', 'success');
      closeEditModal();
      await loadCursosFromDB();
   } catch (err) {
      console.error('Erro ao atualizar curso:', err);
      showMessage('Erro ao atualizar curso.', 'error');
   }
});

async function handleDeleteCurso(id) {
   const confirmar = window.confirm('Deseja realmente excluir este curso? Esta ação não pode ser desfeita.');
   if (!confirmar) return;
   try {
      const res = await fetch(`/api/cursos/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Falha ao excluir curso');
      showMessage('Curso excluído com sucesso!', 'success');
      await loadCursosFromDB();
   } catch (err) {
      console.error('Erro ao excluir curso:', err);
      showMessage('Erro ao excluir curso.', 'error');
   }
}

// Inicializar dados ao carregar a página
async function inicializarDados() {
   await loadCursosFromDB();
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
    
    // Formulário de criação de curso
    const courseForm = document.getElementById('course-form');
    
    courseForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Simulação de criação de curso
        alert('Curso criado com sucesso!');
        courseForm.reset();
    });
});

// Carregar dados do banco quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    // Carregar cursos do banco de dados
    loadCursosFromDB();
        
        // Configurar busca de alunos
        const buscaInput = document.getElementById('busca-aluno');
        if (buscaInput) {
            buscaInput.addEventListener('input', function() {
                const termo = this.value.trim();
                if (termo.length > 2) {
                    buscarAlunos(termo);
                } else if (termo.length === 0) {
                    carregarAlunos();
                }
            });
        }
});

// Função para carregar todos os alunos
function carregarAlunos() {
    fetch('/api/alunos')
        .then(response => response.json())
        .then(alunos => {
            exibirAlunos(alunos);
        })
        .catch(error => {
            console.error('Erro ao carregar alunos:', error);
        });
}

// Função para buscar alunos por nome
function buscarAlunos(termo) {
    fetch(`/api/alunos/busca?termo=${encodeURIComponent(termo)}`)
        .then(response => response.json())
        .then(alunos => {
            exibirAlunos(alunos);
        })
        .catch(error => {
            console.error('Erro ao buscar alunos:', error);
        });
}

// Função para exibir alunos na tabela
function exibirAlunos(alunos) {
    const tabelaAlunos = document.getElementById('tabela-alunos');
    if (!tabelaAlunos) return;
    
    tabelaAlunos.innerHTML = '';
    
    if (alunos.length === 0) {
        tabelaAlunos.innerHTML = '<tr><td colspan="6" class="text-center">Nenhum aluno encontrado</td></tr>';
        return;
    }
    
    alunos.forEach(aluno => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${aluno.nome}</td>
            <td>${aluno.email}</td>
            <td>${aluno.empresa || 'N/A'}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress" style="width: ${Math.floor(Math.random() * 100)}%"></div>
                </div>
            </td>
            <td><span class="status-badge ${Math.random() > 0.5 ? 'active' : 'inactive'}">${Math.random() > 0.5 ? 'Ativo' : 'Inativo'}</span></td>
            <td>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="verDetalhesAluno(${aluno.id})">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn-icon" onclick="editarAluno(${aluno.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                </div>
            </td>
        `;
        tabelaAlunos.appendChild(tr);
    });
}

// Funções para ações de alunos
function verDetalhesAluno(id) {
    alert(`Ver detalhes do aluno ID: ${id}`);
    // Implementar visualização de detalhes
}

function editarAluno(id) {
    alert(`Editar aluno ID: ${id}`);
    // Implementar edição de aluno
}