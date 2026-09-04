# Handoff de construcción — Santa Maria Performance Horses

**Para:** el agente que va a construir el sitio.
**Fecha:** 2026-08-29.
**Estado del repo:** planeación cerrada, **cero código**. No hay git, no hay `package.json`.
**Tu trabajo:** ejecutar los tickets de `docs/tickets/`, **uno a la vez**, en orden.

Arrancás en frío: no heredaste nada de la sesión que escribió esto. Todo lo que necesitás
saber está acá o en los archivos que este documento nombra. No supongas nada que no esté escrito.

---

## 0. Antes de tocar nada

### Cargá estas skills, en este orden

0. **`/metodo-tickets`** — el método de construcción: cómo es un ticket, dónde vive el estado, y el
   protocolo de cierre. **Ignorá su parte de TDD**: este proyecto no tiene tests (ver §5).
   Su `references/rol-agente-dev.md` es tu rol completo.
   Este proyecto corre su **carril secuencial**: un ticket a la vez, sin worktrees ni integrador.

1. **`/design-taste-frontend`** — gobierna toda decisión visual. Los dials ya están razonados y
   cerrados (`7 / 4 / 3`); **no los recalcules**. Lo que sí tenés que hacer con esta skill:
   - Respetar §4 (tipografía, color, layout) y §9 (AI Tells prohibidos).
   - Correr el **Pre-Flight Check §14** antes de dar por cerrada cualquier pantalla. Es
     mecánico: contar eyebrows, buscar em-dash literal, verificar tema y acento únicos.
2. **`/modern-css`** — gobierna cómo escribís el CSS. Relevante en concreto para este proyecto:
   - **Container queries** en vez de media queries para la galería y las tarjetas. El número de
     columnas debe responder al contenedor, no al viewport.
   - **`display: grid-lanes`** (masonry nativo) para la galería. Tiene **orden de tabulación
     lógico**, cosa que las columnas CSS del prototipo **no** tienen. Es una mejora real de
     accesibilidad sobre el prototipo. Como el soporte todavía es parcial, **implementá con
     fallback** a `column-count`, no lo asumas disponible.
   - `light-dark()` y `color-scheme` para los tokens.

### Leé los documentos en este orden

| Archivo | Qué te da |
|---|---|
| `CLAUDE.md` + `docs/tickets/README.md` | **Empieza aquí.** El índice, las 11 decisiones, la plantilla, dónde vive el estado |
| `docs/tickets/ESTADO.md` | Derivado: qué está hecho y **qué está listo para tomar ahora** |
| `PLAN-TICKETS.md` | §1 diseño y §3 verificación. **§2 ya no es fuente de verdad**: los tickets viven en `docs/tickets/` |
| `docs/gotchas.md` | Lo que ya costó tiempo en este entorno. Léelo antes de tocar el navegador |
| `PRODUCT.md` | Usuarios, propósito, restricciones, 5 principios de producto |
| `DOCUMENTO-FUNDACIONAL.md` §0 | Hechos **medidos**, incluida la estructura de la página del jet |
| `CONTEXT.md` | Glosario. Usá estas palabras en el código y en los tests |
| `docs/adr/0001`, `docs/adr/0002` | Por qué no hay CMS, y por qué sans y no serif |

**No releas el PDF ni jetmonde.com.** Ya están medidos y volcados. Volver a hacerlo quema
contexto sin agregar nada.

---

## 1. El prototipo — mirálo antes de escribir código

`prototipo/ficha-proto.html` — abrilo en el navegador.

Es la Ficha completa con **datos reales** de `data/caballos.json` y marcadores de color sólido
en el ratio real. Tiene un selector de los 14 caballos y tres modos de galería para comparar.
Se regenera con `cd prototipo && python build_proto.py`.

**Es la referencia estructural de la Ficha.** No es código a portar (es HTML plano sin
framework), es la forma ya validada. Lo que el prototipo prueba, medido sobre los 14 caballos:

