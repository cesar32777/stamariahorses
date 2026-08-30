# Backlog de construcción — Santa María Performance Horses

Un ticket por archivo. **Este README es el índice y las reglas; el estado vivo de cada ticket vive
en su propio archivo.**

Generado el 2026-08-30 desde `PLAN-TICKETS.md` §2 (tickets), §1.2 (movimiento permitido) y §3
(seams de TDD). El método es la skill **`metodo-tickets`**, destilada de un proyecto anterior de 50
tickets; **todo lo que dice se ganó rompiendo algo**.

**Estado derivado: [`ESTADO.md`](ESTADO.md)** — generado, nunca a mano.

---

## Las decisiones que gobiernan este backlog

Cerradas antes de generar los tickets. **No re-litigar sin César.** Si crees que alguna está mal,
**dilo y sigue**; no la cambies por tu cuenta.

1. **Sans display de licencia libre.** Cabinet Grotesk Display (titulares) + Satoshi (texto), los
   dos de Fontshare. Alternativa: Geist + Geist Mono. **Nada de serif** (ADR-0002).
2. **Fondo claro, neutro frío.** No `#1E1F21`. Un solo acento, **y que no sea latón, terracota ni
   crema**: los caballos son bayos y un fondo cálido los disuelve.
3. **Dials `7 / 4 / 3`** (variance / motion / density). Razonados en `PLAN-TICKETS.md` §1.2.
   **No los recalcules.**
4. **Movimiento: solo tres cosas.** Fade + `translateY` al entrar en viewport · `scale(0.98)` en
   `:active` · transición de `opacity` al cambiar de foto. **Prohibido** scroll hijack, parallax,
   marquee, sticky-stack, cursor custom, loops infinitos. `prefers-reduced-motion` es **obligatorio**.
5. **Cinco bloques en portada y ficha, nada más.** Sin "Nosotros", sin historia, sin testimonios,
   sin mapa, sin blog, sin filtros, sin comparador. **No agregues secciones.**
6. **Sin CMS** (ADR-0001). Catálogo estático desde `data/caballos.json`.
7. **Estructura de la Ficha = la de la página del jet**, con la galería reemplazada y dos bloques
   eliminados. Detallada en `PLAN-TICKETS.md` §1.5.
8. **Solo el Seam B tiene tests.** Los seams A y C se verifican a mano, y esa verificación vive en
   el `Hecho cuando:` de T-03 y T-09. **Ningún test en un seam no acordado.**
9. **Cero em-dash (`—`) en texto visible del sitio.** Guion normal. Se audita en T-14.
10. **Lo que no existe no se fabrica.** Nombres, sexo, nacimiento, raza, capa, alzada, descripción,
    teléfono, correo, fotos utilizables, testimonios, premios, precios. **Un placeholder tiene que
    verse como placeholder en pantalla**, y si una sección necesita un dato que no existe, esa
    sección no se renderiza.
11. **El catálogo no se filtra ni se agrupa por disciplina.** "Performance" es marca, no disciplina;
    no existe un campo `disciplina` (`CONTEXT.md`).

---

## Plantilla de ticket

```markdown
# T-07 — Grid del Catálogo
Origen: PROPIO
Fuente: —
Fase: C
Referencia: PLAN §1.2 · skill `design-taste-frontend` §7
Estado: móvil ⬜ · escritorio ⬜
Depende de: T-03 · T-05 · T-06
Animación: sí
Tests: capa 2 → medición del DOM a 375, 768 y 1440 px
Datos: placeholder
Hecho cuando: las 14 tarjetas correctas a los tres anchos, sin desborde horizontal
```

Bajo el bloque de campos van `---` y prosa libre: alcance, **gotchas que ya costaron tiempo**, copy
literal y bloqueos. Un ticket sin cuerpo obliga a re-derivar el contexto en cada sesión — y la
sesión que lo re-deriva se equivoca distinto que la anterior.

### Los campos, y por qué cada uno está

| Campo | Qué hace |
|---|---|
| `Origen:` | `HEREDADO` (mecanismo de la referencia o del framework) · `PATRÓN` (markup propio, mecanismo público citado) · `PROPIO` (diseño puro). **`PROPIO` + lógica ⇒ el ticket se detiene y se escala a César**, no se improvisa mecanismo |
| `Fuente:` | Dónde está el mecanismo citado. Obligatorio en `PATRÓN` y `HEREDADO`; `—` en `PROPIO` |
| `Fase:` | `A`–`E`. Es la agrupación real del backlog — **el número del ticket no es su orden** |
| `Referencia:` | Dónde mirar antes de construir: sección de `PLAN-TICKETS.md`, ADR, el prototipo |
| `Estado:` | **La única fuente de verdad.** Dos columnas a propósito: cuando llegue el eje de escritorio **no se abren tickets nuevos, se llena la segunda columna** |
| `Depende de:` | IDs reales. Es lo que el script cruza para detectar incoherencias y para decir qué está listo para tomar |
| `Animación:` | `sí` obliga `prefers-reduced-motion` en la definición de hecho. **Ni axe ni el linter lo detectan** |
| `Tests:` | Qué capa toca. `—` cuando el seam no está acordado, con la verificación manual en `Hecho cuando:` |
| `Datos:` | `real` / `placeholder` / `bloqueado`. **Un ticket verificado contra datos de mentira no está verificado** — este campo es lo que hace visible esa deuda antes de la semana de lanzar |
| `Hecho cuando:` | Verificable **por ejecución**, no por lectura. Un fix que nunca corriste no está verificado |

