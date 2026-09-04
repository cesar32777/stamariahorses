import { MarcadorDeFoto } from "@/components/MarcadorDeFoto";
import { rutaDeFoto } from "@/data/imagen";
import type { Foto } from "@/data/schema";

// T-08b — la Galería de la Ficha. El único bloque sin equivalente en la página
// del jet (PLAN §1.5, §1.7): el jet tiene 2 fotos fijas en 3:2, un Caballo tiene
// de 5 a 9 en 5 buckets mezclados. Estrategia B, elegida por el prototipo:
// columnas tipo masonry, CADA foto en su bucket real, sin un segundo recorte.
// El par 2-up fijo (modo A) está medido y descartado -- no lo reintentes.
//
// Móvil (< 768px): la masonry a 1 columna deja al Caballo 08 (9 fotos) con
// ~5700px de página. Decisión de César dentro de este ticket: en móvil la
// Galería es un carrusel horizontal con `scroll-snap` nativo -- fotos grandes,
// una pantalla de alto, gesto nativo. Todo el comportamiento vive en CSS
// (`.ficha-galeria` en globals.css); aquí no hay estado ni JS.
//
// Escritorio: `column-count` como base (fallback obligado, el soporte de
// masonry nativo sigue partido entre motores) con upgrade a grid masonry por
// `@supports` donde exista, que es lo que da orden de tabulación lógico.

type GaleriaProps = {
  /** Todas las Fotos del Caballo. El hero se excluye aquí (ya va en T-08a). */
  fotos: readonly Foto[];
  hero: Foto;
  caballoId?: string;
  nombreCaballo?: string;
};

export function Galeria({ fotos, hero, caballoId, nombreCaballo }: GaleriaProps) {
  const resto = fotos.filter((foto) => foto !== hero);

  if (resto.length === 0) {
    return null;
  }

  return (
    <section style={{ marginBlockStart: "var(--space-section)" }}>
      {/* T-21: era caja alta con `--tracking-eyebrow`, o sea un segundo
          eyebrow, y el presupuesto del sitio es UNO (se gasta en la Ficha).
          Baja a titular normal en Playfair. */}
      <h2
        className="text-foreground"
        style={{ fontSize: "var(--text-xl)", marginBlockEnd: "var(--space-6)" }}
      >
        Galería
      </h2>

      <div className="ficha-galeria">
        {resto.map((foto, i) => (
          <div key={foto.archivo ?? i} className="ficha-galeria__item">
            <MarcadorDeFoto
              bucket={foto.bucket}
              focus={foto.focus}
              src={caballoId ? rutaDeFoto(caballoId, foto.archivo) : null}
              alt={nombreCaballo ? `Foto de ${nombreCaballo} (${i + 1})` : "Foto del caballo"}
              sizes="(min-width: 1200px) 30vw, (min-width: 768px) 45vw, 82vw"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
