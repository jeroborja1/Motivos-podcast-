// Generador estático de Motivos — cero dependencias.
// Ensambla src/partials/*.html dentro de src/pages/*.html y escribe el
// resultado como archivos planos en la raíz del repo (lo que Vercel despliega).
//
// Uso:  node build.js
"use strict";

const fs = require("fs");
const path = require("path");

const ROOT = __dirname;
const PAGES_DIR = path.join(ROOT, "src", "pages");
const PARTIALS_DIR = path.join(ROOT, "src", "partials");
const DATA_DIR = path.join(ROOT, "src", "data");
const EPISODIOS_OUT_DIR = path.join(ROOT, "podcast");

// home.html es la única página que no conserva su nombre: se publica como index.html
const OUTPUT_NAME = {
  "home.html": "index.html",
};

const INCLUDE_RE = /<!--\s*INCLUDE:([a-zA-Z0-9_-]+\.html)\s*-->/g;

function resolveIncludes(content, chain) {
  return content.replace(INCLUDE_RE, (match, name) => {
    if (chain.includes(name)) {
      throw new Error(`Include cíclico detectado: ${chain.concat(name).join(" -> ")}`);
    }
    const partialPath = path.join(PARTIALS_DIR, name);
    if (!fs.existsSync(partialPath)) {
      throw new Error(`No existe el partial "${name}" (esperado en ${partialPath})`);
    }
    const partial = fs.readFileSync(partialPath, "utf8");
    return resolveIncludes(partial, chain.concat(name));
  });
}

function relatedCard(ep) {
  return `<a class="flex flex-col gap-3 group" href="/podcast/${ep.slug}">
<div class="relative aspect-video overflow-hidden rounded-xl">
<img alt="${ep.imagenAlt}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="${ep.imagen}" loading="lazy">
<span class="absolute top-2 left-2 px-2 py-0.5 rounded bg-arena text-petroleo font-satoshi text-[9px] font-bold tracking-wider uppercase">Ep. ${ep.numero}</span>
</div>
<h4 class="font-satoshi text-[13px] font-bold text-blanco leading-snug group-hover:text-menta transition-colors">${ep.titulo}</h4>
</a>`;
}

