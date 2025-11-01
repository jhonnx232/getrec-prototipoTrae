document.addEventListener('DOMContentLoaded', function() {
    // Alternador de tema (claro/escuro)
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const themeIcon = themeToggleBtn ? themeToggleBtn.querySelector('i') : null;
    
    // Verificar se há preferência de tema salva
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }
    
    // Alternar entre temas claro e escuro
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', function() {
            if (document.body.getAttribute('data-theme') === 'dark') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'light');
                if (themeIcon) { themeIcon.classList.remove('fa-sun'); themeIcon.classList.add('fa-moon'); }
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if (themeIcon) { themeIcon.classList.remove('fa-moon'); themeIcon.classList.add('fa-sun'); }
            }
        });
    }
    
    // Menu mobile
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuToggle && navLinks) {
        mobileMenuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        });
    }
    
    // Fechar menu ao clicar em um link
    const navItems = document.querySelectorAll('.nav-links a');
    if (navItems && navLinks) {
        navItems.forEach(item => {
            item.addEventListener('click', function() {
                if (navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    document.body.classList.remove('menu-open');
                }
            });
        });
    }
    
    // Slider de depoimentos
    const testimonials = document.querySelectorAll('.testimonial');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentSlide = 0;
    
    if (testimonials.length && dots.length) {
        // Esconder todos os depoimentos exceto o primeiro
        function hideAllTestimonials() {
            testimonials.forEach(testimonial => {
                testimonial.style.display = 'none';
            });
            dots.forEach(dot => {
                dot.classList.remove('active');
            });
        }
        
        // Mostrar depoimento atual
        function showTestimonial(index) {
            hideAllTestimonials();
            testimonials[index].style.display = 'block';
            dots[index].classList.add('active');
        }
        
        // Inicializar slider
        hideAllTestimonials();
        showTestimonial(currentSlide);
        
        // Botão próximo
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                currentSlide++;
                if (currentSlide >= testimonials.length) {
                    currentSlide = 0;
                }
                showTestimonial(currentSlide);
            });
        }
        
        // Botão anterior
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                currentSlide--;
                if (currentSlide < 0) {
                    currentSlide = testimonials.length - 1;
                }
                showTestimonial(currentSlide);
            });
        }
        
        // Clicar nos dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', function() {
                currentSlide = index;
                showTestimonial(currentSlide);
            });
        });
    }
});