- El hero partido con **caja casi cuadrada y `object-fit: contain`** funciona con hero vertical
  y horizontal. Resuelve RF12.
- La galería **modo B** (masonry, cada foto en su bucket real) funciona en los 14. Sin celda
  vacía, sin desborde, sin recorte doble.
- El **modo A** (par 2-up fijo como el jet) **falla**: recorta las fotos por segunda vez y deja
  celda vacía con cuenta impar. No lo vuelvas a intentar.

---

## 2. Decisiones cerradas — no las reabras, no las mejores

Si creés que alguna está mal, **decílo y seguí**; no la cambies por tu cuenta.

1. **Sans display, licencia libre.** `Cabinet Grotesk Display` (titulares) + `Satoshi` (texto),
   los dos de Fontshare, gratis. Alternativa `Geist` + `Geist Mono`. ADR-0002. **Nada de serif.**
2. **Fondo claro, neutro frío.** No `#1E1F21`. La escena es un comprador con sol en la pantalla.
   Un solo acento, y **que no sea latón, terracota ni crema**: los caballos son bayos y un fondo
   cálido los disuelve. `PLAN-TICKETS.md` §1.4.
3. **Dials `7 / 4 / 3`** (variance / motion / density). Razonados en §1.2. No los cambies.
4. **Movimiento: solo tres cosas**, listadas en §1.2. Fade+translateY al entrar en viewport,
   `scale(0.98)` en `:active`, transición de opacidad al cambiar foto. **Prohibido** scroll
   hijack, parallax, marquee, sticky-stack, cursor custom, loops infinitos.
   `prefers-reduced-motion` es obligatorio, no opcional.
5. **Cinco bloques en la portada y la ficha, nada más.** Sin "Nosotros", sin historia, sin
   testimonios, sin mapa, sin blog, sin filtros, sin comparador. Principio 5: poco alcance,
   alta ejecución. **No agregues secciones.**
6. **Estructura de la Ficha = la de la página del jet**, con la galería reemplazada y dos
   bloques eliminados. Está detallada en `PLAN-TICKETS.md` §1.5.
7. **No hay tests ni TDD.** Ver §5 de este documento.
8. **Cero em-dash (`—`) en texto visible del sitio.** Guion normal. Es regla dura de la skill y
   se audita en el Pre-Flight.

---

## 3. Lo que NO existe y NO se fabrica

Esto es lo más fácil de romper sin darse cuenta. `PRODUCT.md` lo dice: *"No existe, y no se debe
fabricar."*

- **Nombres reales de los caballos.** Los actuales son `"Caballo 01"`… y son placeholder.
- **Sexo, nacimiento, raza, capa, alzada, descripción.** Todos `null`.
- **Teléfono y correo.** `null` en `data/caballos.json`.
- **Fotos utilizables.** 0 de 88 imágenes llegan a 1200 px. **No extraigas las del PDF ni las
  uses.** Se construye con marcadores de color sólido (RF7).
- **Testimonios, premios, historial, pedigrí, precios, cualquier número.**

**Regla operativa:** mientras un dato sea placeholder, tiene que **verse** como placeholder en
pantalla. No inventes nombres plausibles de caballos ni cifras de ejemplo. Si una sección
necesita un dato que no existe, esa sección no se renderiza.

---

## 4. Cómo ejecutar los tickets

**Uno a la vez.** Terminá un ticket, verificalo por ejecución, reportá, y recién ahí pasá al
siguiente. No arranques tres en paralelo ni adelantes trabajo de tickets futuros.

Los tickets están en `docs/tickets/<ID>.md`, cada uno con sus campos y su condición de terminado.
**La condición de terminado se verifica ejecutando, no leyendo el código.** Un fix que nunca
corriste no está verificado.

`node scripts/estado-tickets.js` te dice cuáles están listos para tomar — los pendientes cuyas
dependencias ya cerraron. **No lo deduzcas a mano.**

