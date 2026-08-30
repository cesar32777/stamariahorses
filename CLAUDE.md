# CLAUDE.md — Santa María Performance Horses

Catálogo web de venta de caballos de **Rancho Santa María**, Monterrey MX. React/Next.js, estático,
sin CMS (ADR-0001). No hay Shopify, no hay Figma: el diseño se decide aquí y la fuente del dato es
`data/caballos.json`.

El método de construcción —tickets, estado derivado, TDD, roles, worktrees— vive en la skill
**`metodo-tickets`**, que se carga sola. Aquí solo va lo propio de este proyecto.

**Este archivo no lleva datos con fecha.** Lo que caduca vive en `docs/BITACORA.md` y en el campo
`Estado:` de cada ticket. **Commitea todos los archivos tocados al terminar cada sesión** — es el
único mecanismo de handoff que tiene el proyecto.

---

## Índice — qué leer según la tarea

| Si vas a... | Lee |
|---|---|
| **Cualquier cosa — empieza aquí** | `docs/tickets/ESTADO.md` (qué está hecho, qué está listo para tomar — **generado**) y luego `docs/tickets/README.md` (las 11 decisiones, la plantilla, el orden en 5 fases) |
| Construir un ticket | `docs/tickets/<ID>.md` y los de sus dependencias. **Nada más** |
| Arrancar en frío / despachar a alguien | `HANDOFF-BUILD.md` — brief de arranque · y `references/rol-agente-dev.md` de la skill `metodo-tickets`, que sirve de brief tal cual |
| Saber qué pasó antes | `docs/BITACORA.md` — append-only, lee el final |
| Escribir CSS o tocar el navegador | `docs/gotchas.md` — lo que ya costó tiempo aquí · skill `modern-css` |
| Decidir cualquier cosa visual | `PLAN-TICKETS.md` §1 · skill `design-taste-frontend` (dials **ya cerrados**, no los recalcules) |
| Escribir un test | `PLAN-TICKETS.md` §3 · skill `tdd`. **Solo el Seam B está acordado** |
| Usar una palabra del dominio | `CONTEXT.md` — el glosario manda en el código y en los tests |
| Saber por qué algo se decidió así | `docs/adr/` · `PLAN-TICKETS.md` §4 · `DOCUMENTO-FUNDACIONAL.md` |
| Ver la forma ya validada de la Ficha | `prototipo/ficha-proto.html` — ábrelo. **No es código a portar** |

## Dónde vive el estado — y qué NO se escribe a mano

Tres archivos, tres naturalezas. Confundirlas es lo que desincroniza el estado.

| Archivo | Qué es | Cómo se toca |
|---|---|---|
| El campo `Estado:` de cada `docs/tickets/*.md` | **La única fuente de verdad.** Vive pegado al trabajo | A mano, un carácter: `⬜` → `🟡` → `✅` |
| `docs/tickets/ESTADO.md` | **Derivado.** Conteos, pendientes, listos para tomar, coherencia | **Nunca a mano.** `node scripts/estado-tickets.js --escribir` |
| `docs/BITACORA.md` | **Append-only.** Qué pasó y cuándo | Una línea al final. **Nunca se reescribe ni se reordena** |

`scripts/estado-tickets.js` detecta solo los tickets nuevos, los que les falta un campo, los de
ámbito inválido, y **los cerrados que dependen de uno abierto**. Sale con código 1 si algo no
cuadra. **Si un conteo escrito en prosa no coincide con el script, el que miente es la prosa.**

### Al cerrar sesión — tres gestos, no más

1. `Estado:` del ticket al icono que toca.
2. Una línea al final de `docs/BITACORA.md`, con el **commit real**.
3. `node scripts/estado-tickets.js --escribir` y commitea.

### El handoff de sesión es desechable

Vive **fuera del repo** (temp, escritorio). Nada del repo depende de él. **No se reescribe: se
tacha** — la sesión nueva corre `node scripts/handoff.js <ruta>`, que lo cruza contra el estado real
y tacha lo ya hecho. Cuando ya no menciona ningún ticket abierto, se borra. Lo que **sí** debe
llevar es lo que todavía no está escrito en el repo; **lo que ya está en un ticket no se copia**.

## Prohibiciones duras

- **Lo que no existe no se fabrica.** Nombres de caballos, sexo, nacimiento, raza, capa, alzada,
  descripción, teléfono, correo, testimonios, premios, precios, cualquier número. **Un placeholder
  tiene que verse como placeholder en pantalla**, y si una sección necesita un dato que no existe,
  **esa sección no se renderiza**.
- **No extraigas las fotos del PDF ni las uses.** 0 de 88 llegan a 1200 px.
- **`Origen: PROPIO` + lógica ⇒ el ticket se detiene y se escala a César.** No se improvisa
  mecanismo.
- **Ningún test en un seam no acordado.** Solo el Seam B (T-04). Los seams A y C se verifican a mano
  y esa verificación está en el `Hecho cuando:` de T-03 y T-09.
- **No reabras las decisiones cerradas** de `docs/tickets/README.md`. Si crees que una está mal,
  **dilo y sigue**; no la cambies por tu cuenta.
- **No edites `docs/tickets/ESTADO.md` a mano.**

## Deploy

Resuelto en T-01 (2026-08-30). El sitio vive en Vercel, proyecto `stamariahorses`, enlazado por
integración de GitHub al repo `github.com/cesar32777/stamariahorses`. **Rama de producción:
`master`. Cada push a `master` dispara un build de producción automático** — publicar es
`git push`, no hay paso manual de César. Estado de un build: MCP de Vercel (`get_deployment`,
`get_deployment_build_logs`), team `team_wSQzNEiZ6JNwrBWQ796nePAR`. La cuenta de GitHub
`cesar32777` es independiente de las de trabajo y ya está logueada en `gh` en la máquina de César.

## Metodología de verificación

- **La condición de terminado se verifica ejecutando, no leyendo el código.** Un fix que nunca
  corriste no está verificado.
- **Mide leyendo el DOM** (`getComputedStyle`, `getBoundingClientRect`), no mirando screenshots. El
  screenshot es para juzgar si algo **se ve** bien; con `overflow: hidden` una sección rota se ve
  limpia y vacía, no desbordada.
- **Rojo antes que verde, de a uno.** Una prueba que nunca estuvo roja no prueba nada. Y antes de
  dar una por buena: **¿qué escenario la pondría en rojo?** Si no sabes contestarlo, no mide nada.
- **`git status` limpio ANTES de decir "terminado"**, y las suites re-corridas contra el árbol ya
  limpio. Un número medido contra un árbol que ya no existe no es un número.
- **Di explícitamente qué NO verificaste.** Un ticket con un hueco declarado es utilizable; uno que
  se declara completo sin serlo obliga a revisarlo entero.
- **`prefers-reduced-motion` es obligatorio** en todo lo que tenga `Animación: sí`. Ni axe ni el
  linter lo detectan.
- **El objetivo del linter es el baseline, no el cero.** *"No hay errores"* no detecta una regresión.

## Antes de escribir una sola línea

1. `docs/tickets/ESTADO.md` — qué está listo para tomar.
2. El ticket y los de sus dependencias. **No leas este archivo ni el README enteros si te
   despacharon con un brief**: el brief ya te copió lo que necesitas.
3. `docs/gotchas.md` antes de tocar el navegador o escribir CSS.
4. **Un ticket a la vez.** Termínalo, verifícalo por ejecución, reporta, y recién entonces el
   siguiente. No adelantes trabajo de tickets futuros.
5. Commitea al terminar la sesión — todos los archivos que tocaste, no solo el código.
