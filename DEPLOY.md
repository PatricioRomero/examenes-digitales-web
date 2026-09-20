# Despliegue en Hostinger + Coolify y cambio de DNS

Este documento describe cómo publicar este repositorio en el hosting Hostinger
administrado por Coolify y cómo apuntar el dominio `examenesdigitales.cl`.

> Estado actual (verificado 20-sep-2026): el sitio se sirve en el nodo
> `us-app1.friki.cl` (Apache, AWS EC2 us-east-1, IP 34.196.116.193). Este
> repositorio reemplaza esa publicación.

## 1. Dominio canónico
Se definió **https://examenesdigitales.cl/** (sin `www`) como URL canónica.
Por lo tanto, `www.examenesdigitales.cl` debe responder con **redirección 301**
hacia la raíz. Ver sección 3.

## 2. Despliegue en Coolify (Hostinger)

### Opción A — Aplicación "Static" (recomendada, sin Dockerfile)
1. En Coolify: **+ New → Application**.
2. Fuente: **Git Repository → Public Repository**, pegar la URL de este repo
   y la rama `main`.
3. Build Pack: **Static** (Nixpacks / Static).
4. Publish directory: `.` (o `/`). El servidor sirve `index.html` como raíz.
5. Dominio: `examenesdigitales.cl` y (para el redirect) `www.examenesdigitales.cl`.

### Opción B — Con Dockerfile
Si prefieres control total, añade este `Dockerfile` a la raíz:

```dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

Y un `nginx.conf`:

```nginx
server {
    listen 80;
    server_name www.examenesdigitales.cl;
    return 301 https://examenesdigitales.cl$request_uri;
}

server {
    listen 80;
    server_name examenesdigitales.cl;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location ~* \.(jpg|jpeg|png|webp|svg|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

En Coolify elige Build Pack **Dockerfile** y asigna el dominio.

## 3. Redirección www → raíz (si usas Static sin Dockerfile)
En Coolify puedes añadir el dominio `www.examenesdigitales.cl` con la opción
**"Redirect to"** hacia `https://examenesdigitales.cl/`.

## 4. Cambio de DNS

### Con Cloudflare (recomendado, igual que con Lampasalud)
1. En Cloudflare: **Add site → examenesdigitales.cl** (plan Free).
2. Cloudflare te entrega **2 nameservers** (ej. `xxx.ns.cloudflare.com`).
3. En **nic.cl**: reemplazar los NS actuales (`dns1.friki.cl`, `dns2.friki.cl`)
   por los de Cloudflare.
4. En Cloudflare DNS, crear:
   - `A`  `examenesdigitales.cl` → IP pública del VPS/servidor Hostinger.
   - `CNAME` `www` → `examenesdigitales.cl` (o A a la misma IP).
   - (Opcional) `MX` de correo, si el correo deja de estar en friki — verificar
     antes de moverlo: hoy `mail.examenesdigitales.cl` apunta a otra IP (54.94.181.41).
5. SSL: **Full (strict)** en Cloudflare + certificado Let's Encrypt en Coolify.

### Directo en nic.cl (sin Cloudflare)
1. En nic.cl, apuntar el registro `A` de `examenesdigitales.cl` a la IP del
   servidor Hostinger.
2. `www` como `CNAME` → `examenesdigitales.cl`.

## 5. Después de migrar
1. Verificar `https://examenesdigitales.cl/` carga y `www` redirige (301).
2. Verificar `robots.txt` y `sitemap.xml` responden 200.
3. Alta/verificación en **Google Search Console** y **Bing Webmaster Tools**;
   enviar `sitemap.xml`.
4. Verificar en `https://pagespeed.web.dev` que LCP y CLS están en verde
   (peso objetivo < 1.5 MB).
5. Crear **Google Business Profile** para búsquedas locales si aún no existe.

## Notas
- No borrar el respaldo original en `Descargas\Sitio WEB Examenes Digitales`.
- El correo (`mail.examenesdigitales.cl`) es un servicio aparte; confirmar con
  el proveedor antes de tocar los registros `MX`.
