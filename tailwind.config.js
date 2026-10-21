/** Configuración de Tailwind para compilar css/styles.css
 *  Uso: npx tailwindcss@3 -c tailwind.config.js -i src/input.css -o css/styles.css --minify
 *  (ver README). Escanea todas las páginas y el generador, de modo que ninguna
 *  clase quede fuera del CSS compilado.
 */
module.exports = {
  content: ['./index.html', './*/index.html', './blog/*/index.html', './src/build-pages.mjs', './js/main.js'],
  theme: { extend: {} },
  plugins: [require('@tailwindcss/typography')],
};
