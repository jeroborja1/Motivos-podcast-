# Motivos — sitio web

Motivos es una marca de historias reales: podcast, Fundación Motivos V.N., mentorías y productos con propósito. *Vidas reales · Un propósito.*

## Arquitectura

El sitio es HTML/CSS estático (Tailwind por CDN, sin build de CSS) generado a partir de partials compartidos, para no duplicar header/footer/nav en cada página.

```
src/
  partials/
    head-shared.html   fuentes, paleta y tipografía (tailwind.config), CSS crítico
    header.html         logo, menú con dropdowns, menú móvil
    footer.html          footer de 4 columnas
    whatsapp-float.html  botón flotante de WhatsApp
    scripts.html         menú móvil, dropdowns, enlace activo, honeypot del newsletter
  pages/
    home.html       -> se publica como index.html (las 8 secciones del home)
    motivos.html    -> /motivos   (Nuestra historia, John y Nidian, Fundación V.N., galería)
    podcast.html    -> /podcast   (catálogo de episodios, Onces con Motivos)
    postula.html    -> /postula
    tienda.html     -> /tienda    (Hoodie, Termo, Mug, Block de Notas)
    mentorias.html  -> /mentorias
    contacto.html   -> /contacto
build.js     genera los .html de la raíz a partir de src/ (cero dependencias npm)
server.js    servidor estático para desarrollo local (sirve /ruta -> ruta.html, como Vercel)
img/         imágenes propias del sitio (nada se sirve desde dominios externos)
```

Los archivos `.html` de la raíz (`index.html`, `motivos.html`, etc.) son **generados** por `build.js` — no se editan a mano. Cualquier cambio de contenido va en `src/pages/*.html`; cualquier cambio de header, footer, menú o paleta va en `src/partials/*.html`.

## Desarrollo local

```bash
npm run build   # genera los .html en la raíz a partir de src/
npm start        # build + servidor en http://localhost:3000
```

`npm run dev` hace lo mismo que `npm start`. Usa `PORT=4000 node server.js` para otro puerto.

## Paleta de marca

Únicos colores permitidos (Manual de Marca v1.0): Azul Petróleo `#063642`, Azul Menta `#A3C8BE`, Ocre `#C1873A`, Oliva `#434637`, Arena `#DED7CE`, Grafito `#1E1E1E`. Sin degradados, tonos derivados ni opacidades que alteren el tono. Blanco puro solo como color de texto sobre petróleo/oliva — nunca como fondo.

## Publicación

Vercel, estático, `cleanUrls: true` (así `/motivos` sirve `motivos.html` sin redirecciones). `vercel.json` agrega headers de seguridad (HSTS, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, CSP). Cada push a una rama conectada genera un deployment; el auto-deploy a producción está activo en `main`.
