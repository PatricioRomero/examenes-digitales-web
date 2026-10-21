/**
 * Generador de páginas del sitio Exámenes Digitales (Fase 2 SEO)
 * - Reutiliza un header/footer/head compartidos
 * - Reescribe index.html para usar rutas absolutas y los archivos compartidos
 * - Genera páginas de servicio, blog y sitemap.xml
 *
 * Uso:  node src/build-pages.mjs
 */
import fs from 'fs';
import path from 'path';

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1')), '..');
const SITE = 'https://examenesdigitales.cl';
const WA = 'https://wa.me/56930168791';
const WA2 = 'https://wa.me/56999187629';
const PHONE = '+56 9 3016 8791';
const PHONE_TEL = '+56930168791';
const PHONE2 = '+56 9 9918 7629';
const PHONE2_TEL = '+56999187629';
const EMAIL = 'contacto@examenesdigitales.cl';
// Página interna con el formulario de solicitud (reemplaza el enlace externo a Google Forms).
const FORM = '/cotizar/';
// Destino real de los envíos: la hoja de respuestas del Google Form institucional.
const GFORM_ACTION = 'https://docs.google.com/forms/d/e/1FAIpQLSexdXe010Pha5HG_CNOSR-qAVQ6-9O0zK7nyl-LHSAeJ5K3dA/formResponse';
const GFORM = {
  nombre: 'entry.1960090839',
  institucion: 'entry.1299281272',
  correo: 'entry.124684158',
  telefono: 'entry.1864935225',
  tipo: 'entry.580446858',
  lugar: 'entry.2055907999',
  detalle: 'entry.804339692',
  preferencia: 'entry.1022401746',
};
const TIPOS = ['Solicitar cotización', 'Convenio institucional', 'Operativo de salud para empresa', 'Licitación pública', 'Reunión comercial', 'Consulta general'];

const waLink = (txt = 'Hola, quisiera solicitar información sobre los servicios institucionales de Exámenes Digitales.') =>
  `${WA}?text=${encodeURIComponent(txt)}`;

/* --- Analítica y verificación de buscadores --- */
// ID de Google Analytics 4 que ya usaba el sitio publicado en Friki.
const GA_ID = 'G-FMB7QC3734';
// Token de verificación de Google Search Console (se completa al darlo de alta).
const GSC_VERIFICATION = '';

const gaSnippet = `
    <!-- Google tag (gtag.js) -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${GA_ID}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_ID}');
    </script>`;

const gscMeta = GSC_VERIFICATION
  ? `\n    <meta name="google-site-verification" content="${GSC_VERIFICATION}">`
  : '';

const headExtras = gaSnippet + gscMeta;

/* ----------------------------- HEAD ----------------------------- */
function head({ title, description, canonical, jsonld }) {
  return `<!DOCTYPE html>
<html lang="es">
<head>${headExtras}
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <meta name="description" content="${description}">
    <link rel="canonical" href="${canonical}">
    <meta name="robots" content="index, follow">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">

    <!-- Open Graph / WhatsApp / Redes -->
    <meta property="og:type" content="website">
    <meta property="og:url" content="${canonical}">
    <meta property="og:site_name" content="Exámenes Digitales">
    <meta property="og:title" content="${title}">
    <meta property="og:description" content="${description}">
    <meta property="og:image" content="${SITE}/assets/img/og-image.jpg">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:locale" content="es_CL">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${title}">
    <meta name="twitter:description" content="${description}">
    <meta name="twitter:image" content="${SITE}/assets/img/og-image.jpg">
    <meta name="theme-color" content="#0c73ba" />

    <link rel="stylesheet" href="/css/styles.css">
    <script defer src="https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js"></script>

    <script type="application/ld+json">
${jsonld}
    </script>
</head>
<body class="font-sans text-[#4B5563] antialiased bg-[#F8FAFC] selection:bg-[#55c5e9] selection:text-white overflow-x-hidden">

    <!-- Botón Flotante WhatsApp -->
    <a href="${waLink()}" target="_blank" rel="noopener noreferrer"
       class="fixed bottom-6 right-6 z-50 bg-[#25D366] text-white p-4 rounded-full shadow-[0_10px_30px_rgba(37,211,102,0.4)] hover:scale-110 transition-all duration-300 flex items-center justify-center group">
        <i data-lucide="message-circle" class="w-8 h-8 animate-pulse"></i>
        <span class="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs group-hover:ml-3 transition-all duration-500 ease-in-out font-bold">Asesoría Inmediata</span>
    </a>
`;
}

/* ---------------------------- HEADER ---------------------------- */
const NAV = [
  ['Quiénes Somos', '/#nosotros'],
  ['Servicios', '/#servicios'],
  ['Mamografía Móvil', '/mamografia-movil/'],
  ['Exámenes GES', '/examenes-ges/'],
  ['Institucional', '/convenios-institucionales/'],
  ['Blog', '/blog/'],
];

function header() {
  return `
    <!-- Header & Navegación -->
    <header id="main-header" class="fixed w-full top-0 z-40 bg-transparent">
        <div class="container mx-auto px-4 md:px-8 flex justify-between items-center">
            <a href="/" class="flex items-center gap-3 cursor-pointer group">
                <div class="relative w-12 h-12 flex items-center justify-center transition-transform duration-500 group-hover:rotate-180">
                    <div class="absolute inset-0 border-[4px] border-[#55c5e9] rounded-full border-r-transparent rotate-45"></div>
                    <div class="absolute inset-2 border-[4px] border-[#0c73ba] rounded-full border-r-transparent rotate-45"></div>
                    <div class="w-4 h-2 bg-[#a52216] rounded-full absolute right-1 top-1/2 -translate-y-1/2 flex justify-center">
                        <div class="w-1.5 h-1.5 bg-white rounded-full -mt-1.5"></div>
                    </div>
                </div>
                <div class="flex flex-col">
                    <span class="nav-text font-black text-2xl tracking-tight uppercase transition-colors">Exámenes <span class="text-[#55c5e9]">Digitales</span></span>
                    <span class="nav-subtext text-[10px] tracking-[0.2em] font-bold uppercase mt-[-4px] transition-colors">Estamos donde nos necesite</span>
                </div>
            </a>

            <!-- Nav Desktop -->
            <nav class="hidden lg:flex items-center gap-6 font-semibold nav-text transition-colors text-sm">
${NAV.map(([t, h]) => `                <a href="${h}" class="hover:text-[#55c5e9] transition-colors nav-link-hover">${t}</a>`).join('\n')}
                <a href="/#contacto" class="bg-gradient-to-r from-[#0c73ba] to-[#1E5F74] !text-white px-6 py-2.5 rounded-full hover:shadow-[0_0_20px_rgba(12,115,186,0.5)] transition-all hover:-translate-y-1">Cotizar Proyecto</a>
            </nav>

            <!-- Botón Mobile -->
            <button id="menu-toggle" class="lg:hidden nav-text transition-colors" aria-label="Abrir menú">
                <i data-lucide="menu" class="w-8 h-8"></i>
            </button>
        </div>

        <!-- Menu Mobile Desplegable -->
        <div id="mobile-menu" class="hidden lg:hidden absolute top-full left-0 w-full glass-effect shadow-2xl py-6 px-8 flex flex-col gap-5 animate-fade-in-up">
${NAV.map(([t, h]) => `            <a href="${h}" class="text-left text-[#163A5F] font-bold text-lg border-b border-gray-200 pb-2">${t}</a>`).join('\n')}
            <a href="/#contacto" class="bg-[#163A5F] text-white px-6 py-4 rounded-xl font-bold text-center text-lg mt-3 shadow-lg">Contactar a Comercial</a>
        </div>
    </header>
`;
}

