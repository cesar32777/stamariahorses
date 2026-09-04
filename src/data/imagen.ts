// RF11, RF13 (PLAN-TICKETS.md §3): traduce una Foto a su proporción de render y
// su `object-position`. Es la única lógica con aritmética real del proyecto —
// 78 ratios distintos comprimidos a 5 buckets sobre 86 fotos — y el único sitio
// donde un error no se ve como error, sino como una foto un poco rara que nadie
// revisa. Tuvo tests hasta el 2026-09-04; hoy se mira en `/prueba-imagen`.

/** Los 5 buckets del Catálogo, del más vertical al más apaisado (CONTEXT.md). */
export const BUCKETS = ["2:3", "3:4", "1:1", "4:3", "3:2"] as const;

export type Bucket = (typeof BUCKETS)[number];

const RATIO_DE_BUCKET: Record<Bucket, number> = {
  "2:3": 2 / 3,
  "3:4": 3 / 4,
  "1:1": 1,
  "4:3": 4 / 3,
  "3:2": 3 / 2,
};

/**
 * El bucket de los 5 más cercano al `ratio` (ancho / alto) de una Foto.
 * La cercanía se mide en escala logarítmica: la frontera entre dos buckets es
 * su media geométrica, no la aritmética. Así es como se midió `bucket` en
 * `data/caballos.json` — dos Fotos de ratio ~0.708 caen en 3:4 (0.75), no en
 * 2:3 (0.667), aunque en distancia lineal 2:3 quede un pelo más cerca.
 */
export function bucketDeRatio(ratio: number): Bucket {
  let elegido: Bucket = BUCKETS[0];
  let menorDistancia = Infinity;
  for (const bucket of BUCKETS) {
    const distancia = Math.abs(Math.log(RATIO_DE_BUCKET[bucket]) - Math.log(ratio));
    if (distancia < menorDistancia) {
      menorDistancia = distancia;
      elegido = bucket;
    }
  }
  return elegido;
}

/**
 * El valor CSS `aspect-ratio` de un bucket: `"3:2"` → `"3 / 2"`. Se usa para
 * fijar la proporción del hueco antes de que cargue la Foto (RF7), y con el
 * bucket real garantiza que la Foto no se recorte una segunda vez.
 */
export function aspectRatioDeBucket(bucket: Bucket): string {
  return bucket.replace(":", " / ");
}

/**
 * El `object-position` de una Foto a partir de su `focus`. Sin `focus`
 * (ausente, `null` o vacío) el default es `"center"` (RF13). Los valores de
 * `focus` son sintaxis CSS de `object-position` tal cual (`"center"`, `"top"`,
 * `"50% 30%"`); el reencuadre fino de las 7 fotos con más recorte es T-12.
 */
export function objectPositionDeFoto(focus: string | null | undefined): string {
  const valor = focus?.trim();
  return valor ? valor : "center";
}
