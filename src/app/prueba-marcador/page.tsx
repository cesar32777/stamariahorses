import type { Metadata } from "next";

import { MarcadorDeFoto } from "@/components/MarcadorDeFoto";
import { BUCKETS } from "@/data/imagen";

// Página de prueba de T-05. No es una pantalla del sitio: apila varios
// `MarcadorDeFoto` en una columna (como la galería en móvil) con un pie medible
// debajo, para verificar que sustituir el marcador por una foto real no mueve
// nada (CLS = 0 antes y después).
//
//   /prueba-marcador        → todos los marcadores vacíos ("sin foto")
//   /prueba-marcador?foto=1 → los mismos, con la foto de prueba cargada
//
// La caja está dimensionada por `aspect-ratio`, no por la imagen: el alto de
// cada marcador y la Y del pie deben ser idénticos entre las dos variantes.

export const metadata: Metadata = {
  title: "Prueba T-05 - marcador de posición",
  robots: { index: false, follow: false },
};

// 6 huecos cubriendo los 5 buckets (el primero se repite al final).
const HUECOS = [...BUCKETS, BUCKETS[0]] as const;

export default async function PruebaMarcador({
  searchParams,
}: {
  searchParams: Promise<{ foto?: string }>;
}) {
  const { foto } = await searchParams;
  const conFoto = foto === "1";

  return (
    <main style={{ maxWidth: "420px", margin: "0 auto", padding: "var(--space-6)" }}>
      <h1 style={{ fontSize: "var(--text-xl)" }}>Prueba T-05 — marcador</h1>
      <p
        className="text-muted"
        style={{ fontSize: "var(--text-xs)", marginBlock: "var(--space-2) var(--space-6)" }}
      >
        Estado: <strong>{conFoto ? "con foto de prueba" : "sin foto"}</strong>. La caja se
        dimensiona por <code>aspect-ratio</code> del bucket; el alto no depende de la imagen.
      </p>

      <div className="flex flex-col" style={{ gap: "var(--space-4)" }}>
        {HUECOS.map((bucket, i) => (
          <MarcadorDeFoto
            key={`${bucket}-${i}`}
            bucket={bucket}
            src={conFoto ? "/prueba/probe.webp" : null}
            alt={conFoto ? "Imagen de prueba" : ""}
            sizes="420px"
          />
        ))}
      </div>

      <footer
        data-fin
        className="text-muted"
        style={{
          marginBlockStart: "var(--space-8)",
          paddingBlockStart: "var(--space-4)",
          borderBlockStart: "1px solid var(--color-line)",
          fontSize: "var(--text-xs)",
        }}
      >
        Pie de página — su posición Y no debe cambiar al pasar de sin foto a con foto.
      </footer>
    </main>
  );
}