/* ---------------------------- FOOTER ---------------------------- */
function footer() {
  return `
    <!-- Footer Premium -->
    <footer class="bg-[#0a1c32] text-gray-400 pt-20 pb-10 border-t border-gray-800">
        <div class="container mx-auto px-4 md:px-8">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
                <div class="col-span-1 lg:col-span-2 pr-0 lg:pr-12">
                    <div class="flex items-center gap-3 mb-6">
                        <div class="relative w-10 h-10 flex items-center justify-center">
                            <div class="absolute inset-0 border-[3px] border-[#55c5e9] rounded-full border-r-transparent rotate-45"></div>
                            <div class="absolute inset-1.5 border-[3px] border-[#0c73ba] rounded-full border-r-transparent rotate-45"></div>
                        </div>
                        <span class="text-white font-black text-2xl tracking-wide uppercase">Exámenes <span class="text-[#55c5e9]">Digitales</span></span>
                    </div>
                    <p class="text-sm mb-8 leading-relaxed text-gray-400 font-light max-w-md">
                        Empresa chilena dedicada a la prestación de servicios integrales de diagnóstico por imágenes en terreno. Apoyamos la salud pública y privada resolviendo listas de espera con excelencia técnica y humana, donde el sistema lo necesita.
                    </p>
                    <div class="flex gap-4">
                        <a href="${waLink()}" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp" class="bg-white/5 p-3 rounded-full hover:bg-[#25D366] hover:text-white transition-all border border-white/10"><i data-lucide="message-circle" class="w-5 h-5"></i></a>
                        <a href="mailto:${EMAIL}" aria-label="Correo" class="bg-white/5 p-3 rounded-full hover:bg-[#0c73ba] hover:text-white transition-all border border-white/10"><i data-lucide="mail" class="w-5 h-5"></i></a>
                        <a href="tel:${PHONE_TEL}" aria-label="Teléfono" class="bg-white/5 p-3 rounded-full hover:bg-[#0c73ba] hover:text-white transition-all border border-white/10"><i data-lucide="phone" class="w-5 h-5"></i></a>
                        <a href="https://www.facebook.com/examenesdigitales" target="_blank" rel="noopener noreferrer" aria-label="Facebook" class="bg-white/5 p-3 rounded-full hover:bg-[#0c73ba] hover:text-white transition-all border border-white/10"><i data-lucide="facebook" class="w-5 h-5"></i></a>
                    </div>
                </div>

                <div>
                    <h4 class="text-white font-black mb-6 uppercase text-sm tracking-widest">Servicios</h4>
                    <ul class="space-y-4 text-sm font-medium">
                        <li><a href="/mamografia-movil/" class="hover:text-[#55c5e9] transition-colors flex items-center gap-2"><i data-lucide="chevron-right" class="w-4 h-4"></i> Mamografía Móvil</a></li>
                        <li><a href="/ecografia-en-terreno/" class="hover:text-[#55c5e9] transition-colors flex items-center gap-2"><i data-lucide="chevron-right" class="w-4 h-4"></i> Ecografía en Terreno</a></li>
                        <li><a href="/examenes-ges/" class="hover:text-[#55c5e9] transition-colors flex items-center gap-2"><i data-lucide="chevron-right" class="w-4 h-4"></i> Cumplimiento GES</a></li>
                        <li><a href="/convenios-institucionales/" class="hover:text-[#55c5e9] transition-colors flex items-center gap-2"><i data-lucide="chevron-right" class="w-4 h-4"></i> Convenios Institucionales</a></li>
                        <li><a href="/experiencia/" class="hover:text-[#55c5e9] transition-colors flex items-center gap-2"><i data-lucide="chevron-right" class="w-4 h-4"></i> Experiencia y Respaldo</a></li>
                    </ul>
                </div>

                <div>
                    <h4 class="text-white font-black mb-6 uppercase text-sm tracking-widest">Contacto</h4>
                    <ul class="space-y-4 text-sm font-medium">
                        <li><a href="tel:${PHONE_TEL}" class="hover:text-[#55c5e9] transition-colors flex items-center gap-2"><i data-lucide="phone" class="w-4 h-4"></i> ${PHONE}</a></li>
                        <li><a href="${WA2}" target="_blank" rel="noopener noreferrer" class="hover:text-[#55c5e9] transition-colors flex items-center gap-2"><i data-lucide="message-circle" class="w-4 h-4"></i> ${PHONE2} (WhatsApp)</a></li>
                        <li><a href="mailto:${EMAIL}" class="hover:text-[#55c5e9] transition-colors flex items-center gap-2"><i data-lucide="mail" class="w-4 h-4"></i> ${EMAIL}</a></li>
                        <li><a href="${FORM}" class="hover:text-[#55c5e9] transition-colors flex items-center gap-2"><i data-lucide="file-text" class="w-4 h-4"></i> Solicitar cotización</a></li>
                        <li><a href="/blog/" class="hover:text-[#55c5e9] transition-colors flex items-center gap-2"><i data-lucide="newspaper" class="w-4 h-4"></i> Blog y Noticias</a></li>
                        <li><span class="flex items-center gap-2"><i data-lucide="map-pin" class="w-4 h-4"></i> Lampa, Región Metropolitana · Cobertura nacional</span></li>
                    </ul>
                </div>
            </div>

            <div class="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-gray-500">
                <p>© 2026 Exámenes Digitales S.P.A. Todos los derechos reservados.</p>
                <div class="flex gap-6">
                    <span class="flex items-center gap-1"><i data-lucide="shield-check" class="w-4 h-4 text-[#4F8A6B]"></i> Autorización Seremi de Salud</span>
                    <span class="flex items-center gap-1"><i data-lucide="award" class="w-4 h-4 text-[#a52216]"></i> Sello Empresa Mujer</span>
                </div>
            </div>
        </div>
    </footer>

    <script src="/js/main.js" defer></script>
</body>
</html>
`;
}

/* ------------------------- Piezas de contenido ------------------------- */
const ctaBand = (titulo, texto, boton = 'Cotizar Proyecto') => `
    <section class="py-20 bg-[#0f2a4a] text-white">
        <div class="container mx-auto px-4 md:px-8">
            <div class="bg-[#163A5F] rounded-3xl p-10 md:p-14 shadow-2xl relative overflow-hidden border border-[#55c5e9]/20">
                <div class="absolute -top-20 -right-20 w-60 h-60 bg-[#1E5F74] rounded-full opacity-50 blur-2xl"></div>
                <div class="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                    <div class="lg:w-2/3">
                        <h2 class="text-3xl md:text-4xl font-black mb-4">${titulo}</h2>
                        <p class="text-blue-100 text-lg font-light">${texto}</p>
                    </div>
                    <div class="flex flex-col gap-4 w-full lg:w-auto">
                        <a href="${FORM}" class="bg-[#55c5e9] text-[#163A5F] py-4 px-8 rounded-xl font-black text-lg hover:bg-white transition-all text-center shadow-lg flex items-center justify-center gap-2">${boton} <i data-lucide="chevron-right" class="w-5 h-5"></i></a>
                        <a href="${waLink()}" target="_blank" rel="noopener noreferrer" class="bg-transparent border-2 border-[#55c5e9] text-white py-4 px-8 rounded-xl font-bold hover:bg-[#55c5e9]/10 transition-colors flex items-center justify-center gap-2"><i data-lucide="message-circle" class="w-5 h-5"></i> Conversar vía WhatsApp</a>
                    </div>
                </div>
            </div>
        </div>
    </section>`;

const hero = ({ badge, h1, lead, breadcrumb }) => `
    <section class="relative pt-40 pb-24 bg-[#0f2a4a] text-white overflow-hidden">
        <div class="absolute inset-0 z-0">
            <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#1E5F74] blur-[120px] opacity-60"></div>
            <div class="absolute bottom-[10%] -right-[10%] w-[40%] h-[60%] rounded-full bg-[#0c73ba] blur-[120px] opacity-40"></div>
        </div>
        <div class="container mx-auto px-4 md:px-8 relative z-10">
            <nav aria-label="Ruta de navegación" class="mb-8 text-xs text-blue-200 font-medium">
${breadcrumb.map((b, i) => `                ${i > 0 ? '<span class="mx-2 opacity-50">/</span>' : ''}${b[1] ? `<a href="${b[1]}" class="hover:text-[#55c5e9]">${b[0]}</a>` : `<span class="text-[#55c5e9]">${b[0]}</span>`}`).join('\n')}
            </nav>
            ${badge ? `<div class="inline-flex items-center gap-2 bg-[#ffffff15] border border-white/20 text-[#55c5e9] px-5 py-2 rounded-full text-sm font-bold mb-6 tracking-widest uppercase backdrop-blur-md"><i data-lucide="activity" class="w-4 h-4"></i> ${badge}</div>` : ''}
            <h1 class="text-4xl md:text-6xl font-black mb-6 leading-tight max-w-4xl">${h1}</h1>
            <p class="text-xl text-blue-100 font-light leading-relaxed max-w-3xl">${lead}</p>
            <div class="flex flex-col sm:flex-row gap-4 mt-10">
                <a href="${FORM}" class="bg-[#55c5e9] text-[#163A5F] px-8 py-4 rounded-full font-black hover:bg-white transition-all text-center shadow-lg">Solicitar Cotización</a>
                <a href="${waLink()}" target="_blank" rel="noopener noreferrer" class="border-2 border-[#55c5e9] text-white px-8 py-4 rounded-full font-bold hover:bg-[#55c5e9]/10 transition-colors text-center">Asesoría Inmediata</a>
            </div>
        </div>
    </section>`;

