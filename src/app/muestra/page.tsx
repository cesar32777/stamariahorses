import type { Metadata } from "next";

// Página de muestra del sistema visual (T-06). No es una pantalla del sitio:
// es el espécimen que ejercita cada token de DESIGN.md para poder revisarlo en
// móvil real y escritorio. No lleva datos de caballos -- los textos de ejemplo
// se ven como ejemplo a propósito (prohibición dura: nada fabricado).

export const metadata: Metadata = {
  title: "Sistema visual - muestra",
  robots: { index: false, follow: false },
};

const COLORES = [
  { token: "--color-background", nombre: "background", uso: "fondo único del sitio" },
  { token: "--color-surface", nombre: "surface", uso: "banda tras foto contain" },
  { token: "--color-foreground", nombre: "foreground", uso: "tinta, 16.3:1" },
  { token: "--color-muted", nombre: "muted", uso: "texto secundario, 6.4:1" },
  { token: "--color-line", nombre: "line", uso: "filete de 1px" },
  { token: "--color-accent", nombre: "accent", uso: "único acento, 6.5:1" },
  { token: "--color-accent-strong", nombre: "accent-strong", uso: ":hover / :active" },
  { token: "--color-placeholder", nombre: "placeholder", uso: "marcador visible" },
] as const;

const TIPO = [
  { token: "--text-3xl", clase: "font-display font-bold", ej: "Rancho Santa Maria" },
  { token: "--text-2xl", clase: "font-display font-bold", ej: "Titulo de la Ficha" },
  { token: "--text-xl", clase: "font-display font-medium", ej: "Subtitulo de seccion" },
  { token: "--text-lg", clase: "font-text", ej: "Entradilla de un parrafo" },
  { token: "--text-base", clase: "font-text", ej: "Cuerpo de texto corrido" },
  { token: "--text-sm", clase: "font-text font-medium", ej: "Etiqueta de dato" },
  { token: "--text-xs", clase: "font-text", ej: "Catalogo / pie de foto" },
] as const;

const ESPACIO = [
  "--space-1",
  "--space-2",
  "--space-3",
  "--space-4",
  "--space-6",
  "--space-8",
  "--space-12",
  "--space-16",
  "--space-24",
] as const;

const BUCKETS = ["2:3", "3:4", "1:1", "4:3", "3:2"] as const;

function Seccion({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section
      className="mx-auto w-full border-t border-line"
      style={{
        maxWidth: "var(--content-max)",
        paddingBlock: "var(--space-section)",
        paddingInline: "var(--gutter)",
      }}
    >
      <h2 className="text-foreground" style={{ fontSize: "var(--text-xl)" }}>
        {titulo}
      </h2>
      <div style={{ marginBlockStart: "var(--space-8)" }}>{children}</div>
    </section>
  );
}

