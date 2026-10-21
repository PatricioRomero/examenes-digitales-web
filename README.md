# Sitio web Exámenes Digitales SpA — examenesdigitales.cl

Sitio estático (HTML + Tailwind compilado) de Exámenes Digitales SpA.

## Flujo de trabajo
1. Este repositorio es la **fuente única de verdad**. El archivo original entregado
   permanece respaldado en `Descargas\Sitio WEB Examenes Digitales` (solo lectura).
2. Los cambios se editan aquí, se registran en Git y se suben a GitHub.
3. El despliegue se hace desde este repositorio al hosting Hostinger administrado
   con Coolify (container estático: Nginx/Apache sirviendo la raíz del repo).
4. DNS: registrar en Hostinger/Coolify el dominio y apuntar los DNS en nic.cl
   (o Cloudflare como proxy) hacia el nuevo servidor.

## Estructura
- `index.html` — página principal (one-page por secciones).
- `assets/img/` — imágenes optimizadas (JPEG, <360 KB c/u).
- `css/styles.css` — Tailwind compilado (no usar cdn.tailwindcss.com en producción).
  Recompilar tras cambiar clases: `npx tailwindcss@3 -c tailwind.config.js -i src/input.css -o css/styles.css --minify`
  (requiere `@tailwindcss/typography`).
- `src/build-pages.mjs` — genera las páginas internas, `/cotizar/`, el sitemap y
  normaliza `index.html` (`node src/build-pages.mjs`).
- `/cotizar/` y la sección `#contacto` — formulario propio que envía a la hoja de
  respuestas del Google Form "Solicitud Institucional" (IDs `entry.*` en el build);
  el manejo del envío, la confirmación y el enlace a WhatsApp están en `js/main.js`.
- Correo corporativo: `contacto@examenesdigitales.cl` (reenvío configurado en Cloudflare Email Routing).
- `robots.txt`, `sitemap.xml` — indexación para Google/Bing.
- `favicon.svg` — ícono del sitio.

## SEO implementado
- Title y meta description optimizados (≤155 caracteres).
- Canonical a `https://examenesdigitales.cl/` (dominio único; servir www con 301).
- Open Graph + Twitter Card para previsualización al compartir (WhatsApp).
- JSON-LD: `MedicalBusiness` + `WebSite` (schema.org).
- Imágenes locales con `width`/`height` (sin CLS), `loading="lazy"` y hero con `fetchpriority="high"`.
- Peso total de la página ≈ 1,4 MB (antes: 15,4 MB en HTML).

## Pendiente (fase 2 — requiere aprobación)
- Convertir a multipágina: /mamografia-movil, /ecografia-en-terreno, /ges, /convenios-institucionales, /experiencia.
- Blog de operativos por comuna.
- Alta en Google Search Console y sitemap enviado.