const faqSection = (faqs) => `
    <section class="py-24 bg-[#EAF3F8] border-y border-gray-200">
        <div class="container mx-auto px-4 md:px-8 max-w-4xl">
            <h2 class="text-3xl md:text-5xl font-black text-[#163A5F] mb-12 text-center">Preguntas frecuentes</h2>
            <div class="space-y-6">
${faqs.map(([q, a]) => `                <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                    <h3 class="text-xl font-bold text-[#163A5F] mb-3">${q}</h3>
                    <p class="text-gray-600 leading-relaxed">${a}</p>
                </div>`).join('\n')}
            </div>
        </div>
    </section>`;

const featureGrid = (items, cols = 3) => `
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-8">
${items.map(([icon, t, d]) => `                <div class="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-xl transition-shadow">
                    <div class="bg-[#EAF3F8] w-14 h-14 rounded-xl flex items-center justify-center mb-5"><i data-lucide="${icon}" class="w-7 h-7 text-[#0c73ba]"></i></div>
                    <h3 class="text-xl font-bold text-[#163A5F] mb-3">${t}</h3>
                    <p class="text-gray-600 text-sm leading-relaxed">${d}</p>
                </div>`).join('\n')}
            </div>`;

const bullets = (items) => `
            <ul class="space-y-4">
${items.map((i) => `                <li class="flex items-start gap-3"><i data-lucide="check-circle" class="w-5 h-5 text-[#4F8A6B] shrink-0 mt-0.5"></i><span class="text-gray-700">${i}</span></li>`).join('\n')}
            </ul>`;

const contentSection = (bg, inner) => `
    <section class="py-24 ${bg}">
        <div class="container mx-auto px-4 md:px-8">
${inner}
        </div>
    </section>`;

/* ------------------------------ JSON-LD ------------------------------ */
const bizRef = { '@id': `${SITE}/#business` };
const ldService = (name, description, path) => JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Service', name, description, serviceType: name, areaServed: 'Chile', provider: bizRef, url: `${SITE}${path}` },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name, item: `${SITE}${path}` },
    ] },
  ],
}, null, 2);

const ldServiceFaq = (name, description, path, faqs) => JSON.stringify({
  '@context': 'https://schema.org',
  '@graph': [
    { '@type': 'Service', name, description, serviceType: name, areaServed: 'Chile', provider: bizRef, url: `${SITE}${path}` },
    { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
    { '@type': 'BreadcrumbList', itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
      { '@type': 'ListItem', position: 2, name, item: `${SITE}${path}` },
    ] },
  ],
}, null, 2);

/* ------------------------------- PÁGINAS ------------------------------- */
const pages = [];

/* 1. Mamografía Móvil */
{
  const path_ = '/mamografia-movil/';
  const faqs = [
    ['¿Cuántos pacientes se requieren para realizar un operativo de mamografía móvil?', 'Para los operativos de salud en empresas e instituciones solicitamos un mínimo de 30 pacientes por operativo día, de modo de justificar el desplazamiento de la unidad y del equipo profesional.'],
    ['¿Dónde se instala la unidad móvil?', 'Definimos en conjunto con su institución el punto de estacionamiento que asegure acceso universal, comodidad y privacidad para las pacientes. La unidad se traslada con su propio equipamiento y recurso humano.'],
    ['¿Cómo se entregan los resultados?', 'Los exámenes son realizados por nuestro equipo y los resultados e informes imagenológicos se disponibilizan a través de nuestro sistema RIS-PACS y del portal de pacientes, agilizando la entrega.'],
    ['¿Qué tecnología utilizan?', 'Contamos con equipos digitales de última generación que entregan imágenes de alta resolución para diagnósticos tempranos precisos. La mamografía puede complementarse con Ecomamaria, especialmente útil en mamas densas.'],
  ];
  pages.push({
    out: `${path_}index.html`,
    head: {
      title: 'Mamografía Móvil para Municipalidades y Empresas | Exámenes Digitales',
      description: 'Unidad de mamografía móvil con tecnología digital de alta resolución para operativos en municipalidades, hospitales y empresas. Detección temprana del cáncer de mama en todo Chile.',
      canonical: `${SITE}${path_}`,
      jsonld: ldServiceFaq('Mamografía Móvil', 'Operativos de mamografía móvil en terreno para instituciones públicas y privadas en Chile.', path_, faqs),
    },
    body: hero({
      badge: 'Servicio destacado',
      h1: 'Mamografía Móvil:<br/><span class="text-[#55c5e9]">más cerca que nunca.</span>',
      lead: 'Llevamos la prevención del cáncer de mama a cada rincón de Chile. Eliminamos las barreras geográficas y de transporte, con un servicio cálido, empático y tecnología de estándar mundial.',
      breadcrumb: [['Inicio', '/'], ['Mamografía Móvil', null]],
    }) + contentSection('bg-white', `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div>
                    <span class="text-[#0c73ba] font-black tracking-widest uppercase text-sm mb-3 block">Tecnología</span>
                    <h2 class="text-3xl md:text-4xl font-black text-[#163A5F] mb-6">Equipamiento de vanguardia en terreno</h2>
                    <p class="text-gray-600 leading-relaxed mb-8">Nuestras unidades móviles permiten realizar mamografías digitales sin que la paciente deba trasladarse a un centro de imagenología. Esto reduce las listas de espera y facilita la adherencia a los programas de detección temprana.</p>
${bullets([
  '<strong>Equipos digitales de última generación:</strong> imágenes de alta resolución para diagnósticos tempranos precisos.',
  '<strong>Complemento con Ecomamaria:</strong> alternativa para mamas densas, que aumenta la tasa de detección en el mismo operativo.',
  '<strong>Personal acreditado:</strong> tecnólogos médicos y profesionales de la salud con experiencia en operativos en terreno.',
  '<strong>Informe imagenológico:</strong> resultados disponibilizados mediante nuestro portal RIS-PACS.',
])}
                </div>
                <div class="bg-[#F8FAFC] rounded-3xl p-10 border border-gray-100 shadow-sm">
                    <h3 class="text-2xl font-black text-[#163A5F] mb-8">¿Cómo funciona? <span class="text-[#0c73ba]">Tan sencillo como 1, 2, 3</span></h3>
                    <div class="relative border-l-2 border-[#55c5e9] ml-4 space-y-10 pb-2">
                        <div class="relative pl-10"><div class="absolute -left-5 top-0 w-10 h-10 bg-[#163A5F] text-white rounded-full flex items-center justify-center font-black text-xl border-4 border-white shadow-sm">1</div><h4 class="text-lg font-bold text-[#163A5F] mb-2">Contacto y coordinación</h4><p class="text-gray-600 text-sm">Evaluamos las necesidades de su comuna, institución o empresa y diseñamos un operativo a la medida de su volumen de pacientes.</p></div>
                        <div class="relative pl-10"><div class="absolute -left-5 top-0 w-10 h-10 bg-[#163A5F] text-white rounded-full flex items-center justify-center font-black text-xl border-4 border-white shadow-sm">2</div><h4 class="text-lg font-bold text-[#163A5F] mb-2">Despliegue estratégico</h4><p class="text-gray-600 text-sm">Definimos el lugar ideal para instalar la unidad, asegurando acceso universal, comodidad y privacidad total.</p></div>
                        <div class="relative pl-10"><div class="absolute -left-5 top-0 w-10 h-10 bg-[#163A5F] text-white rounded-full flex items-center justify-center font-black text-xl border-4 border-white shadow-sm">3</div><h4 class="text-lg font-bold text-[#163A5F] mb-2">Detección y entrega rápida</h4><p class="text-gray-600 text-sm">Realizamos los exámenes y disponibilizamos los informes mediante nuestro portal RIS-PACS.</p></div>
                    </div>
                </div>
            </div>
`) + contentSection('bg-[#F8FAFC]', `
            <div class="text-center max-w-3xl mx-auto mb-14">
                <h2 class="text-3xl md:text-5xl font-black text-[#163A5F] mb-4">¿Para quién es este servicio?</h2>
                <p class="text-lg text-gray-500 font-light">Adaptamos el operativo al tipo de institución y a los plazos de su programa sanitario.</p>
            </div>
${featureGrid([
  ['building-2', 'Municipalidades y DISAM', 'Apoyamos los programas de exámenes preventivos y el cumplimiento de las metas sanitarias comunales.'],
  ['hospital', 'Hospitales y servicios de salud', 'Reforzamos la capacidad diagnóstica para reducir listas de espera en imagenología.'],
  ['briefcase', 'Empresas e instituciones', 'Operativos de salud preventiva en las dependencias de su organización, sin que los colaboradores se ausenten.'],
], 3)}
`) + faqSection(faqs) + ctaBand('Agende su unidad móvil', 'Coordinemos un operativo de mamografía móvil para su comuna, hospital o empresa.'),
  });
}