Al cerrar cada ticket, tres gestos y ni uno más: `Estado:` del ticket · una línea al final de
`docs/BITACORA.md` con el commit real · `node scripts/estado-tickets.js --escribir`.

### Orden y alcance de esta tanda

```
T-01 → T-02 → T-03 → T-04 → T-05 → T-06 → T-07 → T-08a → T-08b → T-09 → T-10 → T-13 → T-14
```

- **T-01 y su deploy: cerrados** (2026-08-30). El sitio está en Vercel enlazado a
  `github.com/cesar32777/stamariahorses`, rama de producción `master`, **auto-deploy en cada
  push**. Ver `## Deploy` en `CLAUDE.md`.
- **T-11 y T-12 están bloqueados** por fotos que no existen. No los toques.
- **T-08b lleva una decisión de diseño abierta dentro** (el largo de scroll de la galería en
  móvil). Está escrita en el cuerpo de su ticket; resuélvela con el prototipo delante.
- **T-15 no es tuyo**: es la puerta de publicación y depende de datos de César.

### Stack propuesto, no confirmado

Next.js App Router con generación estática, TypeScript, Tailwind v4, `next/image`.
Está propuesto en `PLAN-TICKETS.md` §2, **no verificado en este entorno**. T-01 lo verifica.
Si algo no funciona, cambialo y dejá escrito por qué.

---

## 5. Verificación — no hay tests, y no los escribas

**Este proyecto no tiene suite ni runner** (decisión de César, 2026-09-04). La skill `metodo-tickets`
habla de TDD; **esa parte no aplica acá**. Si te dan ganas de instalar Vitest, no.

Tres redes automáticas, todas restricciones que viven en el build:

| Red | Qué caza |
|---|---|
| `CatalogoSchema` (T-02) | Dato mal formado o campo obligatorio ausente |
| Guardas de `src/data/catalogo.ts` (T-03) | Slug vacío o duplicado |
| `npm run lint:baseline` (T-16) | Regresión de lint sobre el baseline |

**Una guarda que nunca viste fallar no está verificada.** Rómpela a propósito una vez y mírala caer.

Todo lo demás lo verifican los ojos, midiendo el DOM del sitio corriendo (`getComputedStyle`,
`getBoundingClientRect`) a los anchos que fije el campo `Verificación:` del ticket. El screenshot
sirve para juzgar si algo **se ve** bien; la medición, para saber si está donde debe.

Dos verificaciones manuales son obligatorias y se repiten, no se dan por hechas:

- **RF1** — navegá la URL directa de un caballo `retirado` y confirmá el 404. Cada vez que toques el
  filtro, y otra vez en T-15 antes de publicar. Es la única falla silenciosa y costosa del sistema.
- **RF11/RF13** — el bucket de cada foto. `data/caballos.json` trae el `bucket` **medido antes de que
  existiera el código de render**: ese archivo es el valor esperado, y `/prueba-imagen` renderiza las
  86 de una vez para compararlas. **No recalcules el bucket con la misma fórmula que estás
  comprobando**: es tautológico y pasa por construcción.

**Vocabulario:** usá las palabras de `CONTEXT.md` (Catálogo, Ficha, Galería, Foto, bucket, `focus`).
No "item", no "record", no "entity".

---

## 6. Cómo verificar — método probado en este entorno

### Navegador

El MCP `chrome-devtools` funciona. Dos cosas que cuestan tiempo si no las sabés:

- **Si al abrir el navegador te dice "browser is already running"**, hay un Chrome zombi con el
  perfil del MCP. Matalo solo a él, no el Chrome del usuario:
  ```powershell
  Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" |
    Where-Object { $_.CommandLine -like '*chrome-devtools-mcp*' } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
  ```
- **Para móvil real usá `emulate` con viewport, no `resize_page`.** La ventana no baja de ~500 px
  y vas a medir un layout que ningún usuario ve. `emulate` con `390x844x3,mobile,touch` sí llega.
  Ojo: `emulate` recarga la página y resetea el estado de JS.
