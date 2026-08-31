import Link from "next/link";
import { notFound } from "next/navigation";

import { Contacto } from "@/components/Contacto";
import { Galeria } from "@/components/Galeria";
import { MarcadorDeFoto } from "@/components/MarcadorDeFoto";
import { getCaballoPorSlug, slugsPublicos } from "@/data/catalogo";
import type { Caballo } from "@/data/schema";

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
// Lo que NO es de T-09: la Galería (T-08b, ya hecha), el bloque de descripción,
// "otros caballos" y el contacto (T-10).

export const dynamicParams = false;

export function generateStaticParams() {
  return slugsPublicos().map((slug) => ({ slug }));
}

// T-09 -- Principio 2: un dato ausente DESAPARECE. La lista `<dl>` se arma solo
// con los campos presentes; si no hay ninguno, no se rinde el `<dl>` (ni "N/A",
// ni guion, ni etiqueta huérfana, ni hueco de espaciado). `descripcion` no
// entra aquí: es texto libre con bloque propio (PLAN §1.5, T-10).
//
// La edad se CALCULA desde `nacimiento`, nunca se guarda (así no queda vieja).
// Unidad de `alzada`: metros a la cruz (alzada en m es la convención en español
// ecuestre); si el dato real llega en otra unidad, se corrige aquí y en T-11.
const AÑO_ACTUAL = new Date().getFullYear();

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

function filasDeDatos(caballo: Caballo): Array<{ etiqueta: string; valor: string }> {
  const filas: Array<{ etiqueta: string; valor: string }> = [];

  if (caballo.sexo) {
    filas.push({ etiqueta: "Sexo", valor: capitalizar(caballo.sexo) });
  }
  if (caballo.nacimiento != null) {
    const edad = AÑO_ACTUAL - caballo.nacimiento;
    filas.push({ etiqueta: "Edad", valor: edad === 1 ? "1 año" : `${edad} años` });
  }
  if (caballo.raza) {
    filas.push({ etiqueta: "Raza", valor: caballo.raza });
  }
  if (caballo.capa) {
    filas.push({ etiqueta: "Capa", valor: caballo.capa });
  }
  if (caballo.alzada != null) {
    filas.push({ etiqueta: "Alzada", valor: `${caballo.alzada} m` });
  }

  return filas;
}

// Los buckets verticales: la foto se contiene por su alto y deja banda a los
// lados. Los demás (1:1, 4:3, 3:2) se contienen por el ancho.
const BUCKETS_VERTICALES = new Set(["2:3", "3:4"]);

export default async function FichaCaballo({ params }: PageProps<"/caballos/[slug]">) {
  const { slug } = await params;
  const caballo = getCaballoPorSlug(slug);

  if (!caballo) {
    notFound();
  }

  const filas = filasDeDatos(caballo);
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
    <>
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
                style={{
                  fontSize: "var(--text-2xl)",
                  marginBlockEnd: filas.length > 0 ? "var(--space-8)" : "0",
                }}
              >
                {caballo.nombre}
              </h1>

              {filas.length > 0 && (
                <dl className="ficha-datos">
                  {filas.map(({ etiqueta, valor }) => (
                    <div key={etiqueta} className="ficha-datos__fila">
                      <dt>{etiqueta}</dt>
                      <dd>{valor}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>

          <Galeria fotos={caballo.fotos} hero={hero} />
        </div>
      </main>
      <Contacto />
    </>
  );
}