export default function Muestra() {
  return (
    <main>
      <header
        className="mx-auto w-full"
        style={{
          maxWidth: "var(--content-max)",
          paddingBlock: "var(--space-section)",
          paddingInline: "var(--gutter)",
        }}
      >
        <p
          className="font-text text-muted uppercase"
          style={{ fontSize: "var(--text-xs)", letterSpacing: "var(--tracking-eyebrow)" }}
        >
          Sistema visual
        </p>
        <h1
          className="text-foreground"
          style={{ fontSize: "var(--text-3xl)", marginBlockStart: "var(--space-3)" }}
        >
          Tokens, tipografia y color
        </h1>
        <p
          className="text-muted"
          style={{
            fontSize: "var(--text-lg)",
            maxWidth: "var(--measure)",
            marginBlockStart: "var(--space-4)",
          }}
        >
          Espécimen de T-06. Cada bloque de abajo ejercita un token definido en
          <code> DESIGN.md</code>. Se revisa en movil real y en escritorio.
        </p>
      </header>

      <Seccion titulo="Color">
        <ul
          className="grid gap-4"
          style={{ gridTemplateColumns: "repeat(auto-fill, minmax(14rem, 1fr))" }}
        >
          {COLORES.map((c) => (
            <li key={c.token} className="flex items-center gap-3">
              <span
                aria-hidden
                className="border border-line"
                style={{
                  inlineSize: "3rem",
                  blockSize: "3rem",
                  borderRadius: "var(--radius)",
                  background: `var(${c.token})`,
                  flexShrink: 0,
                }}
              />
              <span>
                <span
                  className="block font-text font-medium"
                  style={{ fontSize: "var(--text-sm)" }}
                >
                  {c.nombre}
                </span>
                <span className="block text-muted" style={{ fontSize: "var(--text-xs)" }}>
                  {c.uso}
                </span>
              </span>
            </li>
          ))}
        </ul>
      </Seccion>

      <Seccion titulo="Tipografia">
        <div className="grid gap-6">
          {TIPO.map((t) => (
            <div
              key={t.token}
              className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:gap-6"
            >
              <code className="text-muted" style={{ fontSize: "var(--text-xs)", minWidth: "8rem" }}>
                {t.token}
              </code>
              <span
                className={`${t.clase} text-foreground`}
                style={{
                  fontSize: `var(${t.token})`,
                  lineHeight:
                    t.token.includes("2xl") || t.token.includes("3xl")
                      ? "var(--leading-display)"
                      : "var(--leading-snug)",
                }}
              >
                {t.ej}
              </span>
            </div>
          ))}
          <p
            className="text-foreground"
            style={{
              maxWidth: "var(--measure)",
              fontSize: "var(--text-base)",
              lineHeight: "var(--leading-body)",
            }}
          >
            Parrafo de cuerpo a medida de lectura (65ch). La familia de texto es Satoshi; la de
            titulares, Cabinet Grotesk Display. El enfasis dentro de un titular se hace con{" "}
            <strong>bold</strong> o <em>italica</em> de la misma familia, nunca metiendo una serif.
          </p>
        </div>
      </Seccion>

      <Seccion titulo="Espaciado">
        <div className="flex flex-col gap-3">
          {ESPACIO.map((s) => (
            <div key={s} className="flex items-center gap-4">
              <code className="text-muted" style={{ fontSize: "var(--text-xs)", minWidth: "7rem" }}>
                {s}
              </code>
              <span
                aria-hidden
                style={{
                  blockSize: "1rem",
                  inlineSize: `var(${s})`,
                  background: "var(--color-accent)",
                  borderRadius: "2px",
                }}
              />
            </div>
          ))}
          <p
            className="text-muted"
            style={{ fontSize: "var(--text-xs)", marginBlockStart: "var(--space-2)" }}
          >
            El ritmo entre secciones de esta pagina es <code>--space-section</code>
            (fluida, 6rem a 10rem). El canal lateral es <code>--gutter</code>.
          </p>
        </div>
      </Seccion>

      <Seccion titulo="Radio (una sola escala)">
        <div className="flex flex-wrap items-end gap-6">
          <span
            aria-hidden
            className="border border-line bg-surface"
            style={{ inlineSize: "6rem", blockSize: "6rem", borderRadius: "var(--radius)" }}
          />
          <button
            type="button"
            className="font-text font-medium transition-colors"
            style={{
              background: "var(--color-accent)",
              color: "var(--color-on-accent)",
              borderRadius: "var(--radius)",
              paddingInline: "var(--space-6)",
              paddingBlock: "var(--space-3)",
              fontSize: "var(--text-base)",
              transitionTimingFunction: "var(--ease)",
              transitionDuration: "var(--duration)",
            }}
          >
            Llamar al rancho
          </button>
          <p className="text-muted" style={{ fontSize: "var(--text-xs)", maxWidth: "28ch" }}>
            El mismo <code>--radius</code> (10px) en la caja de imagen y en el control. Ni pastilla
            ni esquina viva.
          </p>
        </div>
      </Seccion>

      <Seccion titulo="Lista de datos (sin bordes ni tabla)">
        <dl className="grid gap-2" style={{ maxWidth: "32rem" }}>
          {["Etiqueta uno", "Etiqueta dos", "Etiqueta tres"].map((k) => (
            <div key={k} className="flex justify-between gap-6">
              <dt className="text-muted" style={{ fontSize: "var(--text-sm)" }}>
                {k}
              </dt>
              <dd className="font-medium text-foreground" style={{ fontSize: "var(--text-sm)" }}>
                Valor de ejemplo
              </dd>
            </div>
          ))}
        </dl>
      </Seccion>

      <Seccion titulo="Marcador de foto en los 5 buckets">
        <div className="flex flex-wrap gap-4">
          {BUCKETS.map((b) => (
            <figure key={b} className="flex flex-col gap-2">
              <div
                aria-hidden
                className="bg-surface"
                style={{
                  inlineSize: "9rem",
                  aspectRatio: b.replace(":", " / "),
                  borderRadius: "var(--radius)",
                  border: "1px solid var(--color-line)",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                <span
                  style={{
                    inlineSize: "60%",
                    aspectRatio: "1",
                    background: "var(--color-placeholder)",
                    borderRadius: "4px",
                  }}
                />
              </div>
              <figcaption className="text-muted" style={{ fontSize: "var(--text-xs)" }}>
                bucket {b}
              </figcaption>
            </figure>
          ))}
        </div>
        <p
          className="text-muted"
          style={{
            fontSize: "var(--text-xs)",
            marginBlockStart: "var(--space-4)",
            maxWidth: "var(--measure)",
          }}
        >
          El cuadro interior gris claro es el marcador: se ve como marcador, no como dato. El mapeo
          real de bucket a <code>aspect-ratio</code> es T-04.
        </p>
      </Seccion>
    </main>
  );
}
