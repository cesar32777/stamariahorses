/* eslint-disable @typescript-eslint/no-require-imports */
/**
 * Comprime a WebP (misma resolucion) las fotos crudas en extraidas/caballos.
 * Salida: extraidas/caballos-comprimidas/. No toca los PNG originales.
 * Uso: node scripts/comprimir-fotos-extraidas.js
 */
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = path.resolve(__dirname, "..", "extraidas", "caballos");
const DEST = path.resolve(__dirname, "..", "extraidas", "caballos-comprimidas");

fs.mkdirSync(DEST, { recursive: true });

const files = fs.readdirSync(SRC).filter((f) => f.toLowerCase().endsWith(".png"));

(async () => {
  let totalIn = 0;
  let totalOut = 0;
  for (const f of files) {
    const srcPath = path.join(SRC, f);
    const destPath = path.join(DEST, f.replace(/\.png$/i, ".webp"));
    const inSize = fs.statSync(srcPath).size;

    const img = sharp(srcPath);
    const meta = await img.metadata();
    await img.webp({ quality: 85 }).toFile(destPath);

    const outSize = fs.statSync(destPath).size;
    totalIn += inSize;
    totalOut += outSize;
    console.log(
      `${f} -> ${path.basename(destPath)}  ${meta.width}x${meta.height}  ${(inSize / 1024 / 1024).toFixed(2)}MB -> ${(outSize / 1024 / 1024).toFixed(2)}MB`
    );
  }
  console.log("---");
  console.log(
    `Total: ${(totalIn / 1024 / 1024).toFixed(1)}MB -> ${(totalOut / 1024 / 1024).toFixed(1)}MB (${files.length} archivos)`
  );
})();
