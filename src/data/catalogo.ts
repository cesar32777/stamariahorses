import { caballos as todosLosCaballos, catalogo, type Caballo } from "./caballos";

// Capa de acceso al Catálogo (T-03, Seam A — sin tests, se verifica a mano).
//
// El Catálogo es lo Disponible, no el histórico (PRODUCT.md Principio 3): un
// Retirado no aparece en la portada NI tiene ruta propia. Filtrar aquí, en un
// solo sitio, es lo que hace que esa regla (RF1) no dependa de que cada vista
// se acuerde de aplicarla.
//
// "Vendido" no es sinónimo de "Retirado": un caballo se retira porque se
// vendió, porque el dueño lo sacó de venta, o porque las fotos no sirven
// (CONTEXT.md). Por eso el estado es `retirado`, no `vendido`.

/** Un Caballo del Catálogo público, con su slug ya resuelto. */
export type CaballoPublico = Caballo & { readonly slug: string };

/**
 * slug a partir del `nombre`: minúsculas, sin acentos, y todo lo que no sea
 * `[a-z0-9]` colapsa a un guion. Hoy los nombres son placeholders
 * (`"Caballo 01"` → `caballo-01`); cuando lleguen los reales el slug cambia
 * con ellos, que es lo correcto para un sitio sin histórico de URLs.
 */
export function slugDeNombre(nombre: string): string {
  return nombre
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function construirCatalogoPublico(): readonly CaballoPublico[] {
  const publicos = todosLosCaballos
    .filter((caballo) => caballo.estado === "disponible")
    .map((caballo) => ({ ...caballo, slug: slugDeNombre(caballo.nombre) }));

  // Un slug vacío o repetido dejaría a un caballo sin ruta accesible en
  // silencio. Igual que en T-02, eso rompe el build en vez de descubrirse
  // en producción.
  const vistos = new Map<string, string>();
  for (const caballo of publicos) {
    if (caballo.slug === "") {
      throw new Error(
        `Catálogo (T-03): el caballo '${caballo.nombre}' (id ${caballo.id}) produce un slug vacío.`,
      );
    }
    const previo = vistos.get(caballo.slug);
    if (previo !== undefined) {
      throw new Error(
        `Catálogo (T-03): slug duplicado '${caballo.slug}' entre '${previo}' y '${caballo.nombre}'.`,
      );
    }
    vistos.set(caballo.slug, caballo.nombre);
  }

  return publicos;
}

/** El Catálogo: solo los Caballos Disponibles, cada uno con su slug. */
export const caballosPublicos: readonly CaballoPublico[] = construirCatalogoPublico();

/** El Caballo Disponible con ese slug, o `undefined` (Retirado o inexistente). */
export function getCaballoPorSlug(slug: string): CaballoPublico | undefined {
  return caballosPublicos.find((caballo) => caballo.slug === slug);
}

/** Los slugs de los Caballos Disponibles — para `generateStaticParams`. */
export function slugsPublicos(): string[] {
  return caballosPublicos.map((caballo) => caballo.slug);
}

/**
 * El Vendedor: teléfono y correo de Rancho Santa María (CONTEXT.md). Ambos
 * `null` mientras el dato real no se capture; T-10 rinde un marcador visible.
 */
export const vendedor = catalogo.vendedor;

/**
 * `true` mientras `data/caballos.json` lleve datos de ejemplo. La UI lo usa
 * para pintar el aviso y marcar los valores como muestra (prohibición dura: un
 * placeholder tiene que verse como placeholder).
 */
export const datosDeEjemplo = catalogo.ejemplo === true;

export type { Caballo };
