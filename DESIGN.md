# DESIGN.md — Sistema visual de Santa María Performance Horses

Cerrado en **T-06**, **reskin en T-17** ([ADR-0003](docs/adr/0003-reskin-identidad-catalogo-impreso.md),
reemplaza ADR-0002). `impeccable` exige este archivo **antes** del primer build de UI, no
después. Los tokens viven en [`src/app/globals.css`](src/app/globals.css); este archivo dice
**qué son y por qué ese valor**. El espécimen que los ejercita es la ruta `/muestra`.

**Origen de las decisiones:** `PLAN-TICKETS.md` §1.2 (dials), **`docs/adr/0003`** (tipografía,
color, forma — reemplaza §1.3/§1.4 y `docs/adr/0002`), skill `design-taste-frontend` §4, skill
`modern-css`. **Ninguna se reabre sin César.**

---

## Tema — uno solo, claro, cálido y fijo

`color-scheme: light`. **No hay modo oscuro y no se va a agregar.** La escena que manda (PLAN
§1.4): un comprador mira el sitio en el teléfono, de día, afuera, con el sol pegándole a la
pantalla. Un fondo oscuro ahí es ilegible — por eso **no** se copió el `#1E1F21` de jetmonde
al adoptar su estética (ADR-0003).

El fondo es **cream, el papel del PDF de Eduardo Galán** (`#f5f0e8`, medido). La contrapartida
—un fondo cálido puede disolver a los bayos— se compensa manteniéndolo **muy claro** y llevando
el acento **solo a tinta** (enlaces, foco, filetes, nombre sobre foto), nunca como relleno de
bloque ni tras una foto.

Ninguna sección invierte el tema (skill §4.11). Tintes dentro de la misma familia
(`background` ↔ `surface`) sí.

## Dials — `7 / 4 / 3`

Variance 7, motion 4, density 3. Razonados uno por uno en PLAN §1.2. **No los recalcules.**
Consecuencia operativa: motion 4 está por encima de 3, así que `prefers-reduced-motion` es
**obligatorio** en todo lo que tenga transición (ya está el bloque global en `globals.css`).

---

## Color

Papel cream del PDF y **un solo acento** tierra tomado del mismo PDF (pelaje buckskin, tierra,
luz cálida). Es la paleta que `impeccable` y la skill (§4.2) marcan como el default de IA para
un brief de rancho — se adopta a conciencia, con el riesgo escrito en ADR-0003, porque **la
marca ya se expresó una vez así**: la portada del PDF es una didone negra sobre papel cream.
Contención del riesgo: fondo muy claro, acento solo en tinta.

| Token                   | Valor            | Contraste          | Uso                                                                                              |
| ----------------------- | ---------------- | ------------------ | ------------------------------------------------------------------------------------------------ |
| `--color-background`    | `#f5f0e8`        | —                  | Papel cream del PDF. Fondo único de todo el sitio                                                |
| `--color-surface`       | `#faf6ee`        | —                  | Banda tras una foto `object-fit: contain`: se lee como marco de galería, no como error           |
| `--color-foreground`    | `#1c1a16`        | 15.8:1 sobre fondo | Tinta cálida casi negra                                                                          |
| `--color-muted`         | `#6b6155`        | 5.0:1 sobre fondo  | Texto secundario: miga de pan, etiquetas, pies (AA)                                              |
| `--color-line`          | `#ddd5c6`        | —                  | Filete de 1px. **No hay cajas de tarjeta**; se agrupa por línea y espacio negativo               |
| `--color-accent`        | `#8a5a3c`        | 5.1:1 sobre fondo  | Sepia tabaco. **El único acento.** Enlaces, foco, filete de portada, nombre sobre foto           |
| `--color-accent-strong` | `#6f4630`        | 7.1:1 sobre fondo  | Estado `:hover` / `:active` del acento                                                           |
| `--color-on-accent`     | `#faf6ee`        | 5.0:1 sobre acento | Texto sobre el acento (si algún día hay botón relleno)                                           |
| `--color-placeholder`   | `#c9c0ac`        | —                  | Marcador que **tiene que verse como marcador**, nunca como dato plausible                        |
| `--color-scrim`         | `28 26 22` (RGB) | —                  | Canal RGB del degradado bajo el nombre sobre la foto (se usa como `rgb(var(--color-scrim) / α)`) |

**Lock de acento (skill §4.2):** el acento es `#8a5a3c` en TODA la página. Nunca otro color de
señal en otra sección.

