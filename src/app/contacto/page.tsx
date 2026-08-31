import type { Metadata } from "next";

import { CONTACTO_ETIQUETA, ORIGEN, hrefTelefono } from "@/components/Contacto";
import { datosDeEjemplo, vendedor } from "@/data/catalogo";

// T-22 (ADR-0004 §1) -- la página de Contacto, para que el enlace de la barra
// lleve a algún lado.
//
// Lo que NO lleva, y no es una omisión:
//   - Formulario. `CONTEXT.md`, término Interesado: el visitante no deja datos
//     en el sitio, su recorrido termina fuera, en una llamada o un correo. Un
//     formulario además necesita backend, que ADR-0001 descartó.
//   - Mapa embebido. No hay dirección de calle, y un iframe de mapa cuesta
//     rendimiento en móvil.
//   - Horarios, redes sociales, nombre de persona, tiempo de respuesta. No
//     existen: escribirlos sería fabricar.
//
// El teléfono y el correo salen de `vendedor`, la MISMA fuente que rinde el pie
// del sitio. Escritos a mano aquí habría dos sitios que actualizar el día que
// llegue el dato real, y uno se olvidaría.
//
// Esta página NO monta `<Contacto />`: sería mostrar el contacto dos veces en
// la misma pantalla. Ella es el bloque.
//
// Ancho: `--content-max` (1120), no `--content-wide`. Es la única pantalla con
// texto de lectura, y a 1920 px una línea de borde a borde es ilegible.

const UBICACION = "Monterrey, Nuevo León, México";

export const metadata: Metadata = {
  title: `${CONTACTO_ETIQUETA} · Santa María Performance Horses`,
  description: `Teléfono y correo de ${ORIGEN}.`,
};

function MarcaPlaceholder({ children }: { children: string }) {
  return (
    <span
      className="font-text uppercase"
      style={{
        display: "block",
        fontSize: "var(--text-xs)",
        letterSpacing: "var(--tracking-eyebrow)",
        color: "var(--color-foreground)",
        marginBlockEnd: "var(--space-2)",
      }}
    >
      {children}
    </span>
  );
}

export default function PaginaContacto() {
  const { telefono, email } = vendedor;
  const hayDato = telefono != null || email != null;

  return (
    <main className="flex-1">
      <div
        className="mx-auto w-full"
        style={{
          maxWidth: "var(--content-max)",
          paddingInline: "var(--gutter)",
          paddingBlockStart: "var(--space-12)",
          paddingBlockEnd: "var(--space-section)",
        }}
      >
        <h1 className="text-foreground" style={{ fontSize: "var(--text-2xl)" }}>
          {CONTACTO_ETIQUETA}
        </h1>
        <span className="regla-acento" aria-hidden="true" />

        <p
          className="text-muted"
          style={{
            fontSize: "var(--text-lg)",
            maxWidth: "var(--measure)",
            marginBlockStart: "var(--space-6)",
          }}
        >
          Para preguntar por un caballo del catálogo, marca o escribe directo a {ORIGEN}.
        </p>

        <div className="contacto-pagina" style={{ marginBlockStart: "var(--space-16)" }}>
          <section aria-labelledby="contacto-directo">
            <h2 id="contacto-directo" className="contacto-pagina__titulo">
              Teléfono y correo
            </h2>

            {hayDato ? (
              <div style={{ marginBlockStart: "var(--space-4)" }}>
                {datosDeEjemplo && <MarcaPlaceholder>Datos de ejemplo</MarcaPlaceholder>}
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
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
                style={{ fontSize: "var(--text-base)", marginBlockStart: "var(--space-4)" }}
              >
                <MarcaPlaceholder>Sin publicar</MarcaPlaceholder>
                Teléfono y correo del rancho pendientes.
              </p>
            )}
          </section>

          <section aria-labelledby="contacto-donde">
            <h2 id="contacto-donde" className="contacto-pagina__titulo">
              Dónde estamos
            </h2>
            <p
              className="text-foreground"
              style={{ fontSize: "var(--text-base)", marginBlockStart: "var(--space-4)" }}
            >
              {ORIGEN}
              <br />
              {UBICACION}
            </p>
            <p
              className="text-muted"
              style={{
                fontSize: "var(--text-sm)",
                maxWidth: "var(--measure)",
                marginBlockStart: "var(--space-3)",
              }}
            >
              Las visitas al rancho se acuerdan por teléfono.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