function buildEpisodioPage(ep, todos) {
  const idx = todos.findIndex((e) => e.slug === ep.slug);
  const related = [
    todos[(idx + 1) % todos.length],
    todos[(idx + 2) % todos.length],
    todos[(idx + 3) % todos.length],
  ].filter((e) => e.slug !== ep.slug).slice(0, 3);

  const spotifyBlock = ep.spotifyUrl
    ? `<a class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-petroleo text-blanco font-black text-sm hover:bg-oliva transition-colors" href="${ep.spotifyUrl}" rel="noopener noreferrer" target="_blank">
<span class="material-symbols-outlined text-[20px]">play_circle</span> Escuchar en Spotify
</a>`
    : "";

  return `<!DOCTYPE html><html class="scroll-smooth" lang="es"><head><meta charset="utf-8">
<title>Ep. ${ep.numero} · ${ep.badge} — Motivos Podcast</title>
<meta content="width=device-width, initial-scale=1.0" name="viewport">
<meta name="description" content="${ep.sinopsis.replace(/"/g, "&quot;")}">
<meta property="og:title" content="Ep. ${ep.numero} · ${ep.badge} — Motivos Podcast">
<meta property="og:description" content="${ep.sinopsis.replace(/"/g, "&quot;")}">
<meta property="og:image" content="https://motivosvn.com${ep.imagen}">
<meta property="og:type" content="video.episode">
<!--INCLUDE:head-shared.html-->
</head>
<body class="bg-arena font-satoshi font-medium text-grafito antialiased selection:bg-menta selection:text-petroleo">
<!--INCLUDE:header.html-->
<main class="w-full pt-20">

<section class="w-full bg-petroleo text-blanco py-16">
<div class="max-w-4xl mx-auto px-5 md:px-8 lg:px-12 flex flex-col gap-4">
<a class="inline-flex items-center gap-1.5 text-menta text-xs font-bold hover:text-arena transition-colors w-fit" href="/podcast#episodios">
<span class="material-symbols-outlined text-[16px]">arrow_back</span> Ver todos los capítulos
</a>
<span class="font-satoshi text-xs font-black uppercase tracking-[0.2em] text-menta">${ep.temporada} · Episodio ${ep.numero} · ${ep.fechaLegible}</span>
<h1 class="font-satoshi text-2xl md:text-4xl font-black uppercase leading-tight">${ep.titulo}</h1>
<p class="text-arena text-base leading-relaxed max-w-2xl">${ep.sinopsis}</p>
</div>
</section>

<section class="w-full bg-grafito py-10">
<div class="max-w-5xl mx-auto px-5 md:px-8 lg:px-12">
<div class="w-full aspect-video rounded-2xl overflow-hidden border border-oliva">
<iframe class="w-full h-full" src="https://www.youtube.com/embed/${ep.youtubeId}" title="${ep.badge} — Motivos Podcast" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>
</div>
</div>
</section>

<section class="w-full bg-arena text-petroleo py-20">
<div class="max-w-5xl mx-auto px-5 md:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
<div class="lg:col-span-2 flex flex-col gap-8">
<div>
<span class="text-[10px] uppercase tracking-wider font-bold text-ocre">${ep.categoria}</span>
<h2 class="font-satoshi text-xl font-black uppercase mt-2">Sobre esta historia</h2>
<p class="text-sm leading-relaxed mt-3">${ep.sinopsis}</p>
</div>
<div class="flex flex-wrap gap-3">
${spotifyBlock}
<a class="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-xl bg-ocre text-grafito font-black text-sm hover:bg-menta transition-colors" href="https://www.youtube.com/watch?v=${ep.youtubeId}" rel="noopener noreferrer" target="_blank">
<span class="material-symbols-outlined text-[20px]">play_circle</span> Ver en YouTube
</a>
</div>
<div class="border-t border-oliva pt-6 flex flex-col gap-2">
<h3 class="font-satoshi text-sm font-black uppercase text-oliva">Transcripción</h3>
<p class="text-xs italic text-oliva">Disponible próximamente — estamos preparando la transcripción revisada de este episodio.</p>
</div>
<div class="flex flex-col gap-2">
<h3 class="font-satoshi text-sm font-black uppercase text-oliva">Capítulos</h3>
<p class="text-xs italic text-oliva">Las marcas de tiempo de este episodio se publican próximamente.</p>
</div>
</div>
<div class="flex flex-col gap-4">
<span class="font-satoshi text-xs font-black uppercase tracking-[0.2em] text-petroleo">Sigue explorando</span>
<div class="bg-petroleo rounded-2xl p-5 flex flex-col gap-5">
${related.map(relatedCard).join("\n")}
</div>
</div>
</div>
</section>
</main>
<!--INCLUDE:whatsapp-float.html-->
<!--INCLUDE:footer.html-->
<!--INCLUDE:scripts.html-->
</body></html>
`;
}

function buildEpisodePages() {
  const dataPath = path.join(DATA_DIR, "episodios.json");
  if (!fs.existsSync(dataPath)) return [];
  const episodios = JSON.parse(fs.readFileSync(dataPath, "utf8"));

  if (!fs.existsSync(EPISODIOS_OUT_DIR)) {
    fs.mkdirSync(EPISODIOS_OUT_DIR, { recursive: true });
  }

  const written = [];
  for (const ep of episodios) {
    const html = buildEpisodioPage(ep, episodios);
    const out = resolveIncludes(html, [`episodio:${ep.slug}`]);
    const outPath = path.join(EPISODIOS_OUT_DIR, `${ep.slug}.html`);
    fs.writeFileSync(outPath, out);
    written.push({ file: `episodios.json#${ep.slug}`, outName: `podcast/${ep.slug}.html`, bytes: Buffer.byteLength(out, "utf8") });
  }
  return written;
}

function build() {
  const pageFiles = fs.readdirSync(PAGES_DIR).filter((f) => f.endsWith(".html"));
  if (pageFiles.length === 0) {
    throw new Error(`No se encontraron páginas en ${PAGES_DIR}`);
  }

  const written = [];
  for (const file of pageFiles) {
    const srcPath = path.join(PAGES_DIR, file);
    const src = fs.readFileSync(srcPath, "utf8");
    const out = resolveIncludes(src, [file]);
    const outName = OUTPUT_NAME[file] || file;
    const outPath = path.join(ROOT, outName);
    fs.writeFileSync(outPath, out);
    written.push({ file, outName, bytes: Buffer.byteLength(out, "utf8") });
  }

  const episodeWritten = buildEpisodePages();
  written.push(...episodeWritten);

  console.log("Build de Motivos completo:\n");
  for (const w of written) {
    console.log(`  ${w.file.padEnd(28)} ->  ${w.outName.padEnd(24)} (${w.bytes.toLocaleString()} bytes)`);
  }
  console.log(`\n${written.length} páginas generadas.`);
}

build();