/* 2. Ecografía en terreno */
{
  const path_ = '/ecografia-en-terreno/';
  const faqs = [
    ['¿Cuál es la capacidad diaria de un operativo de ecografía?', 'Contamos con 4 equipos portátiles de ultrasonido y un equipo de 4 a 5 ecografistas, con capacidad de resolver 50 exámenes diarios por cada equipo en una jornada de 9 a 18 horas, con atenciones cada 15 minutos de forma continuada.'],
    ['¿Qué incluye el servicio?', 'Incluye ecógrafo portátil de última generación, ecografista e informe radiológico. En el caso de centros médicos, también facilitamos el acceso a nuestro sistema computacional web para agendar pacientes, recepcionar y entregar resultados, y nuestro convenio FONASA Nivel 2.'],
    ['¿Qué debe aportar el centro médico?', 'El centro médico aporta con la sala de exámenes, algunos insumos menores como toalla nova y sabanilla clínica, y los pacientes, los cuales no pueden ser menos de 5 diarios para justificar el movimiento de equipos y personal ecografista.'],
    ['¿Realizan ecografías asociadas a garantías GES?', 'Sí. Realizamos ecografías abdominales y mamarias que cuentan con tiempos asegurados por el GES, apoyando a las instituciones a cumplir con las metas exigidas por la autoridad.'],
  ];
  pages.push({
    out: `${path_}index.html`,
    head: {
      title: 'Ecografía en Terreno para Instituciones y Centros Médicos | Exámenes Digitales',
      description: 'Ecógrafos portátiles de última generación con ecografista e informe radiológico. Operativos de ecografía en terreno para municipalidades, hospitales, empresas y centros médicos en Chile.',
      canonical: `${SITE}${path_}`,
      jsonld: ldServiceFaq('Ecografía en Terreno', 'Operativos de ecografía en terreno con equipos portátiles, ecografista e informe radiológico para instituciones y centros médicos.', path_, faqs),
    },
    body: hero({
      badge: 'Diagnóstico por imágenes',
      h1: 'Ecografía en terreno<br/><span class="text-[#55c5e9]">con capacidad de reacción.</span>',
      lead: 'Llevamos ecógrafos portátiles de última generación, ecografista e informe radiológico a su institución, empresa o centro médico, con la capacidad operativa para cumplir los plazos comprometidos.',
      breadcrumb: [['Inicio', '/'], ['Ecografía en Terreno', null]],
    }) + contentSection('bg-white', `
            <div class="max-w-3xl mb-14">
                <span class="text-[#0c73ba] font-black tracking-widest uppercase text-sm mb-3 block">Capacidad operativa</span>
                <h2 class="text-3xl md:text-4xl font-black text-[#163A5F] mb-6">Recursos reales para cumplir el 100% de lo comprometido</h2>
                <p class="text-gray-600 leading-relaxed">Contamos con equipos portátiles de ultrasonido y un equipo de ecografistas que nos permite responder tanto a programas planificados como a requerimientos urgentes de instituciones que necesitan completar sus metas en plazos acotados.</p>
            </div>
${featureGrid([
  ['monitor', '4 equipos portátiles', 'Ecógrafos portátiles de última generación trasladables a terreno.'],
  ['users', '4 a 5 ecografistas', 'Equipo profesional acreditado para operativos continuados.'],
  ['activity', '50 exámenes diarios por equipo', 'En jornada de 9 a 18 horas, con atenciones cada 15 minutos.'],
], 3)}
`) + contentSection('bg-[#F8FAFC]', `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div>
                    <h2 class="text-3xl md:text-4xl font-black text-[#163A5F] mb-6">Modalidades de servicio</h2>
${bullets([
  '<strong>Operativos en terreno:</strong> para municipalidades, hospitales y servicios de salud que requieren resolver exámenes en terreno.',
  '<strong>Servicio a centros médicos:</strong> acudimos una o dos veces por semana a realizar ecografías, aportando equipo, ecografista e informe.',
  '<strong>Operativos de salud en empresas:</strong> exámenes preventivos en las dependencias de su organización.',
  '<strong>Ecografías GES:</strong> ecografías abdominales y mamarias con tiempos asegurados por la garantía.',
])}
                </div>
                <div>
                    <h2 class="text-3xl md:text-4xl font-black text-[#163A5F] mb-6">Entregables y sistema</h2>
${bullets([
  'Ecógrafo portátil de última generación.',
  'Ecografista a cargo del examen.',
  'Informe radiológico.',
  'Sistema computacional web para agendar pacientes, recepcionar y entregar resultados.',
  'Portal de pacientes para descarga de resultados.',
  'Convenio FONASA Nivel 2 para llegar a más pacientes.',
])}
                </div>
            </div>
`) + faqSection(faqs) + ctaBand('Coordine un operativo de ecografía', 'Cuéntenos cuántos exámenes necesita y en qué plazo, y le propondremos un plan de trabajo.'),
  });
}

/* 3. Exámenes GES */
{
  const path_ = '/examenes-ges/';
  const faqs = [
    ['¿Cómo aseguran el cumplimiento de las metas GES?', 'Manejamos la demanda de tal forma de terminar al 31 de diciembre con el 100% de las atenciones requeridas. Esto es posible con una buena coordinación entre nuestra empresa y el referente que proponga su institución, quien será nuestra contraparte durante el desarrollo de la licitación o convenio.'],
    ['¿Qué patologías y exámenes GES abordan?', 'Nos enfocamos en el diagnóstico por imágenes de patologías como cáncer de mama, cáncer de vesícula, neumonías adquiridas en la comunidad y detección de displasia de cadera en infantes, entre otras.'],
    ['¿Qué pasa si otra empresa no cumple la licitación?', 'Contamos con recursos para responder en plazos acotados. Históricamente hemos apoyado a instituciones cuyos proveedores no lograron cumplir al 100%, completando los exámenes faltantes.'],
    ['¿Trabajan mediante trato directo?', 'Sí. Elaboramos propuestas de trato directo utilizando las herramientas que proporciona la legislación vigente en compras públicas, de manera de asegurar el cumplimiento real de las metas sanitarias.'],
  ];
  pages.push({
    out: `${path_}index.html`,
    head: {
      title: 'Cumplimiento GES y Reducción de Listas de Espera | Exámenes Digitales',
      description: 'Apoyamos a municipalidades y hospitales a cumplir las Garantías Explícitas en Salud: ecografías abdominales y mamarias, cáncer de mama y vesícula, displasia de cadera y neumonías.',
      canonical: `${SITE}${path_}`,
      jsonld: ldServiceFaq('Cumplimiento GES', 'Apoyo a instituciones públicas en el cumplimiento de las Garantías Explícitas en Salud mediante diagnóstico por imágenes en terreno.', path_, faqs),
    },
    body: hero({
      badge: 'Garantías Explícitas en Salud',
      h1: 'Cumplimiento GES y<br/><span class="text-[#55c5e9]">reducción de listas de espera.</span>',
      lead: 'Más de una década ejecutando licitaciones públicas en todo Chile, apoyando a municipalidades y organismos de salud en el cumplimiento de sus metas sanitarias y programas de exámenes preventivos.',
      breadcrumb: [['Inicio', '/'], ['Exámenes GES', null]],
    }) + contentSection('bg-white', `
            <div class="max-w-3xl mb-14">
                <h2 class="text-3xl md:text-4xl font-black text-[#163A5F] mb-6">Metodología orientada a resultados</h2>
                <p class="text-gray-600 leading-relaxed">Conocemos las necesidades diagnósticas y los plazos que dispone cada institución para cumplir con sus programas. Diseñamos el operativo en conjunto con la contraparte técnica, definiendo fechas y cantidades de exámenes de forma que se cumplan las cantidades requeridas en los tiempos exigidos.</p>
            </div>
${featureGrid([
  ['target', 'Cumplimiento al 31 de diciembre', 'Planificamos la demanda para cerrar el año con el 100% de las atenciones comprometidas.'],
  ['calendar', 'Coordinación con su contraparte', 'Definimos en conjunto fechas y volúmenes según la disponibilidad de su institución.'],
  ['zap', 'Capacidad de reacción', 'Recursos disponibles para instituciones que necesitan completar metas en plazos acotados.'],
], 3)}
`) + contentSection('bg-[#F8FAFC]', `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div>
                    <h2 class="text-3xl md:text-4xl font-black text-[#163A5F] mb-6">Diagnóstico por imágenes en GES</h2>
                    <p class="text-gray-600 leading-relaxed mb-8">Nuestra labor se centra en el cumplimiento de las Garantías Explícitas en Salud y se enfoca específicamente en el diagnóstico por imágenes de patologías como:</p>
${bullets([
  'Cáncer de mama.',
  'Cáncer de vesícula.',
  'Neumonías adquiridas en la comunidad.',
  'Detección de displasia de cadera en infantes.',
])}
                </div>
                <div class="bg-[#163A5F] rounded-3xl p-10 text-white shadow-xl">
                    <h3 class="text-2xl font-black mb-6">¿Su institución necesita ampliar capacidad diagnóstica?</h2>
                    <p class="text-blue-100 mb-8 font-light">Contamos con todas las resoluciones y autorizaciones sanitarias requeridas. Analicemos juntos sus necesidades y requisitos.</p>
                    <a href="${FORM}" class="block w-full text-center bg-[#55c5e9] text-[#163A5F] font-black py-4 rounded-xl hover:bg-white transition-colors">Cotizar Proyecto</a>
                </div>
            </div>
`) + faqSection(faqs) + ctaBand('Su mejor socio diagnóstico', 'Conversemos sobre los plazos y metas de su programa sanitario.'),
  });
}

