import { Contacto } from "@/components/Contacto";
import { GridCatalogo } from "@/components/GridCatalogo";
import { caballosPublicos } from "@/data/catalogo";

const SITE_NAME = "Santa Maria Performance Horses";

// El Catálogo (solo Disponibles, Retirados ya filtrados) llega de la capa de
// acceso de T-03. El grid real es T-07 (`GridCatalogo`).
const EN_CATALOGO = caballosPublicos.length;

export default function Home() {
  return (
    <>
      <main className="flex-1">
        <header
          className="mx-auto w-full"
          style={{
            maxWidth: "var(--content-max)",
            paddingBlock: "var(--space-section)",
            paddingInline: "var(--gutter)",
          }}
        >
          <h1 className="text-foreground" style={{ fontSize: "var(--text-3xl)" }}>
            {SITE_NAME}
          </h1>
          <p
            className="text-muted"
            style={{ fontSize: "var(--text-lg)", marginBlockStart: "var(--space-4)" }}
          >
            {EN_CATALOGO} caballos disponibles.
          </p>
        </header>

        <section
          className="mx-auto w-full"
          style={{
            maxWidth: "var(--content-max)",
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