**Verificado en T-17** (recalculado con la fórmula WCAG, leído del DOM): foreground 15.3:1,
muted 5.3:1, accent 5.1:1, enlace `tel:` 5.1:1, nombre sobre scrim 11:1 — todos ≥ 4.5 (AA texto).

**Lo que queda por calibrar:** los hex se afinan contra fotos reales cuando lleguen (T-11/T-12)
sin rehacer estructura. **Si el conjunto se ve pobre con las fotos reales, ADR-0003 se revierte a
la sans de ADR-0002 cambiando estos tokens.**

---

## Tipografía

**`Playfair Display`** (didone de alto contraste, variable 400–700 + itálica) en titulares y
**nombres de caballo**; **`Satoshi`** en texto, datos, navegación y UI. Ambas licencia libre
(Playfair SIL OFL, Satoshi Fontshare), woff2 en `src/fonts/`, `next/font/local` — cero licencia
que comprar. `Cabinet Grotesk` **se retiró** (ADR-0003): un solo display.

Playfair es la más parecida a la portada del PDF y la más robusta a tamaño grande de las
candidatas libres (Cormorant es demasiado fina, Bodoni Moda tiene el piso muy bajo). No es
`Fraunces` ni `Instrument Serif`.

**Regla de énfasis:** dentro de un titular, el énfasis es itálica o bold de la **misma** familia.

### Escala (fluida — densidad 3, pero con más presencia que la sans)

| Token           | Tamaño                                     | Rol                              |
| --------------- | ------------------------------------------ | -------------------------------- |
| `--text-3xl`    | `clamp(2.75rem, 1.7rem + 5.2vw, 5rem)`     | Nombre del sitio                 |
| `--text-2xl`    | `clamp(2.25rem, 1.6rem + 3.2vw, 3.5rem)`   | Título de la Ficha               |
| `--text-xl`     | `clamp(1.75rem, 1.4rem + 1.75vw, 2.5rem)`  | Subtítulos de sección            |
| `--text-nombre` | `clamp(1.5rem, 1.15rem + 1.75vw, 2.25rem)` | Nombre del caballo sobre la foto |
| `--text-lg`     | `1.25rem`                                  | Entradilla                       |
| `--text-base`   | `1.0625rem` (17px)                         | Cuerpo                           |
| `--text-sm`     | `0.9375rem` (15px)                         | Etiquetas de la lista de datos   |
| `--text-xs`     | `0.8125rem` (13px)                         | Miga de pan, pies de foto        |

Line-height: `--leading-display: 1.15` (sube desde 1.05: la didone y las descendentes de la
itálica lo piden — regla de la skill) · `--leading-snug: 1.3` · `--leading-body: 1.6`.
Tracking: `--tracking-display: 0` (la grotesca pedía negativo; la didone no).
Medida de lectura: `--measure: 65ch`.

### Eyebrow — presupuesto de UNO en todo el sitio

`--tracking-eyebrow: 0.08em`. La skill (§4.7) da máximo 1 eyebrow cada 3 secciones; con 5 bloques,
**máximo 1 en todo el sitio, y la recomendación es cero**. El token existe para el espécimen y por
si ese único uso aparece; no es una invitación a ponerlo en cada sección.

---

## Espaciado

Base 4px. El ritmo entre secciones es grande a propósito (densidad 3, "la foto manda").

`--space-1..24` = `0.25 · 0.5 · 0.75 · 1 · 1.5 · 2 · 3 · 4 · 6` rem.

| Token             | Valor                               | Uso                                                      |
| ----------------- | ----------------------------------- | -------------------------------------------------------- |
| `--space-section` | `clamp(6rem, 3.5rem + 11vw, 10rem)` | Padding vertical de cada sección                         |
| `--gutter`        | `clamp(1.25rem, 5vw, 3rem)`         | Canal lateral                                            |
| `--content-max`   | `1120px`                            | Ancho máximo — el grid de la flota es angosto (ADR-0003) |

---

## Radio — UNA sola escala: esquina viva

`--radius: 0` (ADR-0003). Skill §4.4 `SHAPE CONSISTENCY LOCK`: se elige **una** y se usa igual en
todo — antes era 10px, ahora 0, como la página de flota de jetmonde y como un catálogo impreso.
El mismo radio (0) en el control y en la caja de imagen. **No hay pastilla** (`9999px`) en ningún
lado.

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
