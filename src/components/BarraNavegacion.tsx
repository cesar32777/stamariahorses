"use client";

import Image from "next/image";
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

const NOMBRE_SITIO = "Santa María Performance Horses";

const ENLACES = [
  { href: "/", etiqueta: "Caballos" },
  { href: "/contacto", etiqueta: CONTACTO_ETIQUETA },
] as const;

export function BarraNavegacion() {
  const ruta = usePathname();

  // T-23: en la portada la barra va SOBRE la foto del hero, no como franja
  // aparte encima -- que es como la tiene la referencia. En el resto del sitio
  // no hay foto detrás, así que se queda sólida sobre el papel cream.
  const sobreHero = ruta === "/";

  return (
    <header className={sobreHero ? "barra barra--sobre-hero" : "barra"}>
      <div className="barra__interior mx-auto w-full">
        <Link
          href="/"
          className="barra__marca"
          aria-label={`${NOMBRE_SITIO} — Inicio`}
        >
          <Image
            src="/marca/logo.png"
            alt={NOMBRE_SITIO}
            width={206}
            height={124}
            priority
            className="barra__logo barra__logo--dark"
          />
          <Image
            src="/marca/logo-hero.png"
            alt={NOMBRE_SITIO}
            width={206}
            height={124}
            priority
            className="barra__logo barra__logo--light"
          />
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
