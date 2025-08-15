// menu-toggle.js
document.addEventListener('DOMContentLoaded', function() {
    // Seleccionar elementos del DOM
    const menuToggle = document.createElement('button');
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    const dropdownButtons = document.querySelectorAll('.dropdown button');
    
    // Crear botón de menú hamburguesa para móviles
    menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
    menuToggle.classList.add('menu-toggle');
    menuToggle.setAttribute('aria-label', 'Menú de navegación');
    nav.prepend(menuToggle);
    
    // Función para alternar el menú
    function toggleMenu() {
        navLinks.classList.toggle('active');
        const isExpanded = navLinks.classList.contains('active');
        menuToggle.setAttribute('aria-expanded', isExpanded);
        
        // Cambiar icono
        const icon = menuToggle.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    }
    
    // Evento para el botón de menú hamburguesa
    menuToggle.addEventListener('click', toggleMenu);
    
    // Manejar dropdowns en desktop
    dropdownButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                const dropdown = this.parentElement;
                const content = dropdown.querySelector('.dropdown-content');
                const isExpanded = this.getAttribute('aria-expanded') === 'true';
                
                this.setAttribute('aria-expanded', !isExpanded);
                content.style.display = isExpanded ? 'none' : 'block';
            }
        });
    });
    
    // Cerrar menú al hacer clic en un enlace (para móviles)
    navLinks.addEventListener('click', function(e) {
        if (e.target.tagName === 'A' && window.innerWidth <= 768) {
            toggleMenu();
        }
    });
    
    // Cerrar menú al hacer clic fuera
    document.addEventListener('click', function(e) {
        if (!nav.contains(e.target)) {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
    
    // Ajustar el menú al cambiar el tamaño de la ventana
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            const icon = menuToggle.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            
            // Resetear dropdowns
            document.querySelectorAll('.dropdown-content').forEach(content => {
                content.style.display = '';
            });
        }
    });
});