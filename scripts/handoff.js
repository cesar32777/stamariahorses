#!/usr/bin/env node
/*
 * handoff.js — tacha en un handoff existente lo que ya se hizo.
 *
 * PLANTILLA GENERICA. Copiala a scripts/ del repo y ajusta SOLO el bloque
 * CONFIG de abajo.
 *
 * El handoff es un artefacto DESECHABLE de traspaso entre sesiones. No es
 * fuente de verdad de nada: vive donde sea (temp, escritorio, un gist), se
 * tacha conforme avanza el trabajo, y cuando esta todo tachado se borra.
 *
 * Este script NO lo reescribe ni lo regenera: lee el que ya existe, cruza las
 * menciones a tickets contra el estado real de `docs/tickets/`, y tacha con
 * ~~...~~ lo que ya esta cerrado. Es idempotente: correrlo dos veces no
 * duplica tachados.
 *
 *   node scripts/handoff.js <ruta-handoff.md>            -> simulacro
 *   node scripts/handoff.js <ruta-handoff.md> --aplicar  -> escribe
 *
 * La fuente de verdad sigue siendo el campo `Estado:` de cada ticket.
 */
const fs = require('fs');
const path = require('path');

// ==== CONFIG — igual que en estado-tickets.js ===============================

const AMBITOS = ['T'];
const SUFIJOS = [];

// Eje principal del campo `Estado:`. '' si el proyecto tiene un solo eje.
const EJE_PPAL = 'móvil';

// ==== FIN CONFIG ============================================================

const TICKETS = path.join(__dirname, '..', 'docs', 'tickets');
const ARCHIVO = process.argv[2];
const APLICAR = process.argv.includes('--aplicar');

if (!ARCHIVO || ARCHIVO.startsWith('--')) {
  console.error('Uso: node scripts/handoff.js <ruta-al-handoff.md> [--aplicar]');
  console.error('El handoff puede vivir en cualquier lado — es desechable, no parte del repo.');
  process.exit(2);
}
if (!fs.existsSync(ARCHIVO)) {
  console.error(`No existe: ${ARCHIVO}`);
  process.exit(2);
}

// --- 1. Estado real de los tickets -----------------------------------------
const RE_CERRADO = new RegExp('^Estado:.*' + (EJE_PPAL ? EJE_PPAL + '\\s*' : '\\s*') + '✅', 'm');
const cerrados = new Set();
const abiertos = new Set();
for (const f of fs.readdirSync(TICKETS)) {
  if (!f.endsWith('.md') || f === 'README.md' || f === 'ESTADO.md' || f.endsWith('-wip.md')) continue;
  const id = f.replace(/\.md$/, '');
  const txt = fs.readFileSync(path.join(TICKETS, f), 'utf8');
  (RE_CERRADO.test(txt) ? cerrados : abiertos).add(id);
}
if (!cerrados.size && !abiertos.size) {
  console.error('No se encontraron tickets en docs/tickets/ — ¿ruta equivocada?');
  process.exit(2);
}

// El sufijo va en la alternancia y ANTES del \b: sin `-UI` aqui, `CMP-11-UI`
// matchea como `CMP-11` (cerrado) y el script tacharia una linea que habla de
// trabajo ABIERTO — enterrandolo. Es justo lo que el metodo prohibe.
const RE_TICKET = new RegExp(
  `\\b(?:${AMBITOS.join('|')})-\\d+[a-z]?${SUFIJOS.length ? `(?:${SUFIJOS.map((s) => '-' + s).join('|')})?` : ''}\\b`,
  'g'
);

// Tacha un fragmento conservando el markdown de alrededor. `marca` agrega el ✅
// — en tablas solo lo lleva la primera celda, para no repetirlo en toda la fila.
function tachar(txt, marca = true) {
  const m = txt.match(/^(\s*(?:[-*+]\s+|\d+\.\s+|#{1,6}\s+)?)([\s\S]*?)(\s*)$/);
  if (!m) return txt;
  const [, prefijo, cuerpo, sufijo] = m;
  if (!cuerpo.trim()) return txt;
  return `${prefijo}~~${cuerpo}~~${marca ? ' ✅' : ''}${sufijo}`;
}

// --- 2. Recorrer el handoff -------------------------------------------------
const original = fs.readFileSync(ARCHIVO, 'utf8');
const salida = [];
const tachadas = [];
const pendientes = new Set();
let enBloqueCodigo = false;

for (const linea of original.split('\n')) {
  if (/^\s*```/.test(linea)) enBloqueCodigo = !enBloqueCodigo;

  // No se toca: bloques de codigo, lineas ya tachadas, lineas sin ticket.
  const ids = enBloqueCodigo ? [] : [...new Set(linea.match(RE_TICKET) || [])];
  if (!ids.length || linea.includes('~~')) {
    salida.push(linea);
    continue;
  }

  const cerradosAqui = ids.filter((i) => cerrados.has(i));
  const abiertosAqui = ids.filter((i) => !cerrados.has(i));
  abiertosAqui.forEach((i) => pendientes.add(i));

  // Solo se tacha si TODOS los tickets de la linea estan cerrados: una linea
  // que mezcla hecho y pendiente sigue viva, o se perderia lo pendiente.
  if (!cerradosAqui.length || abiertosAqui.length) {
    salida.push(linea);
    continue;
  }

  if (/^\s*\|.*\|\s*$/.test(linea)) {
    // Fila de tabla: se tacha celda por celda, los pipes se respetan.
    const celdas = linea.split('|');
    let primera = true;
    salida.push(
      celdas
        .map((c, i) => {
          if (i === 0 || i === celdas.length - 1 || !c.trim() || /^[\s:-]+$/.test(c)) return c;
          const t = ` ${tachar(c.trim(), primera)} `;
          primera = false;
          return t;
        })
        .join('|')
    );
  } else {
    salida.push(tachar(linea));
  }
  tachadas.push({ ids: cerradosAqui, texto: linea.trim().slice(0, 90) });
}

// --- 3. Reporte -------------------------------------------------------------
const nuevo = salida.join('\n');
console.log(`Handoff: ${ARCHIVO}`);
console.log(`Tickets cerrados en el repo: ${cerrados.size} · abiertos: ${abiertos.size}`);
console.log();

if (tachadas.length) {
  console.log(`Líneas a tachar: ${tachadas.length}`);
  for (const t of tachadas.slice(0, 20)) console.log(`  [${t.ids.join(', ')}] ${t.texto}`);
  if (tachadas.length > 20) console.log(`  ... y ${tachadas.length - 20} más`);
} else {
  console.log('Nada que tachar: o ya estaba tachado, o no menciona tickets cerrados.');
}
console.log();

if (pendientes.size) {
  console.log(`Sigue vivo en el handoff (${pendientes.size} tickets): ${[...pendientes].sort().join(' · ')}`);
} else if (cerrados.size) {
  console.log('✅ El handoff no menciona ningún ticket abierto — ya cumplió su función, se puede borrar.');
}
console.log();

if (APLICAR) {
  if (nuevo === original) console.log('Sin cambios.');
  else {
    fs.writeFileSync(ARCHIVO, nuevo);
    console.log(`Escrito. ${tachadas.length} línea(s) tachada(s).`);
  }
} else {
  console.log('(SIMULACRO — nada escrito. Agrega --aplicar para tachar de verdad.)');
}
