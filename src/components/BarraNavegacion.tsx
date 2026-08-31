"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { CONTACTO_ETIQUETA } from "@/components/Contacto";

// T-19 -- la barra de navegación (ADR-0004 §1). Estructura tomada de la página
// del jet: marca a la izquierda, enlaces a la derecha, filete de 1px abajo, de
// borde a borde. Alto objetivo 64px (el del jet mide 57; el tope de la skill
// es 80).
//
// Es Componente de Cliente por UNA razón: `usePathname` para marcar la sección
// actual. Nada más vive aquí. Si algún día la marca activa se puede resolver
// en el servidor, esto vuelve a ser estático.
//
// Dos enlaces, no cinco. El jet tiene cinco porque tiene cinco secciones; este
// sitio tiene dos rutas. Inventar "Nosotros" o "Servicios" para llenar la barra
// es exactamente lo que prohíbe la decisión 5 del backlog. Tampoco hay selector
// de idioma (el jet tiene FR/EN, este sitio es monolingüe) ni franja de ciudad.
//
// La etiqueta de contacto NO se escribe aquí: se importa de `Contacto.tsx`, su
// dueño único. Dos etiquetas distintas para la misma intención es un fallo de
// la skill, y el sitio ya tiene tres sitios donde aparece (barra, CTA de
// portada, pie).

const MARCA = "Santa María";
const MARCA_COLA = "Performance Horses";

const ENLACES = [
  { href: "/", etiqueta: "Caballos" },
  { href: "/contacto", etiqueta: CONTACTO_ETIQUETA },
] as const;

export function BarraNavegacion() {
  const ruta = usePathname();

  return (
    <header className="barra">
      <div className="barra__interior mx-auto w-full">
        <Link href="/" className="barra__marca">
          <span className="barra__marca-nombre">{MARCA}</span>
          <span className="barra__marca-cola">{MARCA_COLA}</span>
        </Link>

        <nav aria-label="Principal">
          <ul className="barra__nav">
            {ENLACES.map(({ href, etiqueta }) => {
              // `/` solo está activa en la portada; `/contacto` también en sus
              // hijos, si alguna vez los tiene. Una Ficha no marca "Caballos"
              // como actual por accidente: su ruta empieza con `/caballos/`.
              const activa = href === "/" ? ruta === "/" : ruta.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className="barra__enlace"
                    aria-current={activa ? "page" : undefined}
                  >
                    {etiqueta}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
