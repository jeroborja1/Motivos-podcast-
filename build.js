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

  console.log("Build de Motivos completo:\n");
  for (const w of written) {
    console.log(`  src/pages/${w.file.padEnd(16)} ->  ${w.outName.padEnd(16)} (${w.bytes.toLocaleString()} bytes)`);
  }
  console.log(`\n${written.length} páginas generadas.`);
}

build();
