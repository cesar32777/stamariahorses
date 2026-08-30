import rawData from "../../data/caballos.json";
import { CatalogoSchema, type Caballo, type Catalogo, type Foto } from "./schema";

// Punto de enganche de la validación en BUILD (T-02). Este módulo se importa
// desde el árbol de `app/`, así que `next build` lo evalúa: si
// `data/caballos.json` no cumple el esquema, el `.parse()` de abajo lanza y el
// build falla con un mensaje que nombra el caballo y el campo. No hay
// validación en runtime del cliente ni tests de capa unitaria: el build es la
// red (decisión del proyecto).

const resultado = CatalogoSchema.safeParse(rawData);

if (!resultado.success) {
  const registros =
    (rawData as { caballos?: Array<{ id?: string; nombre?: string }> }).caballos ?? [];

  const lineas = resultado.error.issues.map((issue) => {
    const [raiz, indice, ...resto] = issue.path;
    if (raiz === "caballos" && typeof indice === "number") {
      const registro = registros[indice];
      const quien = registro?.nombre ?? (registro?.id ? `id ${registro.id}` : `#${indice}`);
      const campo = resto.join(".") || "(raíz del caballo)";
      return `  • caballo ${quien} → campo '${campo}': ${issue.message}`;
    }
    return `  • ${issue.path.join(".") || "(raíz)"}: ${issue.message}`;
  });

  throw new Error(
    `data/caballos.json no cumple el esquema del Catálogo (T-02). ` +
      `${resultado.error.issues.length} problema(s):\n${lineas.join("\n")}`,
  );
}

/** El dato completo del Catálogo, ya validado contra el esquema. */
export const catalogo: Catalogo = resultado.data;

/** Todos los Caballos del archivo (Disponibles y Retirados). */
export const caballos: readonly Caballo[] = resultado.data.caballos;

export type { Caballo, Foto, Catalogo };
