# ADR-0004 — Navegación, ancho completo y catálogo poblado con muestra

- **Estado:** Aceptada
- **Fecha:** 2026-08-30
- **Decide:** César
- **Extiende:** [ADR-0003](0003-reskin-identidad-catalogo-impreso.md). No la reemplaza: el tema
  cream, Playfair, el acento sepia y la esquina viva **siguen intactos**.
- **Modifica:** `docs/tickets/README.md` decisión 5 (cinco bloques, no agregar secciones) y el
  valor de `--content-max` fijado en ADR-0003.

## Contexto

César volvió a poner a la vista las dos pantallas de jetmonde.com (la de flota y la de un jet
concreto) y señaló que la réplica quedó a medias. Lo que falta, en sus palabras: que **se vea
literalmente como la página de jets**. Concretamente cuatro cosas que hoy no están:

1. **No hay barra de navegación.** El jet tiene una: marca a la izquierda, enlaces a la derecha,
   filete de 1px abajo, y la primera fila de fotos se ve junto con ella en el primer viewport.
2. **La portada no ocupa el ancho del escritorio.** ADR-0003 fijó `--content-max: 1120px` con el
   argumento de que "el grid de la flota es angosto". **Ese argumento era falso**: medida la
   captura de la referencia, el grid va de borde a borde con ~15 px de margen lateral, no
   centrado a 1120.
3. **La Ficha no tiene el bloque de datos del jet completo** ni su eyebrow ni su enlace de
   cierre. Hoy rinde 5 filas; la del jet rinde 8 y se lee como ficha técnica.
4. **El enlace "Contacto" de la barra no lleva a ningún lado**, y la portada no tiene CTA.

## Decisión

### 1. Barra de navegación global, y una página `/contacto`

Se agregan **una barra** (marca + 3 enlaces + filete) y **una ruta `/contacto`**. Esto contradice
la letra de la decisión 5 del backlog ("cinco bloques, no agregues secciones"), y se hace a
pedido explícito de César. La razón de la decisión 5 era **no inventar contenido de relleno**
("Nosotros", historia, testimonios); esa razón se respeta: `/contacto` no lleva copy inventado de
marca, lleva el teléfono, el correo y la ubicación del rancho, que es dato que el sitio ya tiene
que publicar de todas formas. **No se agregan "Nosotros", "Historia" ni "Testimonios".**

### 2. Ancho completo (`--content-wide`)

Se agrega un token `--content-wide: 100%` que usan la barra, la portada y la Ficha, midiendo el
canal lateral con `--gutter`. `--content-max: 1120px` **se conserva** para el único sitio donde un
ancho de lectura importa: la columna de texto de `/contacto`. El grid, el hero y la Ficha van a
todo el ancho, como la referencia.

### 3. Datos de muestra poblados, con la marca hecha discreta

Los 14 caballos pasan de `"Caballo 01"` + valores idénticos a **nombres inventados y una ficha
técnica distinta por caballo**, y `vendedor` a un teléfono y correo con forma real.

**Esto es fabricar dato, que es la prohibición dura número 10 del backlog.** Se hace a pedido
explícito de César, que ya había abierto esta puerta en la actualización de T-10 del 2026-08-30
con el mismo mecanismo. La prohibición **no se levanta, se paga**:

- El flag `ejemplo: true` de `data/caballos.json` sigue siendo el interruptor. Quitarlo apaga
  todas las marcas de una vez, sin tocar componentes.
- La banda de aviso sigue en cada página, pero **baja de párrafo a una sola línea fina** — César
  pidió que el bloque de datos se lea como el del jet, no tapado por una advertencia.
- Los `<dd>` **dejan la cursiva gris** por la misma razón, y a cambio el rótulo "Datos de
  ejemplo" queda pegado arriba del bloque, donde el ojo cae antes de leer los valores.

**El riesgo queda escrito:** el sitio publica a `master` un catálogo que se lee como verdadero
salvo por dos señales pequeñas. Si alguien lo comparte fuera de contexto, va a parecer real. La
mitigación es el interruptor, no el diseño.

### 4. Campos nuevos en el esquema

La lista del jet tiene 8 filas; con `sexo`, `nacimiento`, `raza`, `capa` y `alzada` solo salen 5.
Se agregan cuatro campos nulables — `peso`, `padre`, `madre`, `registro` — que son el vocabulario
estándar de un catálogo de venta de caballos y **no reintroducen `disciplina`** (decisión 11 y
`CONTEXT.md` siguen firmes: "Performance" es marca, no disciplina).

Todos nulables, todos sujetos a RF5: campo ausente, fila ausente.

## Consecuencias

- Cuatro tickets nuevos de construcción (T-19 a T-22) más uno de datos (T-18). El backlog pasa de
  18 a 23.
- `DESIGN.md` gana la barra y el token de ancho; no cambia ningún color ni ninguna fuente.
- **Lo que NO cambia:** el tema sigue claro y cream (César descartó explícitamente copiar el
  `#1E1F21` del jet, por la misma razón de PLAN §1.4 que ya sostuvo ADR-0003); la Ficha sigue con
  la foto **contenida** sin recorte (RF12); la Galería sigue siendo la de T-08b.
- La verificación de T-11 (`naturalWidth` ≥ 2× el ancho renderizado) se vuelve **más exigente**:
  a todo el ancho las fotos se renderizan más grandes que a 1120 px. Anotado en T-11.
