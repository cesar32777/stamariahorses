import Link from "next/link";

import { MarcadorDeFoto } from "@/components/MarcadorDeFoto";
import type { CaballoPublico } from "@/data/catalogo";

// Una tarjeta del grid del Catálogo (T-07). La foto de portada es `fotos[0]`, no
// la `hero`: la hero alimenta el hero partido de la Ficha (T-08a) y solo cubre 3
// de los 5 buckets, mientras que el grid tiene que enseñar los 5 conviviendo
// (condición de hecho de T-07). Cuál foto es "la buena" para la portada se
// decide cuando lleguen las fotos reales (T-11); hoy todas son marcador.
export function TarjetaCaballo({ caballo }: { caballo: CaballoPublico }) {
  const portada = caballo.fotos[0];

  return (
    <Link href={`/caballos/${caballo.slug}`} data-tarjeta className="tarjeta-caballo block">
      <MarcadorDeFoto
        bucket={portada.bucket}
        focus={portada.focus}
        sizes="(min-width: 1200px) 30vw, (min-width: 768px) 45vw, 92vw"
      />
      <span
        className="font-text text-foreground block"
        style={{ fontSize: "var(--text-sm)", marginBlockStart: "var(--space-3)" }}
      >
        {caballo.nombre}
      </span>
    </Link>
  );
}
