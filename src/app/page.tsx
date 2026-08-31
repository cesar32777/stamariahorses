import Link from "next/link";

import { CONTACTO_ETIQUETA, Contacto } from "@/components/Contacto";
import { GridCatalogo } from "@/components/GridCatalogo";
import { caballosPublicos } from "@/data/catalogo";

const SITE_NAME = "Santa María Performance Horses";

// El Catálogo (solo Disponibles, Retirados ya filtrados) llega de la capa de
// acceso de T-03. El grid es T-07 (`GridCatalogo`).
const EN_CATALOGO = caballosPublicos.length;

// T-20 (ADR-0004 §2) -- la portada pasa a todo el ancho y el encabezado baja de
// altura, para que la barra Y la primera fila de tarjetas quepan juntas arriba
// del pliegue a 1440x900. Antes abría con `--space-section` (hasta 160px) y la
// primera foto casi no se veía.
//
// El nombre del sitio se queda como `<h1>` aunque la barra ya lo lleve: PLAN
// §1.5 bloque 1 lo fijó y es una decisión cerrada del backlog. Queda anotado
// que es una repetición (marca chica arriba, marca grande abajo); si César
// quiere cambiarlo por un título de sección ("Caballos"), es otro ticket.
export default function Home() {
  return (
    <>
      <main className="flex-1">
        <header
          className="mx-auto w-full"
          style={{
            maxWidth: "var(--content-wide)",
            paddingBlockStart: "var(--space-12)",
            paddingBlockEnd: "var(--space-8)",
            paddingInline: "var(--gutter)",
          }}
        >
          <h1 className="text-foreground" style={{ fontSize: "var(--text-3xl)" }}>
            {SITE_NAME}
          </h1>
          <span className="regla-acento" aria-hidden="true" />
          <p
            className="text-muted"
            style={{ fontSize: "var(--text-lg)", marginBlockStart: "var(--space-6)" }}
          >
            {EN_CATALOGO} caballos disponibles.
          </p>

          {/* La etiqueta es `CONTACTO_ETIQUETA`, la misma de la barra y del pie:
              tres CTA con la misma intención y etiquetas distintas es un fallo
              de la skill. La flecha es decoración, no parte de la etiqueta. */}
          <Link
            href="/contacto"
            className="enlace-cta"
            style={{ marginBlockStart: "var(--space-6)" }}
          >
            {CONTACTO_ETIQUETA}
            <span aria-hidden="true" className="enlace-cta__flecha">
              ↗
            </span>
          </Link>
        </header>

        <section
          className="mx-auto w-full"
          style={{
            maxWidth: "var(--content-wide)",
            paddingInline: "var(--gutter)",
            paddingBlockEnd: "var(--space-section)",
          }}
        >
          <GridCatalogo />
        </section>
      </main>
      <Contacto />
    </>
  );
}
