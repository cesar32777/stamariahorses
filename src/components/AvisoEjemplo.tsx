import { datosDeEjemplo } from "@/data/catalogo";

// Aviso de datos de ejemplo. Mientras `data/caballos.json` lleve el flag
// `ejemplo: true`, el sitio muestra contacto, sexo, edad, raza, capa y alzada
// de MUESTRA -- valores con el tipo correcto pero sin dato real detrás.
//
// La prohibición dura del proyecto: "un placeholder tiene que verse como
// placeholder en pantalla". Un enum (`sexo`) o un número (`alzada`) no puede
// llevar la palabra "ejemplo" dentro, así que el que carga con la advertencia
// es este aviso, visible en cada página, más el marcado por valor en la Ficha.
//
// Desaparece solo cuando se quita el flag del JSON: no hay que tocar este
// componente ni buscar dónde se monta.

export function AvisoEjemplo() {
  if (!datosDeEjemplo) {
    return null;
  }

  return (
    <div
      role="note"
      className="aviso-ejemplo"
      style={{
        borderBlockEnd: "1px solid var(--color-line)",
        background: "var(--color-surface)",
      }}
    >
      <p
        className="mx-auto w-full font-text"
        style={{
          maxWidth: "var(--content-max)",
          paddingInline: "var(--gutter)",
          paddingBlock: "var(--space-3)",
          fontSize: "var(--text-xs)",
          color: "var(--color-foreground)",
        }}
      >
        <strong style={{ fontWeight: 700 }}>Sitio en construcción.</strong> Los datos de los
        caballos y el contacto son de ejemplo, todavía no reales.
      </p>
    </div>
  );
}