---

## Orden de ejecución

**El número del ticket no es su orden**, aunque aquí casi coincidan. El orden es el camino crítico:

```
T-01 → T-02 → T-03
             ↓
       T-04 → T-05   ← aquí el proyecto ya puede construir UI sin fotos
             ↓
       T-06 → T-07 → T-08a → T-08b → T-09 → T-10
                                    ↓
                      (llegan fotos) T-11 → T-12
                                            ↓
                                T-13 → T-14 → T-15
```

| Fase | Tickets | Por qué |
|---|---|---|
| **A — cimientos** | `T-01` → `T-02` → `T-03` | Secuencial y duro |
| **B — el sistema de imagen** | `T-04` → `T-05` | Lo más riesgoso, primero. **`T-05` es la bisagra**: con el marcador en el ratio correcto, toda la fase C se construye sin una sola foto real |
| **C — las dos plantillas** | `T-06` → `T-07` → `T-08a` → `T-08b` → `T-09` → `T-10` | Portada y ficha |
| **D — cuando lleguen las fotos** | `T-11` → `T-12` | **Bloqueada por datos que no existen.** No la toques |
| **E — cierre** | `T-13` → `T-14` → `T-15` | Accesibilidad, Pre-Flight y la puerta de publicación |

**`node scripts/estado-tickets.js` dice en cada momento cuáles están listos para tomar** — los
pendientes cuyas dependencias están todas cerradas. No lo deduzcas a mano.

### Carril secuencial, por ahora

Este backlog se ejecuta **un ticket a la vez, en una rama**. La maquinaria de worktrees paralelos y
rol integrador existe y está escrita en la skill `metodo-tickets`
(`references/rol-integrador.md`), pero **no se monta hasta que haga falta**: con 16 tickets y un
camino crítico casi lineal, coordinar worktrees cuesta más de lo que ahorra.

**Se activa cuando el grafo se abra de verdad** — el primer candidato natural es la fase C, donde
`T-07` y la pareja `T-08a`/`T-08b` no dependen entre sí.

---

## Trampas ya identificadas — no re-descubrir

- **El par 2-up fijo de la referencia (modo A de la galería) falla.** Medido sobre los 14 caballos:
  recorta las fotos por segunda vez y deja celda vacía con cuenta impar. **No lo vuelvas a
  intentar** (T-08b).
- **`prefers-reduced-motion` no lo detecta axe ni el linter.** Si no lo pones tú, no lo pone nadie.
- **`display: grid-lanes` tiene soporte parcial.** Implementa con fallback a `column-count`; no lo
  des por disponible (T-08b).
- **`emulate` recarga la página y resetea el estado de JS** en el MCP de navegador. Y para móvil
  real hay que usar `emulate`, no `resize_page` — la ventana no baja de ~500 px.
- **Un heredoc de bash con acentos falla** (`unexpected EOF`). Usa `Write` para markdown entero, o
  `python - <<'PY'` con `io.open(..., encoding='utf-8')`. Ver `../gotchas.md`.
- **El objetivo del linter es el baseline, no el cero.** Un scaffold llega con ofensas heredadas y
  el linter sale con código 0 pese a ellas: *"no hay errores"* **no** detecta una regresión (T-01
  fija el baseline).
- **No extraigas las fotos del PDF ni las uses.** 0 de 88 llegan a 1200 px.

---

## Bloqueos abiertos

Ninguno bloquea la maqueta. Todos bloquean publicar. Registrados también en `HANDOFF-BUILD.md` §8.

| Bloqueo | Bloquea a |
|---|---|
| Teléfono y correo reales de Rancho Santa María | `T-10`, `T-15`. **Lo más barato de responder** |
| Los 14 nombres reales | `T-13` (alt real), `T-15` |
| ¿Existen originales de ≥1600 px? | `T-11`, `T-12`. **Riesgo #1 del proyecto** |
| Sobre qué se corrió Magnific (originales de cámara o imágenes del PDF) | `T-11`, `T-15` |

Y **una decisión de diseño abierta que sí se resuelve construyendo**, dentro de `T-08b`: el largo de
scroll de la galería en móvil (5711 px en el caballo 08).

---

## Referencias

- [`ESTADO.md`](ESTADO.md) — derivado. **Nunca a mano.**
- `../BITACORA.md` — append-only. Qué pasó y cuándo.
- `../gotchas.md` — lo que ya costó tiempo en este entorno.
- `../../PLAN-TICKETS.md` — §1 diseño · §3 TDD · §4 decisiones. **§2 ya no lleva estado: vive aquí.**
- `../../PRODUCT.md` · `../../CONTEXT.md` · `../../DOCUMENTO-FUNDACIONAL.md` · `../adr/`
- `../../HANDOFF-BUILD.md` — brief de arranque en frío.
- Skills: `metodo-tickets` (el método), `design-taste-frontend`, `modern-css`, `tdd`.
