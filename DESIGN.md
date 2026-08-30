# DESIGN.md — Sistema visual de Santa María Performance Horses

Cerrado en **T-06**. `impeccable` exige este archivo **antes** del primer build de UI, no
después. Los tokens viven en [`src/app/globals.css`](src/app/globals.css); este archivo dice
**qué son y por qué ese valor**. El espécimen que los ejercita es la ruta `/muestra`.

**Origen de las decisiones:** `PLAN-TICKETS.md` §1.2 (dials), §1.3 y `docs/adr/0002` (tipografía),
§1.4 (color), skill `design-taste-frontend` §4, skill `modern-css`. **Ninguna se reabre sin
César.**

---

## Tema — uno solo, claro y fijo

`color-scheme: light`. **No hay modo oscuro y no se va a agregar.** La escena que manda (PLAN
§1.4): un comprador mira el sitio en el teléfono, de día, afuera, con el sol pegándole a la
pantalla. Un fondo oscuro con fotos de caballos bayos ahí es ilegible. El `#1E1F21` de la
referencia es la respuesta a otra pregunta.

Ninguna sección invierte el tema (skill §4.11). Tintes de fondo dentro de la misma familia
(`background` ↔ `surface`) sí; saltar a un fondo cálido en medio, no.

## Dials — `7 / 4 / 3`

Variance 7, motion 4, density 3. Razonados uno por uno en PLAN §1.2. **No los recalcules.**
Consecuencia operativa: motion 4 está por encima de 3, así que `prefers-reduced-motion` es
**obligatorio** en todo lo que tenga transición (ya está el bloque global en `globals.css`).

---

## Color

Fondo neutro frío y **un solo acento**, que no sea latón, terracota ni crema: los 14 caballos son
bayos y buckskin, o sea la foto ya es tostada cálida. Un fondo o un acento cálido disuelve al
animal en el cromo de la interfaz. La `PREMIUM-CONSUMER PALETTE BAN` de la skill (§4.2) prohíbe
justo la paleta que este brief invoca solo.

| Token                   | Valor     | Contraste           | Uso                                                                                                                             |
| ----------------------- | --------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `--color-background`    | `#f4f5f6` | —                   | Fondo único de todo el sitio                                                                                                    |
| `--color-surface`       | `#fafbfc` | —                   | Banda tras una foto con `object-fit: contain`: sobre este tono la banda se lee como marco de galería, no como error (PLAN §1.5) |
| `--color-foreground`    | `#16181b` | 16.3:1 sobre fondo  | Tinta. Casi negro frío                                                                                                          |
| `--color-muted`         | `#545a61` | 6.4:1 sobre fondo   | Texto secundario: miga de pan, etiquetas, pies                                                                                  |
| `--color-line`          | `#e0e2e5` | —                   | Filete de 1px. **No hay cajas de tarjeta**; se agrupa por línea y espacio negativo                                              |
| `--color-accent`        | `#2b5f6b` | 6.5:1 sobre fondo   | Verde-azul profundo. **El único acento.** Enlaces, foco, botón de contacto                                                      |
| `--color-accent-strong` | `#234e58` | 9.1:1 blanco encima | Estado `:hover` / `:active` del acento                                                                                          |
| `--color-on-accent`     | `#ffffff` | 7.1:1 sobre acento  | Texto sobre el acento (AA holgado)                                                                                              |
| `--color-placeholder`   | `#c3c7cc` | —                   | Marcador que **tiene que verse como marcador**, nunca como dato plausible                                                       |

**Lock de acento (skill §4.2):** el acento es `#2b5f6b` en TODA la página. Nada de un CTA azul en
una sección y un badge verde en otra.

**Lo único que queda por calibrar:** estos hex se afinan contra fotos reales cuando lleguen (T0.1)
**sin rehacer nada más** — por eso T-06 no estaba bloqueado. Calibrar contra los recortes de 200px
del PDF sería calibrar contra ruido.

---

## Tipografía

`Cabinet Grotesk Display` en titulares (pesos 500 y 700), `Satoshi` en texto y datos (400/500/700).
Ambas Fontshare, licencia libre, autohospedadas con `next/font` — **cero licencia que comprar**
(ADR-0002). Sin serif: su piso es más bajo y con 0/88 fotos utilizables hoy, el piso es lo que hay
que comprar.

**Regla de énfasis:** dentro de un titular, el énfasis es itálica o bold de la **misma** familia.
Nunca una palabra serif en un titular sans.

### Escala (fluida, corta — densidad 3)

