/**
 * GETREC - Sistema de Gestão de Treinamentos Corporativos
 * Script para controle do tema claro/escuro
 */

document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    
    // Função para alternar entre temas
    function toggleTheme() {
        if (document.documentElement.getAttribute('data-theme') === 'dark') {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
            if (themeIcon) {
                themeIcon.className = 'fas fa-moon';
            }
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            if (themeIcon) {
                themeIcon.className = 'fas fa-sun';
            }
        }
    }
    
    // Inicializar tema com base na preferência salva
    function initTheme() {
        const savedTheme = localStorage.getItem('theme');
        
        if (savedTheme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
            if (themeIcon) {
                themeIcon.className = 'fas fa-sun';
            }
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            if (themeIcon) {
                themeIcon.className = 'fas fa-moon';
            }
        }
    }
    
    // Adicionar evento de clique ao botão de tema
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', toggleTheme);
    }
    
    // Inicializar tema
    initTheme();
});