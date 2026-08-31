# ADR-0003 — Reskin a la identidad del catálogo impreso (serif, cream, sepia)

- **Estado:** Aceptada
- **Fecha:** 2026-08-30
- **Decide:** César
- **Reemplaza:** [ADR-0002](0002-tipografia-display-sans.md) (tipografía) y anula las razones
  propias de `PLAN-TICKETS.md` §1.4 (color) y §1.5 bloque 2 (nombre bajo la tarjeta).

## Contexto

César revisó en vivo la **página de flota de jetmonde.com** (`/flotte`) y decidió que **la
portada de Santa María tenga esa estética**: cabecera en serif display grande, grid de 2 columnas
de fotos grandes con el **nombre del caballo en serif sobrepuesto abajo-izquierda**, sin bordes ni
sombras, esquina viva. Con dos cambios respecto a la referencia:

- **Fondo claro, no el `#1E1F21` oscuro del jet** — se conserva la razón de PLAN §1.4 (comprador
  con sol en el teléfono). El fondo va **cream**, el del papel del PDF de Eduardo Galán
  (`#F5F0E8`, medido).
- **Acento tierra/rojizo**, tomado del PDF (pelaje buckskin, tierra, luz cálida): **sepia tabaco
  `#8a5a3c`**.

## Lo que se reabre y el riesgo aceptado

ADR-0002 descartó la serif con este argumento, que **sigue siendo válido**:

- 0 de 88 fotos del PDF llegan a 1200 px. Hoy no hay ninguna foto real utilizable.
- Una serif de contraste (Playfair es didone) **le pide nitidez a la foto de al lado y la
  delata** cuando la foto es blanda.
- Fondo cream + serif display de alto contraste + acento tierra es **exactamente el cúmulo** que
  `impeccable` y `design-taste-frontend` §4.2 nombran como el default de IA para un brief de
  rancho de caballos.
- El objetivo que César fijó en ADR-0002 ("un resultado que no pueda verse mal") apuntaba a la
  sans porque su piso es más alto.

**César aceptó ese riesgo explícitamente**, dos veces, con el argumento a la vista. La
contrapartida:

- La marca **ya se expresó una vez en serif**: la portada del PDF es una didone en caja alta.
  Adoptarla no es default-reaching a ciegas, es alinear el sitio con el artefacto que ya existe.
- El acento cálido rompe la regla de PLAN §1.4 ("los bayos se disuelven en un cromo cálido").
  Se compensa manteniendo el fondo **muy claro** (cream casi papel, no crema saturada) y el
  acento **solo en tinta** (enlaces, foco, filetes, nombre sobre foto), nunca como relleno de
  bloque ni tras una foto.

**Cuándo se revierte:** si al llegar las fotos reales (T-11/T-12) el conjunto se ve pobre —la
serif delatando fotos blandas—, se vuelve a la sans de ADR-0002 sin drama: el cambio es de
tokens, no de estructura.

## Decisión

### Tipografía

| Rol                            | Fuente                                             | Licencia          | Cómo                                     |
| ------------------------------ | -------------------------------------------------- | ----------------- | ---------------------------------------- |
| Titulares y nombres de caballo | **Playfair Display** (variable, 400–600 + itálica) | SIL OFL, gratis   | woff2 en `src/fonts/`, `next/font/local` |
| Texto, datos, navegación, UI   | **Satoshi** (sin cambios)                          | Fontshare, gratis | ya está                                  |

`Cabinet Grotesk` se retira: un solo display. Playfair es didone de alto contraste,
la más parecida a la portada del PDF, y la más robusta a tamaño grande de las candidatas libres
(descartadas: Cormorant —demasiado fina— y Bodoni Moda —piso demasiado bajo—). No es
`Fraunces` ni `Instrument Serif` (prohibidas por la skill).

`--tracking-display` pasa de `-0.02em` a `0` (la sans pedía tracking negativo; la didone no).
`--leading-display` sube a `1.15` para descendentes de la itálica (regla de la skill).

### Color — un solo tema, claro y cálido

| Token                   | Antes     | Ahora                     | Nota                                           |
| ----------------------- | --------- | ------------------------- | ---------------------------------------------- |
| `--color-background`    | `#f4f5f6` | `#f5f0e8`                 | Papel del PDF                                  |
| `--color-surface`       | `#fafbfc` | `#faf6ee`                 | Banda tras foto `contain`                      |
| `--color-foreground`    | `#16181b` | `#1c1a16`                 | Tinta cálida casi negra                        |
| `--color-muted`         | `#545a61` | `#6b6155`                 | Gris cálido, ≥ 4.5:1 sobre fondo               |
| `--color-line`          | `#e0e2e5` | `#ddd5c6`                 | Filete cálido                                  |
| `--color-accent`        | `#2b5f6b` | `#8a5a3c`                 | Sepia tabaco                                   |
| `--color-accent-strong` | `#234e58` | `#6f4630`                 | `:hover` / `:active`                           |
| `--color-placeholder`   | `#c3c7cc` | `#c9c0ac`                 | Marcador cálido, sigue leyéndose como marcador |
| `--color-scrim` (nuevo) | —         | `oklch(0.22 0.02 60 / …)` | Degradado bajo el nombre sobre foto            |

Sigue siendo **un solo tema, un solo acento, sin modo oscuro**. Ninguna sección invierte.

### Forma y layout

- `--radius: 0` (esquina viva, como el jet y como un catálogo impreso). Anula el `SHAPE LOCK` a
  `10px` de DESIGN.md — se elige otra escala única, no se mezclan.
- `--content-max: 1120px` (antes `1400px`): el grid de la flota es angosto, 2 columnas grandes.
- Grid del Catálogo: de `columns` (masonry) a **`grid` de 2 columnas iguales**, cada tarjeta en
  caja **3:2 con `object-fit: cover`** y `object-position` del `focus` (T-04). Móvil: 1 columna.
  Esto acepta un segundo recorte en la portada —la hero de la Ficha sigue siendo `contain` sin
  recorte (RF12 intacto en la Ficha)—.
- Nombre del caballo: **sobrepuesto** abajo-izquierda sobre la foto, Playfair grande, con
  degradado de scrim para legibilidad. Anula "sin pill sobre la imagen" de PLAN §1.5 bloque 2:
  no es una pill decorativa, es el nombre como en la ficha del jet.

## Consecuencias

- **Aceptadas:** el techo sube y el piso baja (ver riesgo arriba). El sitio depende ahora de que
  las fotos reales estén a la altura. Se revisa en T-12.
- **Trabajo:** T-17 lo implementa. DESIGN.md se reescribe. `PLAN-TICKETS.md` §1.4 y §1.5 llevan
  una nota fechada que apunta aquí (no se reescriben: son el origen histórico).
- **Lo que NO cambia:** la estructura de la Ficha (hero partido `contain`, lista de datos sin
  bordes, galería masonry), los dials `7/4/3`, el inventario de movimiento, `prefers-reduced-motion`,
  el gate de lint, la capa de datos, el flag `ejemplo`.