| Token         | Tamaño                                      | Rol                            |
| ------------- | ------------------------------------------- | ------------------------------ |
| `--text-3xl`  | `clamp(2.5rem, 1.71rem + 3.93vw, 4rem)`     | Nombre del sitio               |
| `--text-2xl`  | `clamp(2rem, 1.57rem + 2.14vw, 2.75rem)`    | Título de la Ficha             |
| `--text-xl`   | `clamp(1.5rem, 1.29rem + 1.06vw, 1.875rem)` | Subtítulos de sección          |
| `--text-lg`   | `1.25rem`                                   | Entradilla                     |
| `--text-base` | `1.0625rem` (17px)                          | Cuerpo                         |
| `--text-sm`   | `0.9375rem` (15px)                          | Etiquetas de la lista de datos |
| `--text-xs`   | `0.8125rem` (13px)                          | Miga de pan, pies de foto      |

Line-height: `--leading-display: 1.05` · `--leading-snug: 1.25` · `--leading-body: 1.6`.
Tracking: `--tracking-display: -0.02em`.
Medida de lectura: `--measure: 65ch`.

### Eyebrow — presupuesto de UNO en todo el sitio

`--tracking-eyebrow: 0.08em`. La skill (§4.7) da máximo 1 eyebrow cada 3 secciones; con 5 bloques,
**máximo 1 en todo el sitio, y la recomendación es cero**. El token existe para el espécimen y por
si ese único uso aparece; no es una invitación a ponerlo en cada sección.

---

## Espaciado

Base 4px. El ritmo entre secciones es grande a propósito (densidad 3, "la foto manda").

`--space-1..24` = `0.25 · 0.5 · 0.75 · 1 · 1.5 · 2 · 3 · 4 · 6` rem.

| Token             | Valor                               | Uso                              |
| ----------------- | ----------------------------------- | -------------------------------- |
| `--space-section` | `clamp(6rem, 3.5rem + 11vw, 10rem)` | Padding vertical de cada sección |
| `--gutter`        | `clamp(1.25rem, 5vw, 3rem)`         | Canal lateral                    |
| `--content-max`   | `1400px`                            | Ancho máximo del contenido       |

---

## Radio — UNA sola escala

`--radius: 0.625rem` (10px). Skill §4.4 `SHAPE CONSISTENCY LOCK`: se elige **una** y se usa igual
en todo. El mismo radio en el control (botón de contacto) y en la caja de imagen. **No hay
pastilla** (`border-radius: 9999px`) **ni esquina viva** (`0`) en ninguna parte.

---

## Movimiento

Dial 4: transiciones CSS nativas, **sin librería de animación** (ni Motion ni GSAP: el presupuesto
de rendimiento en móvil se gasta en que carguen las fotos).

`--ease: cubic-bezier(0.16, 1, 0.3, 1)` · `--duration: 200ms`.

Inventario permitido, cerrado en PLAN §1.2 — nada fuera de esta lista:

1. Fade + `translateY` de las tarjetas al entrar en viewport.
2. `scale(0.98)` en `:active` sobre tarjeta y CTA.
3. Transición de `opacity` al cambiar de foto en la Galería.

`prefers-reduced-motion: reduce` anula todo (bloque global en `globals.css`). Prohibido: scroll
hijack, parallax, marquee, sticky-stack, cursor custom, loops infinitos.

---

## Cómo se consumen los tokens

- **Color y fuentes** están mapeados en `@theme inline`, así que las utilidades de Tailwind v4
  funcionan: `bg-background`, `text-foreground`, `text-muted`, `border-line`, `font-display`,
  `font-text`.
- **Escalas de espaciado y radio** se usan como `var(--space-8)` / `var(--radius)` en `style` o en
  CSS propio. No se re-exponen como utilidades para no duplicar la fuente de verdad.
- **Container queries, no media queries** para galería y tarjetas (skill `modern-css`): el número
  de columnas responde al contenedor, no al viewport. Eso lo implementan T-07 y T-08b.

## Verificado en T-06

- `/muestra` revisada en móvil real (390px) y escritorio (1440px) — ver `docs/BITACORA.md`.
- Contrastes de la tabla de color calculados con la fórmula WCAG; todos ≥ 4.5:1 (AA texto).
- Lint en baseline.

## NO verificado en T-06

- Los hex de color **no se calibraron contra fotos reales** (no existen todavía). Se afinan al
  llegar T0.1 sin tocar el resto del sistema.
- Ninguna pantalla real del sitio usa aún estos tokens: eso empieza en T-07.
