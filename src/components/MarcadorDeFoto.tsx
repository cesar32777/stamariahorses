import Image from "next/image";
import type { CSSProperties } from "react";

import { aspectRatioDeBucket, objectPositionDeFoto, type Bucket } from "@/data/imagen";

// T-05 — el marcador de posición del proyecto (RF7). Es la bisagra: cada hueco
// donde irá una foto se pinta HOY como color sólido en el `aspect-ratio` real
// de su bucket, para que el día que llegue la foto no se mueva nada del layout
// (CLS = 0 al sustituir). Toda la fase C se construye y se mide con esto, sin
// una sola foto real.
//
// El mecanismo de reserva no se improvisa: es el `aspect-ratio` del bucket que
// fija T-04 (`aspectRatioDeBucket`) sobre una caja de ancho fluido. Con la caja
// dimensionada por proporción -- no por la imagen -- el alto es idéntico antes
// y después de que cargue la foto.
//
// Un placeholder tiene que verse como placeholder (prohibición dura): en estado
// vacío lleva la etiqueta "sin foto" a la vista. No simula una foto.

type MarcadorDeFotoProps = {
  /** El bucket de la Foto que irá aquí. Fija el `aspect-ratio` de la caja. */
  bucket: Bucket;
  /** `focus` de la Foto → `object-position`. `center` por defecto (T-04). */
  focus?: string | null;
  /**
   * Ruta de la foto real. Ausente/`null` ⇒ marcador vacío visible. Mientras
   * `data/caballos.json` no tenga fotos utilizables esto es siempre `null`;
   * el cableado del origen real es T-11.
   */
  src?: string | null;
  /**
   * Texto alternativo de la foto. Vacío por defecto (decorativo). El `alt` con
   * el nombre real del Caballo es T-13.
   */
  alt?: string;
  /** `sizes` de `next/image`. El ajuste fino por layout es T-07/T-08. */
  sizes?: string;
  /**
   * Proporcion de la caja, si NO es la del bucket. La portada (T-17) fuerza
   * `"3 / 2"` en todas las tarjetas para el grid de la flota, aceptando un
   * segundo recorte; la Ficha deja el bucket real (sin recorte, RF12).
   */
  ratio?: string;
  className?: string;
  style?: CSSProperties;
};

export function MarcadorDeFoto({
  bucket,
  focus,
  src,
  alt = "",
  sizes = "100vw",
  ratio,
  className,
  style,
}: MarcadorDeFotoProps) {
  return (
    <div
      data-marcador
      data-bucket={bucket}
      data-estado={src ? "foto" : "vacio"}
      className={className}
      style={{
        position: "relative",
        inlineSize: "100%",
        aspectRatio: ratio ?? aspectRatioDeBucket(bucket),
        overflow: "hidden",
        borderRadius: "var(--radius)",
        background: "var(--color-placeholder)",
        ...style,
      }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          fill
          sizes={sizes}
          style={{ objectFit: "cover", objectPosition: objectPositionDeFoto(focus) }}
        />
      ) : (
        <span
          data-etiqueta
          className="font-text uppercase"
          style={{
            position: "absolute",
            insetInlineStart: "var(--space-2)",
            insetBlockStart: "var(--space-2)",
            fontSize: "var(--text-xs)",
            letterSpacing: "var(--tracking-eyebrow)",
            color: "var(--color-foreground)",
          }}
        >
          sin foto
        </span>
      )}
    </div>
  );
}
