#!/usr/bin/env node
/*
 * estado-tickets.js — deriva el estado del backlog leyendo los tickets.
 *
 * PLANTILLA GENERICA. Copiala a scripts/ del repo y ajusta SOLO el bloque
 * CONFIG de abajo. El resto no deberia hacer falta tocarlo.
 *
 * NO mantiene estado propio: la unica fuente de verdad es el campo `Estado:`
 * de cada `docs/tickets/*.md`. Este script solo lo lee y lo cuenta, asi que un
 * ticket nuevo aparece solo y uno mal escrito se delata.
 *
 *   node scripts/estado-tickets.js            -> reporte a pantalla
 *   node scripts/estado-tickets.js --escribir -> ademas regenera docs/tickets/ESTADO.md
 *
 * Sale con codigo 1 si encuentra alguna inconsistencia, para colgarlo de un
 * hook o de CI.
 */
const fs = require('fs');
const path = require('path');

// ==== CONFIG — lo unico que se ajusta por proyecto ==========================

// Prefijos de ID validos. Un ticket con otro prefijo se reporta como problema.
// Un solo ambito a proposito: los IDs T-01..T-15 ya estaban escritos en
// PLAN-TICKETS.md y HANDOFF-BUILD.md; renumerarlos habria roto esas
// referencias. La agrupacion la da el campo `Fase:`, no el prefijo.
const AMBITOS = ['T'];

// Campos obligatorios en la cabecera de cada ticket, antes del `---`.
const CAMPOS = ['Origen', 'Fuente', 'Fase', 'Referencia', 'Estado', 'Depende de', 'Animación', 'Tests', 'Datos', 'Hecho cuando'];

// Ejes del campo `Estado:`. Formato esperado: `Estado: móvil ✅ · escritorio ⬜`.
// El PRIMER eje es el que gobierna los conteos y la coherencia de dependencias.
// Para un proyecto de un solo eje: ['']  ->  `Estado: ✅`
const EJES = ['móvil', 'escritorio'];

// Sufijos de ticket hijo. Un `-FX` no bloquea el cierre de su padre.
const SUFIJOS = [];

// Agrupacion secundaria opcional, leida de un campo del ticket (p. ej. `Fase: C`).
// null para desactivarla.
const CAMPO_FASE = 'Fase';

// Bloqueos externos: curado A MANO, no derivado. Distingue, entre los 🟡,
// cuales ya estan construidos y verificados y solo esperan un dato o una
// decision, de cuales todavia tienen trabajo propio. Un ticket desaparece de
// aqui solo cuando su `Estado:` pasa a ✅.
const BLOQUEO_EXTERNO = {
  // 'APP-01': 'BASE-07 (catálogo real)',
  'T-01': 'el deploy a Vercel, que necesita la cuenta de César',
};

// ==== FIN CONFIG ============================================================

const DIR = path.join(__dirname, '..', 'docs', 'tickets');
const SALIDA = path.join(DIR, 'ESTADO.md');
const ICONO = { '✅': 'hecho', '🟡': 'en curso', '⬜': 'pendiente', '—': 'n/a' };
const EJE_PPAL = EJES[0];

const archivos = fs
  .readdirSync(DIR)
  .filter((f) => f.endsWith('.md') && f !== 'README.md' && f !== 'ESTADO.md' && !f.endsWith('-wip.md'))
  .sort();

