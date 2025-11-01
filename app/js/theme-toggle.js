/**
 * GETREC - Sistema de Gestão de Treinamentos Corporativos
 * Script para controle do tema claro/escuro
 */

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    
    // Atualiza o ícone conforme o tema atual
    function updateIconFromTheme() {
        if (!themeIcon) return;
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        themeIcon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
    }

    // Função para alternar entre temas
    function toggleTheme() {
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            updateIconFromTheme();
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            updateIconFromTheme();
        }

        // Notifica outras partes da aplicação sobre a mudança de tema
        const themeChangeEvent = new CustomEvent('themeChange', {
            detail: { theme: localStorage.getItem('theme') }
        });
        window.dispatchEvent(themeChangeEvent);
    }
    
    // Inicializar tema com base na preferência salva
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            updateIconFromTheme();
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            updateIconFromTheme();
        }
    }
    
    // Adicionar evento de clique ao botão de tema
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    // Sincroniza o tema se outra parte da aplicação disparar o evento
    window.addEventListener('themeChange', (e) => {
        const newTheme = e && e.detail && e.detail.theme;
        if (newTheme === 'dark' || newTheme === 'light') {
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
        }
        updateIconFromTheme();
    });

    // Inicializar tema
    initTheme();
});