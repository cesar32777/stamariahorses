import { datosDeEjemplo, vendedor } from "@/data/catalogo";

// T-10 -- Contacto. El recorrido del Interesado termina FUERA del sitio: no hay
// carrito, ni cotizacion, ni formulario. Solo `tel:` y `mailto:` del rancho, en
// el pie de la portada y al cierre de cada Ficha (PLAN 1.5, bloques 3 y 8).
//
// El Vendedor es el rancho, no una persona (CONTEXT.md, cerrado 2026-08-29):
// nada de nombre propio en el llamado a la accion, solo telefono y correo de
// Rancho Santa Maria. Eduardo Galan es el autor del PDF, no el contacto.
//
// UNA sola etiqueta para toda la intencion de contacto del sitio: la skill
// prohibe dos CTA con la misma intencion y etiquetas distintas. Esa etiqueta es
// `CONTACTO_ETIQUETA`, y este componente es su unico dueno.
//
// Tres estados:
//   - sin dato          -> marcador "Sin publicar" (T-10 autoriza rendir la
//                          seccion sin su dato, unica excepcion del sitio).
//   - dato de ejemplo   -> enlaces reales + marca "Datos de ejemplo" a la vista
//                          (`datosDeEjemplo`, prohibicion dura: se ve como tal).
//   - dato real         -> enlaces, sin marca.

const ORIGEN = "Rancho Santa María";

/** La unica etiqueta de la intencion de contacto en todo el sitio. */
export const CONTACTO_ETIQUETA = "Contacto";

/** `tel:` solo admite digitos y `+`; el texto a la vista conserva el formato. */
function hrefTelefono(telefono: string): string {
  return `tel:${telefono.replace(/[^\d+]/g, "")}`;
}

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
    <footer
      className="contacto mx-auto w-full"
      aria-labelledby="contacto-titulo"
      style={{
        maxWidth: "var(--content-max)",
        paddingInline: "var(--gutter)",
        paddingBlock: "var(--space-section)",
        borderBlockStart: "1px solid var(--color-line)",
      }}
    >
      <h2 id="contacto-titulo" className="text-foreground" style={{ fontSize: "var(--text-xl)" }}>
        {CONTACTO_ETIQUETA}
      </h2>

      <p
        className="text-muted"
        style={{ fontSize: "var(--text-sm)", marginBlockStart: "var(--space-2)" }}
      >
        {ORIGEN}
      </p>

      {hayDato ? (
        <div style={{ marginBlockStart: "var(--space-6)" }}>
          {datosDeEjemplo && <MarcaPlaceholder>Datos de ejemplo</MarcaPlaceholder>}
          <ul className="contacto__lista" style={{ listStyle: "none", padding: 0 }}>
            {telefono != null && (
              <li>
                <a className="contacto__enlace" href={hrefTelefono(telefono)}>
                  {telefono}
                </a>
              </li>
            )}
            {email != null && (
              <li style={{ marginBlockStart: "var(--space-2)" }}>
                <a className="contacto__enlace" href={`mailto:${email}`}>
                  {email}
                </a>
              </li>
            )}
          </ul>
        </div>
      ) : (
        <p
          data-contacto-pendiente
          className="text-muted"
          style={{ fontSize: "var(--text-base)", marginBlockStart: "var(--space-6)" }}
        >
          <MarcaPlaceholder>Sin publicar</MarcaPlaceholder>
          Teléfono y correo del rancho pendientes.
        </p>
      )}
    </footer>
  );
}
