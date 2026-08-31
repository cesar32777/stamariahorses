import Link from "next/link";

import { MarcadorDeFoto } from "@/components/MarcadorDeFoto";
import type { CaballoPublico } from "@/data/catalogo";

// Una tarjeta del grid del Catálogo (T-07, reskin T-17). Estética de la página
// de flota de jetmonde: foto grande en caja 3:2 con el nombre del caballo en
// serif (Playfair) sobrepuesto abajo-izquierda, sobre un degradado de scrim.
//
// La foto de portada es `fotos[0]`, no la `hero`: la hero alimenta el hero
// partido de la Ficha (T-08a) y solo cubre 3 de los 5 buckets. La caja se fuerza
// a 3:2 (`ratio`), aceptando un segundo recorte SOLO en la portada -- la Ficha
// sigue con `contain` sin recorte (RF12). Qué foto es "la buena" y su `focus` se
// decide con las fotos reales (T-11/T-12); hoy todas son marcador.
export function TarjetaCaballo({ caballo }: { caballo: CaballoPublico }) {
  const portada = caballo.fotos[0];

  return (
    <Link href={`/caballos/${caballo.slug}`} data-tarjeta className="tarjeta-caballo">
      <MarcadorDeFoto
        bucket={portada.bucket}
        focus={portada.focus}
        ratio="3 / 2"
        sizes="(min-width: 768px) 50vw, 92vw"
      />
      <span className="tarjeta-caballo__scrim" aria-hidden="true" />
      <span className="tarjeta-caballo__nombre">{caballo.nombre}</span>
    </Link>
  );
}