/* 4. Convenios institucionales */
{
  const path_ = '/convenios-institucionales/';
  const faqs = [
    ['¿Qué incluye un convenio con una empresa?', 'Realizamos operativos de salud preventiva en las dependencias de su organización, además de charlas de educación sanitaria y operativos para abordar problemas de salud específicos. Los operativos de salud requieren un mínimo de 30 pacientes por operativo día.'],
    ['¿Realizan ferias de salud masivas?', 'Sí. Las ferias de salud consideran la realización de un operativo de salud en forma masiva para todos los trabajadores que lo soliciten dentro de ese horario, con un mínimo de 100 personas.'],
    ['¿Qué necesita aportar un centro médico?', 'El centro médico aporta con la sala de exámenes, algunos insumos menores como toalla nova y sabanilla clínica, y los pacientes, los cuales no pueden ser menos de 5 diarios para justificar el movimiento de equipos y personal ecografista.'],
    ['¿Tienen convenio con FONASA?', 'Sí. Contamos con convenio FONASA Nivel 2, lo que permite llegar a una mayor cantidad de pacientes.'],
  ];
  pages.push({
    out: `${path_}index.html`,
    head: {
      title: 'Convenios Institucionales y Operativos de Salud | Exámenes Digitales',
      description: 'Convenios con organismos públicos y privados, centros médicos y empresas. Convenio FONASA Nivel 2, agendamiento web y portal de resultados para pacientes en todo Chile.',
      canonical: `${SITE}${path_}`,
      jsonld: ldServiceFaq('Convenios Institucionales', 'Convenios y operativos de salud para organismos públicos, privados, centros médicos y empresas en Chile.', path_, faqs),
    },
    body: hero({
      badge: 'Organismos públicos y privados',
      h1: 'Convenios institucionales<br/><span class="text-[#55c5e9]">a la medida de su organización.</span>',
      lead: 'Atendemos organismos públicos y privados, centros médicos y empresas. Nos desplazamos donde usted nos necesite, con un servicio profesional, ético y orientado al cumplimiento.',
      breadcrumb: [['Inicio', '/'], ['Convenios Institucionales', null]],
    }) + contentSection('bg-white', `
${featureGrid([
  ['landmark', 'Organismos públicos', 'Más de 10 años de experiencia brindando atención en terreno a través de plataformas como Mercado Público, sirviendo a centros de salud en todo el país, con foco en el cumplimiento de las Garantías Explícitas en Salud.'],
  ['briefcase', 'Organismos privados y empresas', 'Operativos de salud preventiva y educativa en terreno para trabajadores y sus familias, con el objetivo de detectar riesgos que puedan predisponer el desarrollo de enfermedades.'],
  ['stethoscope', 'Centros médicos', 'Servicio de ecografía para centros que quieren contar con este servicio una o dos veces por semana, aportando ecógrafo portátil, ecografista e informe radiológico.'],
], 3)}
`) + contentSection('bg-[#F8FAFC]', `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div>
                    <h2 class="text-3xl md:text-4xl font-black text-[#163A5F] mb-6">Información importante</h2>
                    <p class="text-gray-600 leading-relaxed mb-8">Para planificar correctamente un operativo, considere los siguientes mínimos:</p>
${bullets([
  '<strong>Operativos de salud:</strong> la empresa contratante debe disponer de un mínimo de 30 pacientes por operativo día.',
  '<strong>Ferias de salud:</strong> operativo masivo para todos los trabajadores que lo soliciten dentro del horario, con un mínimo de 100 personas.',
  '<strong>Centros médicos:</strong> mínimo de 5 pacientes diarios para justificar el movimiento de equipos y personal ecografista.',
])}
                </div>
                <div>
                    <h2 class="text-3xl md:text-4xl font-black text-[#163A5F] mb-6">Beneficios para su organización</h2>
${bullets([
  '<strong>Comodidad y accesibilidad:</strong> los servicios se realizan en sus dependencias, evitando desplazamientos y pérdida de horas laborales.',
  '<strong>Responsabilidad social:</strong> demuestra un compromiso tangible con el bienestar de sus trabajadores y la comunidad.',
  '<strong>Experiencia y tecnología:</strong> profesionales especializados y equipamiento de vanguardia, respaldados por más de 10 años de experiencia.',
  '<strong>Gestión integral:</strong> gestionamos las atenciones asegurando transparencia, eficacia y cumplimiento normativo.',
])}
                </div>
            </div>
`) + faqSection(faqs) + ctaBand('Armemos su convenio', 'Cuéntenos cuántas personas desea atender y le propondremos un operativo a la medida.'),
  });
}

/* 5. Experiencia */
{
  const path_ = '/experiencia/';
  const faqs = [
    ['¿Cuántos años de experiencia tienen?', 'Contamos con más de una década de experiencia comprobada realizando licitaciones públicas en todo Chile, apoyando a múltiples municipalidades y organismos de salud en sus programas de exámenes preventivos.'],
    ['¿Con qué tipo de instituciones trabajan?', 'Trabajamos con municipalidades y Direcciones de Salud Municipal, hospitales y servicios de salud, cajas de compensación, centros médicos y empresas privadas.'],
    ['¿Cuentan con autorizaciones sanitarias?', 'Sí. Contamos con todas las resoluciones y autorizaciones sanitarias requeridas, y disponemos de autorización de la Seremi de Salud.'],
  ];
  pages.push({
    out: `${path_}index.html`,
    head: {
      title: 'Experiencia y Respaldo Institucional | Exámenes Digitales',
      description: 'Más de 10 años ejecutando licitaciones públicas y operativos de diagnóstico por imágenes en todo Chile. Autorización Seremi de Salud y Sello Empresa Mujer.',
      canonical: `${SITE}${path_}`,
      jsonld: ldServiceFaq('Experiencia y Respaldo', 'Trayectoria de más de una década en licitaciones públicas y operativos de diagnóstico por imágenes en Chile.', path_, faqs),
    },
    body: hero({
      badge: 'Trayectoria',
      h1: 'Confianza demostrada<br/><span class="text-[#55c5e9]">en todo Chile.</span>',
      lead: 'Desde municipalidades y hospitales públicos hasta cajas de compensación y empresas privadas, respondemos donde el sistema necesita capacidad de reacción.',
      breadcrumb: [['Inicio', '/'], ['Experiencia', null]],
    }) + contentSection('bg-white', `
            <div class="max-w-3xl mb-14">
                <h2 class="text-3xl md:text-4xl font-black text-[#163A5F] mb-6">Una década resolviendo donde otros no llegan</h2>
                <p class="text-gray-600 leading-relaxed">Nuestra trayectoria nos avala como especialistas en diagnóstico por imagen y nos permite ofrecer un servicio de excelencia a cada organización con la que trabajamos. Nuestra meta es reducir rápidamente las listas de espera diagnósticas que presentan dificultades para ser cumplidas por los proveedores habituales.</p>
            </div>
${featureGrid([
  ['award', 'Más de 10 años', 'Experiencia comprobada en licitaciones públicas en todo Chile.'],
  ['landmark', 'Mercado Público', 'Participación y ejecución de licitaciones para centros de salud de todo el país.'],
  ['shield-check', 'Cumplimiento normativo', 'Todas las resoluciones y autorizaciones sanitarias requeridas.'],
], 3)}
`) + contentSection('bg-[#F8FAFC]', `
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
                <div>
                    <h2 class="text-3xl md:text-4xl font-black text-[#163A5F] mb-6">Con quién trabajamos</h2>
${bullets([
  'Municipalidades y Direcciones de Salud Municipal (DISAM).',
  'Hospitales y servicios de salud.',
  'Cajas de compensación.',
  'Centros médicos y clínicas.',
  'Empresas e instituciones privadas.',
])}
                </div>
                <div>
                    <h2 class="text-3xl md:text-4xl font-black text-[#163A5F] mb-6">Nuestro compromiso</h2>
                    <p class="text-gray-600 leading-relaxed mb-6">Nos preocupamos de que las instituciones no pierdan los recursos entregados por no lograr la atención de todos los pacientes comprometidos en sus programas. Cuando un proveedor no logra cumplir al 100%, hemos apoyado a las instituciones completando los exámenes faltantes.</p>
                    <p class="text-gray-600 leading-relaxed">Nos preocupamos de acompañar y orientar a nuestros clientes para convertirnos en su partner diagnóstico.</p>
                </div>
            </div>
`) + faqSection(faqs) + ctaBand('Conversemos sobre su próximo desafío', 'Analicemos juntos sus necesidades y requisitos para entregarle una solución rápida.'),
  });
}

