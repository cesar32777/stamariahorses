import { Contacto } from "@/components/Contacto";
import { GridCatalogo } from "@/components/GridCatalogo";
import { HeroPortada, ID_CATALOGO } from "@/components/HeroPortada";
import { caballosPublicos } from "@/data/catalogo";

// El Catálogo (solo Disponibles, Retirados ya filtrados) llega de la capa de
// acceso de T-03. El grid es T-07 (`GridCatalogo`).
const EN_CATALOGO = caballosPublicos.length;

// T-23 -- la portada abre con el hero a sangre (foto + titular + CTA) y el grid
// empieza debajo.
//
// El encabezado de texto que había aquí (nombre del sitio en `<h1>`, regla, línea
// de conteo, CTA) SE FUE: el nombre del sitio ya está en la barra y el titular
// ahora está en el hero. Los tres a la vez eran ruido, y dos `<h1>` en la misma
// página está mal. El `<h1>` de la portada es el del hero.
//
// Queda solo la línea de conteo como rótulo del grid, que sí informa.
export default function Home() {
  return (
    <>
      <main className="flex-1">
        <HeroPortada />

        <section
          id={ID_CATALOGO}
          className="catalogo-ancla mx-auto w-full"
          aria-labelledby="catalogo-titulo"
          style={{
            maxWidth: "var(--content-wide)",
            paddingInline: "var(--gutter)",
            paddingBlockStart: "var(--space-16)",
            paddingBlockEnd: "var(--space-section)",
          }}
        >
          <h2
            id="catalogo-titulo"
            className="text-foreground"
            style={{ fontSize: "var(--text-xl)" }}
          >
            El catálogo
          </h2>
          <p
            className="text-muted"
            style={{
              fontSize: "var(--text-base)",
              marginBlockStart: "var(--space-6)",
              marginBlockEnd: "var(--space-8)",
            }}
          >
            {EN_CATALOGO} caballos disponibles.
          </p>

          <GridCatalogo />
        </section>
      </main>
      <Contacto />
    </>
  );
}
