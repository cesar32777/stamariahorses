// Gate del baseline del linter (T-16).
//
// Corre ESLint con el formatter `json`, cuenta errores y warnings reales, y los compara contra
// `.lint-baseline.json`. Sale con código 1 SOLO si el conteo empeora: sube el total de errores,
// sube el de warnings, o aparece una regla que no estaba en el baseline. Que baje no es un fallo
// (bajar el baseline a mano es una decisión aparte, ver T-16.md).
//
// Uso: npm run lint:baseline

import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import path from "node:path";

const repoRoot = process.cwd();

function leerBaseline() {
  const raw = readFileSync(path.join(repoRoot, ".lint-baseline.json"), "utf-8");
  return JSON.parse(raw);
}

function correrEslint() {
  // ESLint sale con código 1 si hay errores y 2 si hay un fallo fatal de configuración.
  // No usamos ese código para decidir nada aquí: solo nos importa el JSON que imprimió a stdout.
  const resultado = spawnSync("eslint", ["--format", "json"], {
    cwd: repoRoot,
    encoding: "utf-8",
    shell: true,
  });

  if (resultado.error) {
    console.error("No se pudo ejecutar ESLint:", resultado.error.message);
    process.exit(2);
  }

  const stdout = resultado.stdout ?? "";
  // El formatter json puede compartir stdout con otra salida (deprecation notices, etc.).
  // No asumimos que stdout es JSON puro: recortamos desde el primer '[' hasta el último ']'.
  const inicio = stdout.indexOf("[");
  const fin = stdout.lastIndexOf("]");
  if (inicio === -1 || fin === -1 || fin < inicio) {
    console.error("ESLint no devolvió JSON parseable. Salida cruda:");
    console.error(stdout);
    if (resultado.stderr) console.error(resultado.stderr);
    process.exit(2);
  }

  try {
    return JSON.parse(stdout.slice(inicio, fin + 1));
  } catch (e) {
    console.error("No se pudo parsear el JSON de ESLint:", e.message);
    process.exit(2);
  }
}

function rutaRelativa(filePath) {
  return path.relative(repoRoot, filePath).split(path.sep).join("/");
}

function analizar(resultadosEslint) {
  let totalErrors = 0;
  let totalWarnings = 0;
  // key = `${archivo}::${regla}::${severidad}` -> conteo
  const conteos = new Map();
  // set de reglas vistas, con un ejemplo de archivo para el mensaje
  const reglasVistas = new Map();

  for (const fileResult of resultadosEslint) {
    const archivo = rutaRelativa(fileResult.filePath);
    for (const msg of fileResult.messages ?? []) {
      const esError = msg.severity === 2;
      if (esError) totalErrors += 1;
      else totalWarnings += 1;

      const regla = msg.ruleId ?? "(sin regla / error de parseo)";
      const key = `${archivo}::${regla}::${esError ? "error" : "warning"}`;
      conteos.set(key, (conteos.get(key) ?? 0) + 1);

      if (!reglasVistas.has(regla)) reglasVistas.set(regla, archivo);
    }
  }

  return { totalErrors, totalWarnings, conteos, reglasVistas };
}

function main() {
  const baseline = leerBaseline();
  const baselineReglas = new Set(baseline.porArchivo.map((x) => x.regla));
  // Conteo base de errores por archivo+regla, para poder nombrar qué subió.
  const baselineErroresPorClave = new Map();
  for (const entry of baseline.porArchivo) {
    baselineErroresPorClave.set(`${entry.archivo}::${entry.regla}::error`, entry.errors);
  }

  const resultadosEslint = correrEslint();
  const { totalErrors, totalWarnings, conteos, reglasVistas } = analizar(resultadosEslint);

  const razones = [];

  if (totalErrors > baseline.totalErrors) {
    for (const [key, count] of conteos) {
      if (!key.endsWith("::error")) continue;
      const base = baselineErroresPorClave.get(key) ?? 0;
      if (count > base) {
        const [archivo, regla] = key.split("::");
        razones.push(
          `Errores subieron en ${archivo} (${regla}): ${count} ahora vs. ${base} en baseline.`,
        );
      }
    }
    if (razones.length === 0) {
      razones.push(
        `Total de errores subió de ${baseline.totalErrors} a ${totalErrors}, pero no se pudo aislar el archivo/regla exactos.`,
      );
    }
  }

  if (totalWarnings > baseline.totalWarnings) {
    for (const [key, count] of conteos) {
      if (!key.endsWith("::warning")) continue;
      const [archivo, regla] = key.split("::");
      razones.push(`Warnings nuevos en ${archivo} (${regla}): ${count}.`);
    }
    if (razones.length === 0) {
      razones.push(
        `Total de warnings subió de ${baseline.totalWarnings} a ${totalWarnings}, pero no se pudo aislar el archivo/regla exactos.`,
      );
    }
  }

  for (const [regla, archivoEjemplo] of reglasVistas) {
    if (!baselineReglas.has(regla)) {
      razones.push(`Regla nueva, no estaba en el baseline: ${regla} (visto en ${archivoEjemplo}).`);
    }
  }

  if (razones.length > 0) {
    console.error("lint:baseline FALLÓ. El conteo empeoró respecto a .lint-baseline.json:");
    for (const r of razones) console.error(`  - ${r}`);
    console.error(
      `\nTotales: ${totalErrors} errores (baseline ${baseline.totalErrors}), ${totalWarnings} warnings (baseline ${baseline.totalWarnings}).`,
    );
    process.exit(1);
  }

  console.log(
    `lint:baseline OK. ${totalErrors} errores (baseline ${baseline.totalErrors}), ${totalWarnings} warnings (baseline ${baseline.totalWarnings}).`,
  );
  process.exit(0);
}

main();