const problemas = [];
const tickets = archivos.map((f) => {
  const txt = fs.readFileSync(path.join(DIR, f), 'utf8');
  const lineas = txt.split('\n');
  const id = f.replace(/\.md$/, '');

  const titulo = (lineas[0].match(/^#\s*[A-Z]+-[\w-]+\s*—\s*(.+)$/) || [, '(sin título)'])[1].trim();

  const campo = (n) => {
    const l = lineas.find((x) => x.startsWith(n + ':'));
    return l ? l.slice(n.length + 1).trim() : null;
  };

  for (const c of CAMPOS) if (campo(c) === null) problemas.push(`${id}: le falta el campo \`${c}:\``);

  const est = campo('Estado') || '';
  const estados = {};
  for (const eje of EJES) {
    const v = eje
      ? (est.match(new RegExp(eje + '\\s*(\\S+)')) || [, '?'])[1]
      : (est.trim().split(/\s+/)[0] || '?');
    estados[eje] = v;
    if (eje === EJE_PPAL && !ICONO[v]) problemas.push(`${id}: estado \`${eje || 'único'}\` ilegible (\`${v}\`)`);
  }

  const ambito = id.split('-')[0];
  if (!AMBITOS.includes(ambito)) problemas.push(`${id}: ámbito \`${ambito}\` fuera de los permitidos`);

  const deps = (campo('Depende de') || '')
    .split('·')
    .map((d) => (d.match(/\b([A-Z]+-\d+[a-z]?(?:-[A-Z]+)?)\b/) || [])[1])
    .filter(Boolean);

  const sufijo = SUFIJOS.find((s) => id.endsWith('-' + s)) || null;
  const fase = CAMPO_FASE ? campo(CAMPO_FASE) : null;
  if (CAMPO_FASE && !fase) problemas.push(`${id}: le falta el campo \`${CAMPO_FASE}:\``);

  return { id, archivo: f, titulo, ambito, fase, estados, principal: estados[EJE_PPAL], deps, sufijo };
});

// --- coherencia -------------------------------------------------------------
const porId = Object.fromEntries(tickets.map((t) => [t.id, t]));
for (const t of tickets) {
  for (const d of t.deps) {
    if (!porId[d]) problemas.push(`${t.id}: depende de \`${d}\`, que no existe`);
    else if (t.principal === '✅' && porId[d].principal !== '✅' && !porId[d].sufijo)
      problemas.push(`${t.id} está ✅ pero su dependencia \`${d}\` sigue en \`${porId[d].principal}\``);
  }
  if (t.sufijo && !porId[t.id.replace(new RegExp('-' + t.sufijo + '$'), '')])
    problemas.push(`${t.id}: es -${t.sufijo} pero no existe su ticket padre`);
}
for (const id of Object.keys(BLOQUEO_EXTERNO))
  if (!porId[id]) problemas.push(`BLOQUEO_EXTERNO cita \`${id}\`, que no existe — tabla desactualizada`);

// --- contar -----------------------------------------------------------------
const hechos = tickets.filter((t) => t.principal === '✅').length;
const curso = tickets.filter((t) => t.principal === '🟡').length;
const pend = tickets.filter((t) => t.principal === '⬜').length;
const grupos = CAMPO_FASE ? [...new Set(tickets.map((t) => t.fase).filter(Boolean))].sort() : AMBITOS;
const claveGrupo = (t) => (CAMPO_FASE ? t.fase : t.ambito);

// --- reporte ----------------------------------------------------------------
const pct = tickets.length ? Math.round((hechos / tickets.length) * 100) : 0;
let out = '';
const p = (s = '') => (out += s + '\n');

p('<!-- GENERADO por scripts/estado-tickets.js — NO editar a mano.');
p('     La fuente de verdad es el campo `Estado:` de cada ticket. -->');
p();
p('# Estado del backlog');
p();
p(`**${hechos} de ${tickets.length} tickets cerrados (${pct}%)** · ${curso} en curso · ${pend} pendientes`);
p();
p('Derivado leyendo `docs/tickets/*.md`. Para actualizarlo: `node scripts/estado-tickets.js --escribir`.');
p();
p(`| ${CAMPO_FASE || 'Ámbito'} | Total | Hechos | En curso | Pendientes |`);
p('|---|---|---|---|---|');
for (const g of grupos) {
  const del = tickets.filter((t) => claveGrupo(t) === g);
  if (!del.length) continue;
  const c = (i) => del.filter((t) => t.principal === i).length;
  p(`| \`${g}\` | ${del.length} | ${c('✅')} | ${c('🟡')} | ${c('⬜')} |`);
}
p(`| **Total** | **${tickets.length}** | **${hechos}** | **${curso}** | **${pend}** |`);
p();

if (hechos) {
  p('## Cerrados');
  p();
  p(`| Ticket | Título | ${EJES.filter(Boolean).join(' | ')} |`);
  p(`|---|---|${EJES.filter(Boolean).map(() => '---|').join('')}`);
  for (const t of tickets.filter((x) => x.principal === '✅'))
    p(`| [\`${t.id}\`](${t.archivo}) | ${t.titulo} | ${EJES.filter(Boolean).map((e) => t.estados[e]).join(' | ')} |`);
  p();
}

if (curso) {
  p('## En curso');
  p();
  const enCurso = tickets.filter((x) => x.principal === '🟡');
  const bucketA = enCurso.filter((t) => BLOQUEO_EXTERNO[t.id]);
  const bucketB = enCurso.filter((t) => !BLOQUEO_EXTERNO[t.id]);
  if (bucketA.length) {
    p(`### Construidos y verificados — solo falta un dato o decisión (${bucketA.length})`);
    p();
    for (const t of bucketA) p(`- [\`${t.id}\`](${t.archivo}) — ${t.titulo} · falta: ${BLOQUEO_EXTERNO[t.id]}`);
    p();
  }
  if (bucketB.length) {
    p(`### Falta trabajo propio por completar (${bucketB.length})`);
    p();
    for (const t of bucketB) p(`- [\`${t.id}\`](${t.archivo}) — ${t.titulo}`);
    p();
  }
}

p('## Pendientes');
p();
for (const g of grupos) {
  const del = tickets.filter((t) => claveGrupo(t) === g && t.principal === '⬜');
  if (!del.length) continue;
  p(`**\`${g}\`** — ${del.map((t) => `[\`${t.id}\`](${t.archivo})`).join(' · ')}`);
  p();
}

// Listos para tomar: pendientes cuyas dependencias estan todas cerradas.
const listos = tickets.filter(
  (t) => t.principal === '⬜' && t.deps.every((d) => porId[d] && porId[d].principal === '✅')
);
p('## Listos para tomar ahora');
p();
p(listos.length ? listos.map((t) => `[\`${t.id}\`](${t.archivo})`).join(' · ') : '_Ninguno: todo pendiente espera a otro ticket._');
p();

p('## Coherencia');
p();
if (problemas.length) {
  p(`⚠️ **${problemas.length} problema(s):**`);
  p();
  for (const x of problemas) p(`- ${x}`);
} else {
  p(`✅ Sin problemas: todos los tickets tienen los ${CAMPOS.length} campos, ámbito válido, dependencias que existen, y ningún ticket cerrado depende de uno abierto.`);
}
p();

if (process.argv.includes('--escribir')) {
  fs.writeFileSync(SALIDA, out);
  console.log(`Escrito ${path.relative(process.cwd(), SALIDA)}`);
}
console.log(out);
process.exit(problemas.length ? 1 : 0);
