import type { Metadata } from "next";

import { caballos } from "@/data/caballos";
import { aspectRatioDeBucket, bucketDeRatio, objectPositionDeFoto } from "@/data/imagen";

// Página de prueba de T-04 (Seam B). No es una pantalla del sitio: renderiza
// las 86 Fotos del Catálogo como marcadores en el `aspect-ratio` de su bucket
// asignado, para verificar LEYENDO EL DOM que ninguna sale con una proporción
// fuera de los 5 buckets permitidos. Sin fotos reales (no existen): cada hueco
// es un marcador que se ve como marcador.

export const metadata: Metadata = {
  title: "Prueba T-04 - bucket e object-position",
  robots: { index: false, follow: false },
};

const fotos = caballos.flatMap((caballo) =>
  caballo.fotos.map((foto) => ({ ...foto, caballo: caballo.id })),
);

export default function PruebaImagen() {
  return (
    <main style={{ padding: "var(--space-6)" }}>
      <h1 style={{ fontSize: "var(--text-xl)" }}>Prueba T-04 — {fotos.length} Fotos</h1>
      <p className="text-muted" style={{ fontSize: "var(--text-xs)", marginBlock: "var(--space-2)" }}>
        Cada marcador está en el <code>aspect-ratio</code> del bucket que{" "}
        <code>bucketDeRatio</code> asigna a partir del <code>ratio</code> medido. El punto oscuro
        se posiciona con <code>object-position</code> derivado de <code>focus</code>.
      </p>
      <ul
        className="grid gap-3"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(8rem, 1fr))", listStyle: "none", padding: 0 }}
      >
        {fotos.map((foto) => {
          const bucket = bucketDeRatio(foto.ratio);
          return (
            <li key={`${foto.caballo}-${foto.archivo}`}>
              <div
                data-foto
                data-archivo={foto.archivo}
                data-bucket={bucket}
                data-ratio-medido={foto.ratio}
                style={{
                  aspectRatio: aspectRatioDeBucket(bucket),
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-line)",
                  borderRadius: "var(--radius)",
                  position: "relative",
                }}
              >
                <span
                  aria-hidden
                  data-focus={objectPositionDeFoto(foto.focus)}
                  style={{
                    position: "absolute",
                    inset: 0,
                    display: "grid",
                    placeItems: "center",
                    objectPosition: objectPositionDeFoto(foto.focus),
                  }}
                >
                  <span
                    style={{
                      inlineSize: "1.5rem",
                      blockSize: "1.5rem",
                      borderRadius: "50%",
                      background: "var(--color-placeholder)",
                    }}
                  />
                </span>
              </div>
              <span className="text-muted" style={{ fontSize: "var(--text-xs)" }}>
                {foto.archivo} · {bucket}
              </span>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
