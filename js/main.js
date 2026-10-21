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

// ---------------------------------------------------------------------------
// Formulario de solicitud (data-gform): envía a la hoja de respuestas del
// Google Form institucional sin salir del sitio, muestra confirmación y ofrece
// continuar por WhatsApp con el mensaje ya redactado.
// ---------------------------------------------------------------------------
document.addEventListener('DOMContentLoaded', function () {
  var form = document.querySelector('form[data-gform]');
  if (!form) return;

  var WA_NUMBER = '56930168791';
  var errorBox = document.getElementById('form-error');
  var okBox = document.getElementById('form-ok');
  var okWa = document.getElementById('form-ok-wa');
  var submitBtn = form.querySelector('button[type="submit"]');
  var submitLabel = submitBtn ? submitBtn.querySelector('[data-label]') : null;

  // Preselección por parámetro ?servicio= (enlaces desde páginas de servicio / anuncios)
  try {
    var params = new URLSearchParams(window.location.search);
    var tipo = params.get('tipo');
    var servicio = params.get('servicio');
    var select = form.querySelector('select');
    if (tipo && select) {
      for (var i = 0; i < select.options.length; i++) {
        if (select.options[i].text === tipo) { select.selectedIndex = i; break; }
      }
    }
    var detalle = form.querySelector('textarea');
    if (servicio && detalle && !detalle.value) {
      detalle.value = 'Servicio de interés: ' + servicio + '.\n';
    }
  } catch (e) { /* sin soporte de URLSearchParams: se ignora */ }

  function showError(msg) {
    if (!errorBox) return;
    errorBox.textContent = msg;
    errorBox.classList.remove('hidden');
  }

  function valueOf(selector) {
    var el = form.querySelector(selector);
    return el ? el.value.trim() : '';
  }

  function buildWhatsAppText() {
    var nombre = valueOf('#f-nombre');
    var inst = valueOf('#f-institucion');
    var tipo = valueOf('#f-tipo');
    var lugar = valueOf('#f-lugar');
    var det = valueOf('#f-detalle');
    var txt = 'Hola, soy ' + nombre + (inst ? ' de ' + inst : '') + '. Acabo de enviar una solicitud por el sitio web';
    if (tipo) txt += ' (' + tipo + ')';
    if (lugar) txt += ' para ' + lugar;
    txt += '.';
    if (det) txt += '\n\nDetalle: ' + det;
    return txt;
  }

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (errorBox) errorBox.classList.add('hidden');

    // Trampa anti-spam: si el campo oculto tiene contenido, no se envía.
    var trap = form.querySelector('input[name="website"]');
    if (trap && trap.value) return;

    if (!form.checkValidity()) {
      form.reportValidity();
      showError('Complete los campos obligatorios marcados con *.');
      return;
    }
    var checks = form.querySelectorAll('input[type="checkbox"]:checked');
    if (checks.length === 0) {
      showError('Indique al menos un medio de contacto.');
      return;
    }

    if (submitBtn) submitBtn.disabled = true;
    if (submitLabel) submitLabel.textContent = 'Enviando…';

    var data = new FormData(form);
    data.delete('website');
    // Campos que Google Forms espera además de las respuestas.
    data.append('fvv', '1');
    data.append('pageHistory', '0');

    var finish = function () {
      try {
        if (window.gtag) {
          window.gtag('event', 'generate_lead', { event_category: 'formulario', event_label: valueOf('#f-tipo') || 'solicitud' });
        }
      } catch (e) { /* analítica opcional */ }
      if (okWa) okWa.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(buildWhatsAppText());
      form.classList.add('hidden');
      if (okBox) {
        okBox.classList.remove('hidden');
        okBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      if (window.lucide) window.lucide.createIcons();
    };

    // Google Forms no devuelve CORS: el envío va en modo "no-cors" y se asume
    // recibido si la red no falla. Como respaldo se usa el envío clásico al iframe.
    if (window.fetch) {
      fetch(form.action, { method: 'POST', mode: 'no-cors', body: data })
        .then(finish)
        .catch(function () {
          try { form.submit(); finish(); } catch (e) {
            if (submitBtn) submitBtn.disabled = false;
            if (submitLabel) submitLabel.textContent = 'Enviar solicitud';
            showError('No pudimos enviar su solicitud. Escríbanos por WhatsApp al +56 9 3016 8791 o a contacto@examenesdigitales.cl.');
          }
        });
    } else {
      form.submit();
      finish();
    }
  });
});