- **Medí leyendo el DOM (`getComputedStyle`, `getBoundingClientRect`), no mirando screenshots.**
  Es más barato en contexto y no se equivoca. Los screenshots son para juzgar si algo se ve bien,
  no para medir.
- **Cuidado con medir el fondo en `document.body`.** En la referencia el body reporta blanco y la
  página es oscura: el color lo pinta un wrapper. Subí por los ancestros hasta encontrar el
  primer background no transparente.

### Entorno

- **Usá la herramienta `Write` para archivos markdown enteros.** Un heredoc de bash con acentos
  y comillas falla (`unexpected EOF`). Para ediciones quirúrgicas, `python - <<'PY'` con
  `io.open(..., encoding='utf-8')` **sí** funciona.
- Python tiene `PyMuPDF` (`fitz`) y `pypdf`. **No** hay `pdftoppm` ni ImageMagick.
- Windows. La shell principal es PowerShell; también hay bash. Cada una con su sintaxis.

---

## 7. Cómo tratar a César

Está en su `CLAUDE.md` global, que se carga solo. Lo que más pesa acá:

- **Máximo dos preguntas a la vez.** Más lo abruman y frenan la ejecución.
- **Nada de tutoriales ni de soluciones anticipadas.** Un dato de viabilidad de una línea para
  desbloquear está bien; explicarle cómo se hace, no.
- **Nombrá la ambigüedad en vez de resolverla**, con el costo real de cada variante.
- **Actualizá los documentos después de cada respuesta suya**, no al final.
- **Reportá lo que probaste y lo que no.** Si algo quedó sin verificar, decilo explícito.
- No quiere batallar. Si una decisión se puede tomar con un default sensato, tomala y avisá.

---

## 8. Preguntas abiertas — ninguna te bloquea

No preguntes por estas al arrancar. Están registradas y César las va a contestar cuando pueda.
Construí con placeholder y seguí.

1. **Teléfono y correo del rancho.** Bloquea T-10 y publicar. Lo más barato de responder.
2. **Los 14 nombres reales.** Bloquea publicar y el texto alternativo.
3. **Sobre qué se corrió Magnific** (originales de cámara u imágenes del PDF). Bloquea T-11.
4. **¿Existen originales de ≥1600 px?** (T0.1). Es el riesgo #1 del proyecto.

**La única decisión de diseño que sigue abierta y que sí vas a tener que resolver** está dentro
de T-08b: en móvil, la galería a una columna da 5711 px de página para el caballo 08, casi 7
pantallas. Tres salidas posibles, ninguna probada: dos columnas en móvil, carrusel horizontal con
`scroll-snap`, o aceptar el scroll largo. Probá con el prototipo delante y decidí. Si las tres te
parecen igual de buenas, preguntá (cuenta contra el máximo de dos).

---

## 9. Definición de terminado de todo el encargo

- Los tickets T-01 a T-10 cerrados, cada uno con su condición verificada por ejecución.
- T-13 (accesibilidad y rendimiento) y T-14 (Pre-Flight Check §14) corridos, con la lista de qué
  casilla falló y qué hiciste con cada una.
- `DESIGN.md` escrito con los tokens que sobrevivieron al build. `impeccable` lo exige y T-06
  lo pide.
- Cada ticket cerrado con su `Estado:` actualizado, su línea en `docs/BITACORA.md`, y
  `ESTADO.md` regenerado. Toda decisión nueva escrita **en el cuerpo de su ticket**, no en un chat.
- Toda gotcha que te costara más de diez minutos, apendizada a `docs/gotchas.md`.
- Un reporte final que diga **explícitamente qué quedó sin verificar**, sobre todo lo que
  depende de fotos que no existen.

**Lo que no está terminado y no hay que fingir que sí:** el sitio no se puede publicar hasta que
existan el contacto, los nombres y las fotos. Construir la maqueta completa es el encargo;
declararla lista para publicar, no.
