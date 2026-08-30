import { describe, expect, it } from "vitest";

import catalogo from "../../data/caballos.json";
import { BUCKETS, bucketDeRatio, objectPositionDeFoto } from "./imagen";

const todasLasFotos = catalogo.caballos.flatMap((caballo) => caballo.fotos);

// Seam B (PLAN-TICKETS.md §3) — el único seam con tests acordado. Rebanadas
// verticales, una a la vez: cada `it` se escribe rojo antes de tocar `imagen.ts`.
// El valor esperado NO se recalcula aquí con la fórmula del código: sale de
// `data/caballos.json`, medido antes de que existiera el render (gotcha: no
// testear contra un valor que el propio test calcula).

describe("Seam B — bucket de una Foto", () => {
  // Ciclo 1: caballo-01-1.webp trae ratio 1.4988 y bucket "3:2" en el dato.
  it("asigna una Foto de ratio 1.4988 al bucket 3:2", () => {
    expect(bucketDeRatio(1.4988)).toBe("3:2");
  });

  // Ciclo 2: ninguna de las 86 Fotos sale con una proporción fuera de los 5
  // buckets, y el bucket asignado coincide con el medido en el dato.
  it("asigna cada una de las 86 Fotos al bucket que trae el dato", () => {
    expect(todasLasFotos).toHaveLength(86);
    for (const foto of todasLasFotos) {
      const asignado = bucketDeRatio(foto.ratio);
      expect(BUCKETS).toContain(asignado);
      expect(asignado, `Foto ${foto.archivo} (ratio ${foto.ratio})`).toBe(foto.bucket);
    }
  });
});

describe("Seam B — object-position de una Foto", () => {
  // Ciclo 3: una Foto sin `focus` rinde "center".
  it("rinde center cuando la Foto no trae focus", () => {
    expect(objectPositionDeFoto(null)).toBe("center");
  });

  it("respeta el focus de la Foto cuando lo trae", () => {
    expect(objectPositionDeFoto("top")).toBe("top");
  });
});