/* 6. Blog (índice) */
{
  const path_ = '/blog/';
  pages.push({
    out: `${path_}index.html`,
    head: {
      title: 'Blog y Noticias | Exámenes Digitales',
      description: 'Artículos sobre diagnóstico por imágenes en terreno, mamografía móvil, cumplimiento GES y operativos de salud en Chile.',
      canonical: `${SITE}${path_}`,
      jsonld: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'Blog', name: 'Blog Exámenes Digitales', url: `${SITE}${path_}`, inLanguage: 'es-CL', publisher: bizRef },
          { '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}${path_}` },
          ] },
        ],
      }, null, 2),
    },
    body: hero({
      badge: 'Blog',
      h1: 'Blog y noticias',
      lead: 'Contenido sobre diagnóstico por imágenes en terreno, mamografía móvil, cumplimiento GES y gestión de operativos de salud en Chile.',
      breadcrumb: [['Inicio', '/'], ['Blog', null]],
    }) + contentSection('bg-white', `
${featureGrid([
  ['newspaper', '¿Cómo se realiza un operativo de mamografía móvil?', 'Paso a paso del proceso: coordinación, despliegue de la unidad, realización de exámenes y entrega de resultados. <br/><br/><a href="/blog/como-se-realiza-un-operativo-de-mamografia-movil/" class="text-[#0c73ba] font-bold hover:underline">Leer artículo →</a>'],
  ['file-text', 'Próximamente: cumplimiento de metas GES', 'Artículo en preparación sobre planificación de la demanda y cierre de año.'],
  ['calendar', 'Próximamente: operativos por comuna', 'Publicaremos el detalle de los operativos que realicemos en cada comuna.'],
], 3)}
`) + ctaBand('¿Necesita coordinar un operativo?', 'Escríbanos y le responderemos a la brevedad.'),
  });
}

