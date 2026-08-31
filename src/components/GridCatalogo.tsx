import { TarjetaCaballo } from "@/components/TarjetaCaballo";
import { caballosPublicos } from "@/data/catalogo";

// Grid del Catálogo (T-07, reskin T-17). Grid de 2 columnas iguales con cada
// tarjeta en caja 3:2 `cover` -- la estética de la página de flota de jetmonde
// (ADR-0003). Antes era `columns` (masonry) para escalonar los 5 buckets; el
// reskin unifica la proporción de la portada y acepta el segundo recorte ahí.
// Móvil: una sola columna. El estilo vive en `globals.css` (`.grid-catalogo`).
export function GridCatalogo() {
  return (
    <ul className="grid-catalogo list-none">
      {caballosPublicos.map((caballo) => (
        <li key={caballo.id} className="grid-catalogo__item">
          <TarjetaCaballo caballo={caballo} />
        </li>
      ))}
    </ul>
  );
}
