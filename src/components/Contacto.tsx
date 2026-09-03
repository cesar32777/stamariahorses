import Image from "next/image";
import Link from "next/link";

import { datosDeEjemplo, vendedor } from "@/data/catalogo";

// Pie del sitio (T-10, reconstruido en T-24 con la estructura del pie de la
// referencia): banda de foto con el CTA encima, logotipo gigante a todo el
// ancho, filete, y fila de abajo con los datos a la izquierda y la navegación a
// la derecha. Idéntico en las tres plantillas: portada, Ficha y `/contacto`.
//
// El recorrido del Interesado termina FUERA del sitio: no hay carrito, ni
// cotización, ni formulario. Solo `tel:` y `mailto:` del rancho.
//
// El Vendedor es el rancho, no una persona (CONTEXT.md, cerrado 2026-08-29):
// nada de nombre propio en el llamado a la acción.
//
// Lo que la referencia tiene aquí y este pie NO lleva, porque no existe y
// fabricarlo está prohibido: iconos de redes sociales, crédito de agencia,
// aviso legal y política de privacidad (serían enlaces a páginas que no hay).
//
// UNA sola etiqueta para toda la intención de contacto del sitio. Esa etiqueta
// es `CONTACTO_ETIQUETA`, y este componente es su único dueño.
//
// Tres estados: sin dato -> marcador "Sin publicar"; dato de ejemplo -> enlaces
// más la marca a la vista; dato real -> enlaces, sin marca.

/** El Vendedor es el rancho, no una persona (CONTEXT.md). */
export const ORIGEN = "Rancho Santa María";

/** La marca corta, la misma de la barra. El logotipo del pie usa esta: con
 *  `ORIGEN` completo el texto desbordaba 380px a 1440 (medido). */
const MARCA = "Santa María";

/** La única etiqueta de la intención de contacto en todo el sitio. */
export const CONTACTO_ETIQUETA = "Contacto";

/** `tel:` solo admite dígitos y `+`; el texto a la vista conserva el formato. */
export function hrefTelefono(telefono: string): string {
  return `tel:${telefono.replace(/[^\d+]/g, "")}`;
}

const AÑO = new Date().getFullYear();

function MarcaPlaceholder({ children }: { children: string }) {
  return (
    <span
      className="font-text uppercase"
      style={{
        display: "block",
        fontSize: "var(--text-xs)",
        letterSpacing: "var(--tracking-eyebrow)",
        color: "var(--color-foreground)",
        marginBlockEnd: "var(--space-1)",
      }}
    >
      {children}
    </span>
  );
}

export function Contacto() {
  const { telefono, email } = vendedor;
  const hayDato = telefono != null || email != null;

  return (
    <footer className="pie" aria-labelledby="pie-titulo">
      <h2 id="pie-titulo" className="sr-only">
        {CONTACTO_ETIQUETA}
      </h2>

      {/* Banda de foto con el CTA encima, como el cierre de la referencia. Si no
          hay teléfono no hay banda: una banda con una foto y sin acción no cierra
          nada. */}
      {telefono != null && (
        <div className="pie__banda">
          <Image
            src="/hero/pie-caballos.jpg"
            alt=""
            fill
            sizes="100vw"
            className="pie__banda-foto"
          />
          <span className="pie__banda-scrim" aria-hidden="true" />
          <a className="hero__boton pie__banda-cta" href={hrefTelefono(telefono)}>
            {telefono}
          </a>
        </div>
      )}

      <div className="pie__cuerpo mx-auto w-full">
        {/* El logotipo gigante: la firma del pie de la referencia. Es texto, no
            una imagen: escala solo y se puede seleccionar. */}
        <p className="pie__logotipo" aria-hidden="true">
          {MARCA}
        </p>

        <div className="pie__fila">
          <div>
            {hayDato ? (
              <>
                {datosDeEjemplo && <MarcaPlaceholder>Datos de ejemplo</MarcaPlaceholder>}
                <ul className="pie__datos">
                  {telefono != null && (
                    <li>
                      <a className="contacto__enlace" href={hrefTelefono(telefono)}>
                        {telefono}
                      </a>
                    </li>
                  )}
                  {email != null && (
                    <li>
                      <a className="contacto__enlace" href={`mailto:${email}`}>
                        {email}
                      </a>
                    </li>
                  )}
                </ul>
              </>
            ) : (
              <p
                data-contacto-pendiente
                className="text-muted"
                style={{ fontSize: "var(--text-base)" }}
              >
                <MarcaPlaceholder>Sin publicar</MarcaPlaceholder>
                Teléfono y correo del rancho pendientes.
              </p>
            )}
          </div>

          <nav aria-label="Pie" className="pie__nav">
            <Link href="/">Caballos</Link>
            <Link href="/contacto">{CONTACTO_ETIQUETA}</Link>
          </nav>
        </div>

        <p className="pie__legal">
          © {ORIGEN} {AÑO} · Monterrey, Nuevo León, México
        </p>
      </div>
    </footer>
  );
}