/* 7. Artículo del blog */
{
  const path_ = '/blog/como-se-realiza-un-operativo-de-mamografia-movil/';
  const faqs = [
    ['¿Cuánto demora la coordinación de un operativo?', 'Depende del volumen de pacientes y de la disponibilidad de la unidad. El primer paso es contactarnos para evaluar las necesidades de su institución y diseñar el operativo.'],
    ['¿Qué necesita aportar la institución?', 'Principalmente el punto de instalación de la unidad y la convocatoria de las pacientes. Nuestra empresa lleva el equipamiento y el recurso humano acreditado.'],
  ];
  pages.push({
    out: `${path_}index.html`,
    head: {
      title: '¿Cómo se realiza un operativo de mamografía móvil? | Exámenes Digitales',
      description: 'Paso a paso de un operativo de mamografía móvil en terreno: coordinación, despliegue de la unidad, realización de exámenes y entrega de resultados.',
      canonical: `${SITE}${path_}`,
      jsonld: JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          { '@type': 'BlogPosting', headline: '¿Cómo se realiza un operativo de mamografía móvil?', description: 'Paso a paso de un operativo de mamografía móvil en terreno.', inLanguage: 'es-CL', mainEntityOfPage: `${SITE}${path_}`, author: { '@type': 'Organization', name: 'Exámenes Digitales SpA' }, publisher: bizRef },
          { '@type': 'FAQPage', mainEntity: faqs.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })) },
          { '@type': 'BreadcrumbList', itemListElement: [
            { '@type': 'ListItem', position: 1, name: 'Inicio', item: `${SITE}/` },
            { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog/` },
            { '@type': 'ListItem', position: 3, name: 'Operativo de mamografía móvil', item: `${SITE}${path_}` },
          ] },
        ],
      }, null, 2),
    },
    body: hero({
      badge: 'Blog',
      h1: '¿Cómo se realiza un operativo de mamografía móvil?',
      lead: 'Un operativo de mamografía móvil permite acercar el examen preventivo a comunas y organizaciones que no cuentan con acceso expedito a imagenología. Este es el proceso, paso a paso.',
      breadcrumb: [['Inicio', '/'], ['Blog', '/blog/'], ['Operativo de mamografía móvil', null]],
    }) + contentSection('bg-white', `
            <article class="max-w-3xl">
                <h2 class="text-3xl font-black text-[#163A5F] mb-4">1. Contacto y coordinación</h2>
                <p class="text-gray-600 leading-relaxed mb-10">La institución interesada —municipalidad, hospital, centro médico o empresa— nos contacta para evaluar sus necesidades y el volumen de pacientes a atender. En esta etapa se define el alcance del operativo a la medida de su programa.</p>

                <h2 class="text-3xl font-black text-[#163A5F] mb-4">2. Despliegue de la unidad</h2>
                <p class="text-gray-600 leading-relaxed mb-10">Se define en conjunto el lugar de instalación, buscando asegurar acceso universal, comodidad y privacidad para las pacientes. Nuestra unidad se traslada con su equipamiento y recurso humano acreditado.</p>

                <h2 class="text-3xl font-black text-[#163A5F] mb-4">3. Realización de los exámenes</h2>
                <p class="text-gray-600 leading-relaxed mb-10">El equipo profesional realiza las mamografías digitales en la unidad móvil. Contamos con equipos de última generación que entregan imágenes de alta resolución, y la mamografía puede complementarse con Ecomamaria, especialmente útil en mamas densas.</p>

                <h2 class="text-3xl font-black text-[#163A5F] mb-4">4. Entrega de resultados</h2>
                <p class="text-gray-600 leading-relaxed mb-10">Los resultados e informes imagenológicos se disponibilizan a través de nuestro sistema RIS-PACS y del portal de pacientes, agilizando la entrega y facilitando el seguimiento por parte de la institución.</p>

                <h2 class="text-3xl font-black text-[#163A5F] mb-4">¿Cuándo conviene un operativo móvil?</h2>
                <p class="text-gray-600 leading-relaxed">Cuando existe una población objetivo que no accede oportunamente al examen por barreras geográficas o de transporte, cuando se requiere reforzar la capacidad diagnóstica para cumplir metas sanitarias, o cuando una organización quiere ofrecer salud preventiva a sus colaboradores en sus propias dependencias.</p>
            </article>
`) + faqSection(faqs) + ctaBand('Coordine su operativo de mamografía móvil', 'Escríbanos y evaluemos juntos el mejor plan para su institución.'),
  });
}

/* ------------------------- Formulario de solicitud ------------------------- */
// Formulario nativo. Envía a la hoja de respuestas del Google Form institucional
// (mismo destino que el formulario anterior) sin sacar al usuario del sitio.
// El manejo del envío está en /js/main.js (data-gform).
const contactForm = ({ compact = false } = {}) => `
                    <form id="form-solicitud" class="space-y-5" method="POST" action="${GFORM_ACTION}" target="gform-sink" data-gform novalidate>
                        <div class="grid grid-cols-1 ${compact ? '' : 'md:grid-cols-2'} gap-5">
                            <div>
                                <label for="f-nombre" class="block text-sm font-bold text-[#163A5F] mb-1.5">Nombre del solicitante <span class="text-[#a52216]">*</span></label>
                                <input id="f-nombre" name="${GFORM.nombre}" type="text" required autocomplete="name" class="w-full rounded-xl border border-gray-300 bg-[#F8FAFC] px-4 py-3 text-[#163A5F] focus:outline-none focus:ring-2 focus:ring-[#55c5e9] focus:border-transparent">
                            </div>
                            <div>
                                <label for="f-institucion" class="block text-sm font-bold text-[#163A5F] mb-1.5">Institución / Empresa / Centro <span class="text-[#a52216]">*</span></label>
                                <input id="f-institucion" name="${GFORM.institucion}" type="text" required autocomplete="organization" class="w-full rounded-xl border border-gray-300 bg-[#F8FAFC] px-4 py-3 text-[#163A5F] focus:outline-none focus:ring-2 focus:ring-[#55c5e9] focus:border-transparent">
                            </div>
                            <div>
                                <label for="f-correo" class="block text-sm font-bold text-[#163A5F] mb-1.5">Correo electrónico <span class="text-[#a52216]">*</span></label>
                                <input id="f-correo" name="${GFORM.correo}" type="email" required autocomplete="email" inputmode="email" class="w-full rounded-xl border border-gray-300 bg-[#F8FAFC] px-4 py-3 text-[#163A5F] focus:outline-none focus:ring-2 focus:ring-[#55c5e9] focus:border-transparent">
                            </div>
                            <div>
                                <label for="f-telefono" class="block text-sm font-bold text-[#163A5F] mb-1.5">Teléfono / WhatsApp <span class="text-[#a52216]">*</span></label>
                                <input id="f-telefono" name="${GFORM.telefono}" type="tel" required autocomplete="tel" inputmode="tel" placeholder="+56 9 ..." class="w-full rounded-xl border border-gray-300 bg-[#F8FAFC] px-4 py-3 text-[#163A5F] focus:outline-none focus:ring-2 focus:ring-[#55c5e9] focus:border-transparent">
                            </div>
                            <div>
                                <label for="f-tipo" class="block text-sm font-bold text-[#163A5F] mb-1.5">Tipo de requerimiento <span class="text-[#a52216]">*</span></label>
                                <select id="f-tipo" name="${GFORM.tipo}" required class="w-full rounded-xl border border-gray-300 bg-[#F8FAFC] px-4 py-3 text-[#163A5F] focus:outline-none focus:ring-2 focus:ring-[#55c5e9] focus:border-transparent">
                                    <option value="" disabled selected>Seleccione…</option>
${TIPOS.map((t) => `                                    <option>${t}</option>`).join('\n')}
                                </select>
                            </div>
                            <div>
                                <label for="f-lugar" class="block text-sm font-bold text-[#163A5F] mb-1.5">Comuna / Ciudad / Región <span class="text-[#a52216]">*</span></label>
                                <input id="f-lugar" name="${GFORM.lugar}" type="text" required placeholder="Ej.: Illapel, Región de Coquimbo" class="w-full rounded-xl border border-gray-300 bg-[#F8FAFC] px-4 py-3 text-[#163A5F] focus:outline-none focus:ring-2 focus:ring-[#55c5e9] focus:border-transparent">
                            </div>
                        </div>
                        <div>
                            <label for="f-detalle" class="block text-sm font-bold text-[#163A5F] mb-1.5">Detalle de su requerimiento <span class="text-[#a52216]">*</span></label>
                            <textarea id="f-detalle" name="${GFORM.detalle}" rows="4" required placeholder="Exámenes requeridos, volumen estimado de pacientes, fechas tentativas y lugar de atención." class="w-full rounded-xl border border-gray-300 bg-[#F8FAFC] px-4 py-3 text-[#163A5F] focus:outline-none focus:ring-2 focus:ring-[#55c5e9] focus:border-transparent"></textarea>
                        </div>
                        <fieldset>
                            <legend class="block text-sm font-bold text-[#163A5F] mb-2">¿Cómo prefiere que lo contactemos? <span class="text-[#a52216]">*</span></legend>
                            <div class="flex flex-wrap gap-x-6 gap-y-2 text-[#163A5F]">
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="${GFORM.preferencia}" value="WhatsApp" checked class="w-4 h-4 accent-[#0c73ba]"> WhatsApp</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="${GFORM.preferencia}" value="Teléfono" class="w-4 h-4 accent-[#0c73ba]"> Teléfono</label>
                                <label class="inline-flex items-center gap-2 cursor-pointer"><input type="checkbox" name="${GFORM.preferencia}" value="Correo electrónico" class="w-4 h-4 accent-[#0c73ba]"> Correo electrónico</label>
                            </div>
                        </fieldset>
                        <!-- Campo trampa anti-spam (oculto a personas) -->
                        <div class="hidden" aria-hidden="true"><label>Sitio web<input type="text" name="website" tabindex="-1" autocomplete="off"></label></div>
                        <p id="form-error" class="hidden text-sm font-semibold text-[#a52216]" role="alert"></p>
                        <button type="submit" class="bg-[#0c73ba] text-white font-black text-lg py-4 px-10 rounded-xl hover:bg-[#163A5F] hover:shadow-[0_10px_20px_rgba(12,115,186,0.3)] hover:-translate-y-1 transition-all w-full flex items-center justify-center gap-2 text-center disabled:opacity-60 disabled:cursor-wait">
                            <span data-label>Enviar solicitud</span> <i data-lucide="send" class="w-5 h-5"></i>
                        </button>
                        <p class="text-xs text-gray-500 leading-relaxed">Sus datos se usan únicamente para responder esta solicitud. Respondemos en horario hábil, normalmente el mismo día.</p>
                    </form>
                    <iframe name="gform-sink" title="envío" class="hidden" tabindex="-1" aria-hidden="true"></iframe>
                    <div id="form-ok" class="hidden text-center py-10" role="status" aria-live="polite">
                        <div class="mx-auto w-20 h-20 rounded-full bg-[#4F8A6B]/10 flex items-center justify-center mb-6"><i data-lucide="check-circle-2" class="w-10 h-10 text-[#4F8A6B]"></i></div>
                        <h4 class="text-2xl font-black text-[#163A5F] mb-3">Solicitud recibida</h4>
                        <p class="text-gray-600 leading-relaxed mb-8 max-w-md mx-auto">Gracias. Nuestro equipo comercial revisará su requerimiento y se comunicará con usted a la brevedad. Si prefiere avanzar ahora mismo, continúe por WhatsApp con su solicitud ya redactada.</p>
                        <a id="form-ok-wa" href="${WA}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-black py-4 px-8 rounded-xl hover:brightness-110 transition-all shadow-lg"><i data-lucide="message-circle" class="w-5 h-5"></i> Continuar por WhatsApp</a>
                    </div>`;

const contactInfoCard = () => `
                <div class="lg:w-2/5 bg-gradient-to-br from-[#163A5F] to-[#1E5F74] p-10 md:p-12 relative overflow-hidden flex flex-col justify-between">
                    <div class="absolute top-0 right-0 w-64 h-64 bg-[#55c5e9] rounded-full blur-[100px] opacity-30 mix-blend-screen -mr-20 -mt-20"></div>
                    <div class="relative z-10">
                        <h3 class="text-3xl font-black mb-10 text-white">Datos de Contacto</h3>
                        <div class="space-y-8">
                            <div class="flex items-start gap-5">
                                <div class="bg-white/10 p-3 rounded-full shrink-0 backdrop-blur-sm"><i data-lucide="phone" class="w-6 h-6 text-[#55c5e9]"></i></div>
                                <div>
                                    <p class="font-bold text-lg text-white mb-1">Teléfono y WhatsApp</p>
                                    <a href="tel:${PHONE_TEL}" class="text-blue-100 text-lg hover:text-white transition-colors block">${PHONE}</a>
                                    <a href="${WA2}" target="_blank" rel="noopener noreferrer" class="text-blue-100 text-lg hover:text-white transition-colors block">${PHONE2} <span class="text-sm opacity-80">(solo WhatsApp)</span></a>
                                </div>
                            </div>
                            <div class="flex items-start gap-5">
                                <div class="bg-white/10 p-3 rounded-full shrink-0 backdrop-blur-sm"><i data-lucide="mail" class="w-6 h-6 text-[#55c5e9]"></i></div>
                                <div>
                                    <p class="font-bold text-lg text-white mb-1">Correo Electrónico</p>
                                    <a href="mailto:${EMAIL}" class="text-blue-100 text-base break-all hover:text-white transition-colors block">${EMAIL}</a>
                                </div>
                            </div>
                            <div class="flex items-start gap-5">
                                <div class="bg-white/10 p-3 rounded-full shrink-0 backdrop-blur-sm"><i data-lucide="map-pin" class="w-6 h-6 text-[#55c5e9]"></i></div>
                                <div>
                                    <p class="font-bold text-lg text-white mb-1">Sede Central</p>
                                    <p class="text-blue-100 text-base">Lampa, Región Metropolitana.</p>
                                    <div class="inline-block bg-[#4F8A6B] text-white text-xs font-bold px-3 py-1 rounded-full mt-2">Operación a Nivel Nacional</div>
                                </div>
                            </div>
                            <div class="flex items-start gap-5">
                                <div class="bg-white/10 p-3 rounded-full shrink-0 backdrop-blur-sm"><i data-lucide="clock" class="w-6 h-6 text-[#55c5e9]"></i></div>
                                <div>
                                    <p class="font-bold text-lg text-white mb-1">Horario comercial</p>
                                    <p class="text-blue-100 text-base">Lunes a viernes, 9:00 a 18:00 h.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>`;

/* Página /cotizar/ */
{
  const path_ = '/cotizar/';
  pages.push({
    out: `${path_}index.html`,
    head: {
      title: 'Solicitar Cotización de Operativo de Salud | Exámenes Digitales',
      description: 'Solicite una cotización o propuesta institucional de mamografía móvil, ecografía en terreno o exámenes GES para su municipalidad, hospital, centro médico o empresa. Respuesta el mismo día hábil.',
      canonical: `${SITE}${path_}`,
      jsonld: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'ContactPage',
        name: 'Solicitar cotización — Exámenes Digitales',
        url: `${SITE}${path_}`,
        mainEntity: { '@id': `${SITE}/#organizacion` },
      }, null, 2),
    },
    body: `
    <section class="relative pt-36 pb-20 bg-[#0f2a4a] text-white overflow-hidden">
        <div class="absolute inset-0 z-0">
            <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#1E5F74] blur-[120px] opacity-60"></div>
            <div class="absolute bottom-[10%] -right-[10%] w-[40%] h-[60%] rounded-full bg-[#0c73ba] blur-[120px] opacity-40"></div>
        </div>
        <div class="container mx-auto px-4 md:px-8 relative z-10">
            <nav aria-label="Ruta de navegación" class="mb-8 text-xs text-blue-200 font-medium"><a href="/" class="hover:text-[#55c5e9]">Inicio</a><span class="mx-2 opacity-50">/</span><span class="text-[#55c5e9]">Solicitar cotización</span></nav>
            <div class="text-center max-w-3xl mx-auto mb-12">
                <h1 class="text-4xl md:text-5xl font-black mb-4">Solicite su propuesta institucional</h1>
                <p class="text-xl text-blue-200 font-light">Cuéntenos qué exámenes necesita, para cuántas personas y en qué comuna. Le respondemos el mismo día hábil con una propuesta técnica y económica.</p>
            </div>
            <div class="bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col lg:flex-row max-w-6xl mx-auto text-[#4B5563]">
${contactInfoCard()}
                <div class="lg:w-3/5 p-8 md:p-12 bg-white">
                    <h2 class="text-2xl font-black text-[#163A5F] mb-6">Formulario de solicitud</h2>
${contactForm()}
                </div>
            </div>
        </div>
    </section>
    <section class="py-16 bg-white">
        <div class="container mx-auto px-4 md:px-8">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto text-center">
                <div class="p-6"><div class="mx-auto w-14 h-14 rounded-full bg-[#55c5e9]/15 flex items-center justify-center mb-4"><i data-lucide="clock" class="w-7 h-7 text-[#0c73ba]"></i></div><h3 class="font-black text-[#163A5F] text-lg mb-2">Respuesta el mismo día</h3><p class="text-gray-600 text-sm">Revisamos cada solicitud en horario hábil y le llamamos o escribimos por el canal que prefiera.</p></div>
                <div class="p-6"><div class="mx-auto w-14 h-14 rounded-full bg-[#55c5e9]/15 flex items-center justify-center mb-4"><i data-lucide="file-check" class="w-7 h-7 text-[#0c73ba]"></i></div><h3 class="font-black text-[#163A5F] text-lg mb-2">Propuesta formal</h3><p class="text-gray-600 text-sm">Propuesta técnica y económica apta para trato directo, convenio o licitación en Mercado Público.</p></div>
                <div class="p-6"><div class="mx-auto w-14 h-14 rounded-full bg-[#55c5e9]/15 flex items-center justify-center mb-4"><i data-lucide="truck" class="w-7 h-7 text-[#0c73ba]"></i></div><h3 class="font-black text-[#163A5F] text-lg mb-2">Cobertura nacional</h3><p class="text-gray-600 text-sm">Clínica móvil de mamografía y equipos portátiles de ecografía desplegados en todo Chile.</p></div>
            </div>
        </div>
    </section>`,
  });
}

