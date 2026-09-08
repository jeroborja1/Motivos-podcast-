# Motivos Podcast — Sitio web

Landing page de **Motivos Podcast con John Vanegas**. _Historias reales. Motivos reales._

## Estructura

| Archivo | Descripción |
|---|---|
| `index.html` | La página completa (copia servible de `code.html`). |
| `code.html` | Archivo de diseño original del front-end. |
| `DESIGN.md` | Sistema de diseño: colores, tipografía, espaciado, componentes. |
| `server.js` | Servidor estático sin dependencias para desarrollo local. |

## Desarrollo local

```bash
npm start            # http://localhost:3000
PORT=4000 npm start  # otro puerto
```

No hay dependencias ni paso de build: es HTML estático que usa Tailwind por CDN,
Google Fonts e imágenes remotas (requiere conexión a internet).

## Publicación

Desplegado como sitio estático en **Vercel**. Cada push a `main` genera un nuevo despliegue.
