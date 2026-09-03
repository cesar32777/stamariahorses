import Image from "next/image";
import Link from "next/link";

import { hrefTelefono } from "@/components/Contacto";
import { datosDeEjemplo, vendedor } from "@/data/catalogo";

// T-23 -- el hero de la portada, con la estructura de la portada de la
// referencia: foto a sangre, la barra encima, titular serif grande a la
// izquierda, párrafo corto y dos botones a la derecha.
//
// Reabre PLAN §1.5 bloque 1 ("no hay hero separado, escribir copy ahí sería
// inventar") a pedido explícito de César, con la captura de la referencia a la
// vista. El copy es de muestra y va bajo el mismo flag `ejemplo` que los datos.
//
// NO lleva cifras inventadas. La referencia usa una ("+ de 30 ans") y aquí eso
// sería fabricar un hecho del rancho, que es otra cosa que fabricar un dato de
// catálogo marcado como muestra.

/** Copy de muestra. Se reemplaza cuando César dé el texto real (T-15). */
const TITULAR = "Caballos criados para el trabajo, no para la foto";
const ENTRADA =
  "Rancho Santa María, en Monterrey, Nuevo León. El catálogo completo está aquí abajo; para preguntar por alguno, la conversación empieza con una llamada.";

/** Ancla del grid, para el CTA secundario. */
export const ID_CATALOGO = "catalogo";

export function HeroPortada() {
  const { telefono } = vendedor;

  return (
    <section className="hero" aria-labelledby="hero-titulo">
      <Image
        src="/hero/hero-caballo.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        className="hero__foto"
      />
      {/* Dos capas: un degradado de izquierda a derecha que protege el titular y
          uno de abajo hacia arriba que protege la columna de la derecha. Con una
          sola capa el centro de la foto se come el texto. */}
      <span className="hero__scrim" aria-hidden="true" />

      <div className="hero__interior">
        <h1 id="hero-titulo" className="hero__titular">
          {TITULAR}
        </h1>

        <div className="hero__columna">
          {datosDeEjemplo && <p className="hero__marca">Texto y foto de ejemplo</p>}

          <p className="hero__entrada">{ENTRADA}</p>

          <div className="hero__acciones">
            {/* Primario: el número, no una etiqueta. Es dato, así que no compite
                con `CONTACTO_ETIQUETA` (la regla de una etiqueta por intención
                de la skill). Sale de `vendedor`, no escrito a mano. */}
            {telefono != null && (
              <a className="hero__boton" href={hrefTelefono(telefono)}>
                {telefono}
              </a>
            )}
            {/* Secundario: otra intención (mirar, no contactar). */}
            <Link className="hero__boton hero__boton--fantasma" href={`#${ID_CATALOGO}`}>
              Ver los caballos
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