/* --------------------------- Escritura de archivos --------------------------- */
function write(rel, content) {
  const full = path.join(ROOT, rel);
  fs.mkdirSync(path.dirname(full), { recursive: true });
  fs.writeFileSync(full, content, 'utf8');
  console.log('  ✓ ' + rel + ' (' + Math.round(Buffer.byteLength(content) / 1024) + ' KB)');
}

console.log('Generando páginas...');
for (const p of pages) {
  write(p.out, head(p.head) + header() + p.body + footer());
}

/* --- Reescribir index.html: header/footer compartidos + rutas absolutas --- */
console.log('Actualizando index.html...');
let index = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');

// Analítica (Google Analytics) y verificación de Search Console
if (!index.includes('googletagmanager.com/gtag/js')) {
  index = index.replace(/<head>/, '<head>' + headExtras);
}
if (GSC_VERIFICATION && !index.includes('google-site-verification')) {
  index = index.replace(/<head>/, '<head>' + gscMeta);
}

// Sección de contacto: tarjeta de datos + formulario nativo compartidos
index = index.replace(
  /(<div class="bg-white rounded-\[40px\] shadow-2xl overflow-hidden flex flex-col lg:flex-row max-w-6xl mx-auto">)[\s\S]*?(\n            <\/div>\n        <\/div>\n    <\/section>)/,
  (m, open, close) => `${open}
${contactInfoCard()}
                <div class="lg:w-3/5 p-8 md:p-12 bg-white">
                    <h3 class="text-2xl font-black text-[#163A5F] mb-6">Solicitud de Propuesta Institucional</h3>
${contactForm()}
                </div>
${close}`
);
// Enlaces al antiguo Google Form → página interna de cotización
index = index.replace(/href="https:\/\/forms\.gle\/[A-Za-z0-9]+"(\s+target="_blank"\s+rel="noopener noreferrer")?/g, 'href="/cotizar/"');
// Correo corporativo
index = index.replace(/examenesdigitales@gmail\.com/g, EMAIL);
// Tailwind por CDN (bloquea el renderizado y pesa ~400 KB): el CSS ya está compilado en /css/styles.css
index = index.replace(/[ \t]*<!-- Tailwind CSS -->\r?\n[ \t]*<script src="https:\/\/cdn\.tailwindcss\.com"><\/script>\r?\n/, '');
// Lucide: versión fija y diferida
index = index.replace(/<script src="https:\/\/unpkg\.com\/lucide@latest"><\/script>/, '<script defer src="https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js"></script>');

// Reemplazar header y footer por los compartidos
index = index.replace(/<!-- Header & Navegación -->[\s\S]*?<\/header>/, header().trim());
index = index.replace(/<!-- Footer Premium -->[\s\S]*?<\/footer>/, footer().replace(/<script src="\/js\/main\.js" defer><\/script>/, '').trim());

// Quitar <style> inline y <script> inline (ahora en /css/styles.css y /js/main.js)
index = index.replace(/[ \t]*<!-- Estilos y Animaciones Personalizadas -->\r?\n[ \t]*<style>[\s\S]*?<\/style>\r?\n/, '');
index = index.replace(/[ \t]*<!-- Scripts de interactividad -->\r?\n[ \t]*<script>[\s\S]*?<\/script>/, '    <script src="/js/main.js" defer></script>');

// Rutas absolutas de assets
index = index.replace(/(href|src)="css\//g, '$1="/css/');
index = index.replace(/(href|src)="assets\//g, '$1="/assets/');
index = index.replace(/(href|src)="js\//g, '$1="/js/');
index = index.replace(/(href|src)="favicon\.svg"/g, '$1="/favicon.svg"');

// Quitar el <script src="/js/main.js"> duplicado si el footer traía uno
fs.writeFileSync(path.join(ROOT, 'index.html'), index, 'utf8');
console.log('  ✓ index.html actualizado');

/* ------------------------------- sitemap.xml ------------------------------- */
const urls = [
  { loc: '/', priority: '1.0', freq: 'monthly' },
  { loc: '/mamografia-movil/', priority: '0.9', freq: 'monthly' },
  { loc: '/ecografia-en-terreno/', priority: '0.9', freq: 'monthly' },
  { loc: '/examenes-ges/', priority: '0.9', freq: 'monthly' },
  { loc: '/convenios-institucionales/', priority: '0.8', freq: 'monthly' },
  { loc: '/experiencia/', priority: '0.7', freq: 'monthly' },
  { loc: '/cotizar/', priority: '0.8', freq: 'monthly' },
  { loc: '/blog/', priority: '0.6', freq: 'weekly' },
  { loc: '/blog/como-se-realiza-un-operativo-de-mamografia-movil/', priority: '0.6', freq: 'yearly' },
];
const today = new Date().toISOString().slice(0, 10);
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url>
    <loc>${SITE}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>
`;
write('sitemap.xml', sitemap);
console.log('Listo.');
