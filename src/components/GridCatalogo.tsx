import { TarjetaCaballo } from "@/components/TarjetaCaballo";
import { caballosPublicos } from "@/data/catalogo";

// Grid del Catálogo (T-07). Layout de columnas (`columns`), no `grid` de celdas:
// con 5 proporciones conviviendo, un grid de filas deja huecos grandes cuando
// los altos no cuadran, y `display: grid-lanes` aún tiene soporte parcial
// (README §trampas). `columns` escalona por construcción y no puede desbordar en
// horizontal. Móvil: una sola columna (MOBILE OVERRIDE de la skill, dial
// variance 7). El estilo vive en `globals.css` (`.grid-catalogo`).
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
