import { datosDeEjemplo } from "@/data/catalogo";

// Aviso de datos de ejemplo. Mientras `data/caballos.json` lleve el flag
// `ejemplo: true`, el sitio muestra nombres, sexo, edad, raza, capa, alzada,
// peso, padres, registro y contacto de MUESTRA -- valores con el tipo correcto
// pero sin dato real detrás.
//
// La prohibición dura del proyecto: "un placeholder tiene que verse como
// placeholder en pantalla". Un enum (`sexo`) o un número (`alzada`) no puede
// llevar la palabra "ejemplo" dentro, así que el que carga con la advertencia
// es este aviso, visible en cada página, más el rótulo por bloque en la Ficha
// y en Contacto.
//
// T-18 (ADR-0004 §3): de párrafo a UNA línea fina. César quiere que el bloque
// de datos se lea como el de la referencia, no tapado por una advertencia; a
// cambio la señal se concentra aquí y en el rótulo pegado a cada bloque. Es un
// riesgo escrito en el ADR, no un descuido.
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
          maxWidth: "var(--content-wide)",
          paddingInline: "var(--gutter)",
          paddingBlock: "var(--space-2)",
          fontSize: "var(--text-xs)",
          lineHeight: 1.4,
          color: "var(--color-foreground)",
        }}
      >
        Sitio en construcción. Caballos, datos y contacto son de ejemplo, todavía no reales.
      </p>
    </div>
  );
}
