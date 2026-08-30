import Link from "next/link";
import { notFound } from "next/navigation";

import { MarcadorDeFoto } from "@/components/MarcadorDeFoto";
import { getCaballoPorSlug, slugsPublicos } from "@/data/catalogo";

// Ficha del Caballo (T-03 la enrutó; T-08a le pone cuerpo). Este ticket
// construye dos bloques de la estructura tomada de la página del jet
// (PLAN §1.5): la miga de pan y el hero partido 50/50.
//
// El hero: caja casi cuadrada a la izquierda con la foto CONTENIDA (no
// recortada), nombre y lista `etiqueta : valor` a la derecha. La caja con
// `contain` resuelve RF12 por construcción -- una hero vertical y una
// horizontal caben sin recorte en la misma caja -- y ya está validada sobre
// los 14 caballos en `prototipo/ficha-proto.html`. No sustituir por un `cover`
// con `object-position`.
//
// Lo que NO es de T-08a: el borrado real de campos vacíos (T-09 -- hoy las
// filas van como placeholder visible "pendiente"), la Galería (T-08b), el
// bloque de descripción, "otros caballos" y el contacto (T-10).

export const dynamicParams = false;

export function generateStaticParams() {
  return slugsPublicos().map((slug) => ({ slug }));
}

// Los 5 campos del hero (DOCUMENTO-FUNDACIONAL §4). `descripcion` no está: es
// texto libre y tiene bloque propio (PLAN §1.5), no cabe en esta lista.
// Hoy los 5 son `null` en `data/caballos.json`; se renderizan como placeholder
// que SE VE como placeholder ("pendiente"), no se inventa el dato. La lógica de
// "campo ausente desaparece" es T-09.
const CAMPOS_HERO = ["Sexo", "Nacimiento", "Raza", "Capa", "Alzada"] as const;

// Los buckets verticales: la foto se contiene por su alto y deja banda a los
// lados. Los demás (1:1, 4:3, 3:2) se contienen por el ancho.
const BUCKETS_VERTICALES = new Set(["2:3", "3:4"]);

export default async function FichaCaballo({ params }: PageProps<"/caballos/[slug]">) {
  const { slug } = await params;
  const caballo = getCaballoPorSlug(slug);

  if (!caballo) {
    notFound();
  }

  const hero = caballo.fotos.find((foto) => foto.hero) ?? caballo.fotos[0];
  const esVertical = BUCKETS_VERTICALES.has(hero.bucket);

  // `contain` dentro de la caja flex-centrada: la foto toma el lado que le
  // toque y el otro se ajusta por su `aspect-ratio` (el del bucket real, que
  // `MarcadorDeFoto` ya fija). Sin recorte porque la caja interior ES la
  // proporción del bucket.
  const contener = esVertical
    ? { blockSize: "100%", inlineSize: "auto", maxInlineSize: "100%", borderRadius: "0" }
    : { inlineSize: "100%", blockSize: "auto", maxBlockSize: "100%", borderRadius: "0" };

  return (
    <main className="flex-1">
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: "var(--content-max)",
          paddingInline: "var(--gutter)",
          paddingBlock: "var(--space-16)",
        }}
      >
        <nav
          aria-label="Miga de pan"
          className="text-muted"
          style={{ fontSize: "var(--text-xs)" }}
        >
          <Link href="/" className="hover:text-foreground">
            Catálogo
          </Link>
          <span aria-hidden="true" style={{ marginInline: "var(--space-2)" }}>
            ›
          </span>
          <span className="text-foreground">{caballo.nombre}</span>
        </nav>

        <div className="ficha-hero" style={{ marginBlockStart: "var(--space-12)" }}>
          <div className="ficha-hero__caja">
            <MarcadorDeFoto
              bucket={hero.bucket}
              focus={hero.focus}
              sizes="(min-width: 768px) 50vw, 100vw"
              style={contener}
            />
          </div>

          <div>
            <h1
              className="text-foreground"
              style={{ fontSize: "var(--text-2xl)", marginBlockEnd: "var(--space-8)" }}
            >
              {caballo.nombre}
            </h1>

            <dl className="ficha-datos">
              {CAMPOS_HERO.map((etiqueta) => (
                <div key={etiqueta} className="ficha-datos__fila">
                  <dt>{etiqueta}</dt>
                  <dd>pendiente</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </main>
  );
}
