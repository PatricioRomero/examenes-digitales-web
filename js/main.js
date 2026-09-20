// Scripts compartidos del sitio Exámenes Digitales
// (antes inline en cada página; ahora en archivo cacheable)

document.addEventListener('DOMContentLoaded', function () {
  // Inicializar iconos Lucide
  if (window.lucide) {
    window.lucide.createIcons();
  }

  // Menú móvil
  var toggle = document.getElementById('menu-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var menu = document.getElementById('mobile-menu');
      if (menu) menu.classList.toggle('hidden');
    });
  }
});

// Manejo del header al hacer scroll
window.addEventListener('scroll', function () {
  var header = document.getElementById('main-header');
  if (!header) return;
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
    header.classList.remove('bg-transparent');
  } else {
    header.classList.remove('scrolled');
    header.classList.add('bg-transparent');
  }
});

// Navegación suave dentro de la página (solo home)
function scrollToSection(id) {
  var element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
    var menu = document.getElementById('mobile-menu');
    if (menu) menu.classList.add('hidden');
  }
}

// Compatibilidad con llamadas antiguas
function toggleMenu() {
  var menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('hidden');
}
