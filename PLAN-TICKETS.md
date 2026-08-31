# Plan de ejecución — Santa Maria Performance Horses

Estado: **PARCIALMENTE ACORDADO** (2026-08-29). Cerrado por César: **sans display de licencia
libre** (§1.3, ADR-0002) y **solo el Seam B** de TDD (§3). El resto sigue siendo propuesta.
Fecha: 2026-08-29
Depende de: `PRODUCT.md`, `DOCUMENTO-FUNDACIONAL.md`, `CONTEXT.md`, `docs/adr/`.
Para construir: [`HANDOFF-BUILD.md`](HANDOFF-BUILD.md) y el prototipo en `prototipo/ficha-proto.html`.

Tres partes, en el orden en que hay que resolverlas:

1. **Análisis de diseño** — qué se ve y por qué. Bloquea el primer build de UI.
2. **Tickets de ejecución** — qué se construye, en qué orden, con qué condición de terminado.
3. **Estrategia TDD** — dónde van los tests. Bloquea el primer test.

En §4 está el registro de las dos preguntas, ya respondidas, y lo que queda abierto.

---

# 1. Análisis de diseño

Método: skill `design-taste-frontend`. Se sigue su orden: Design Read (§0.B), dials (§1),
decisiones de tipografía y color (§4), y el Pre-Flight Check (§14) antes de dar por cerrada
cualquier pantalla.

## 1.1 Design Read

> **Reading this as:** un catálogo foto-céntrico de inventario finito, para un comprador de
> caballos mexicano que llega en móvil y se va del sitio a llamar, con un lenguaje de
> _galería tranquila_ más que de _marca de lujo_, apoyado en CSS nativo + Tailwind, display
> sans con carácter, y movimiento contenido.

Las dos palabras que hacen trabajo ahí son **galería** y **contenida**, y las dos salen de
hechos medidos, no de gusto:

- **Galería, no marca.** El sitio tiene 14 productos y cero copy. No hay propuesta de valor
  que escribir, ni prueba social, ni especificaciones. Lo único que hay son fotos y seis
  campos de datos. Un lenguaje de marca premium exige copy que aquí no existe y que
  inventarlo sería fabricar (`PRODUCT.md`, "No existe — y no se debe fabricar").
- **Contenida.** R1 y R3 del Documento Fundacional. Las fotos son el material más débil del
  proyecto: 0 de 88 llegan a 1200 px. Cuanto más grita el envoltorio, más se nota la foto.
  Un lenguaje visual ambicioso sobre fotografía floja da un resultado **peor** que un
  lenguaje humilde, y eso ya está escrito como riesgo.

## 1.2 Los tres dials

Baseline de la skill: `8 / 6 / 4`. Presets cercanos: _Landing premium consumer_ `7/6/3`,
_Portfolio designer_ `8/7/3`, _Editorial_ `6/4/3`. El proyecto no cae limpio en ninguno, así
que se razona cada dial desde el brief en vez de copiar un preset.

### `DESIGN_VARIANCE: 7`

**Por qué no menos.** La asimetría acá no es una decisión estética, es una imposición de los
datos. 78 ratios distintos entre 86 fotos, reducidos a 5 buckets, con el set partido 44%
vertical / 33% horizontal. Cualquier grid de celdas uniformes recorta mal la mitad del
catálogo, y en un caballo el recorte malo corta patas o grupa, que es justo lo que mira un
comprador. El grid **tiene** que ser de ratio mixto. Eso ya es variance 6-7 por construcción.

Además, R5: 14 caballos bayos, mismo corral, mismo día, misma luz. La monotonía es un riesgo
real del catálogo, y la variación de composición es la única herramienta que queda para
romperla sin tocar las fotos.

**Por qué no más.** Variance 8-10 significa masonry con zonas vacías grandes y `2fr 1fr 1fr`.
Con 5 buckets fijos y móvil como caso principal, eso multiplica los casos de layout que hay
que probar por un beneficio estético que las fotos no pueden sostener. 7 compra el grid de
ratio mixto y el escalonado, sin comprar el caos.

### `MOTION_INTENSITY: 4`

**Por qué no más.** La referencia (jetmonde) usa reveals por scroll en casi todas las
secciones, y la tentación es copiar eso. Pero la skill tiene una regla dura: _"motion claimed,
motion shown"_ — si se declara 6 o 7 hay que entregar coreografía real, y si no se puede
entregar, hay que bajar el dial y enviar una página estática limpia. Este sitio se abre en un
teléfono, probablemente con señal de rancho, con una grid de imágenes como contenido
principal. El presupuesto de rendimiento se gasta en que las fotos carguen, no en Motion ni
GSAP.

**Por qué no menos.** 4 permite transiciones CSS fluidas, fade-in de entrada y estados de
hover/active táctiles. Es lo mínimo para que no se sienta un documento. Nota: 4 está por
encima de 3, así que `prefers-reduced-motion` es **obligatorio** (skill §6.B), no opcional.

**Inventario de movimiento permitido, cerrado.** Cada uno se justifica en una frase, como pide
§5 ("motion must be motivated"). Nada fuera de esta lista:

| Movimiento                                                                                                          | Qué comunica                                                    |
| ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Fade + `translateY` de las tarjetas al entrar en viewport (IntersectionObserver o CSS `animation-timeline: view()`) | Jerarquía: ordena la lectura de un grid largo                   |
| `scale(0.98)` en `:active` sobre tarjeta y CTA                                                                      | Feedback: confirma el toque en móvil                            |
| Transición de `opacity` al cambiar de foto en la Galería                                                            | Transición de estado: indica que cambió la imagen, no la página |

Prohibido explícitamente: scroll hijack, parallax, marquee, sticky-stack, cursor custom,
loops infinitos. Ninguno tiene una frase que lo justifique acá.

### `VISUAL_DENSITY: 3`

Art gallery. Es lo único coherente con "la foto manda" (Principio 4 de `PRODUCT.md`) y con
"un dato ausente desaparece" (Principio 2): las fichas van a ser cortas y desparejas, y la
densidad baja es lo que hace que una ficha con tres campos no se vea rota al lado de una con
ocho. Gaps de sección grandes (`py-24` a `py-32`), sin cajas de tarjeta, agrupación por
espacio negativo y no por borde.

**Resultado: `7 / 4 / 3`.** Toma la variance de _premium consumer_ y el motion de _editorial_.
No es ningún preset, y esa es la intención.

> **Reabierta 2026-08-30 por César → [ADR-0003](docs/adr/0003-reskin-identidad-catalogo-impreso.md).**
> Ahora el sitio va en serif (`Playfair Display`), fondo cream y acento sepia, con la estética de
> la página de flota de jetmonde. El argumento de abajo sigue siendo el riesgo aceptado; se
> revierte si las fotos reales (T-11/T-12) delatan la serif. Lo que sigue es el origen histórico.

## 1.3 La tensión de la serif — CERRADA: sans

La skill es explícita (§4.1, "SERIF DISCIPLINE"): serif es _"very discouraged as default"_, y
solo se acepta si el brief nombra una serif, **o** si la familia estética es genuinamente
editorial / luxury / publication / manuscript / heritage / vintage **y** se puede articular por
qué _esa_ serif encaja con _esta_ marca. `Fraunces` e `Instrument_Serif` están prohibidas.

### El argumento a favor de serif

Es más fuerte de lo que parece, y hay que decirlo antes de descartarlo:

- Un catálogo de venta de caballos con pedigrí **es** un artefacto de la familia _heritage /
  publication_. El catálogo de remate impreso y el stud book son objetos reales con siglos de
  tradición tipográfica, y esa tradición es didone y transitional en caja alta. No es la
  asociación floja de "creativo, entonces serif": es el artefacto nativo de la categoría.
- La portada del PDF de Eduardo Galán ya usa una serif display didone en caja alta
  (`DOCUMENTO-FUNDACIONAL.md` §0). O sea: la marca ya se expresó una vez, y lo hizo en serif.
- La referencia que dio César (jetmonde) usa `Nyghtserif`, weight 300, h1 a 90px.

### El argumento en contra, que es el que gana dado el objetivo

Tres cosas, en orden de peso:

1. **R3, que ya está escrito como riesgo.** "Copiar el layout de jetmonde sin su calidad
   fotográfica da un resultado peor que un diseño más humilde." Una didone de alto contraste a
   90px con `line-height: 1.1` es tipografía de precisión: sus remates finos le piden al ojo
   una nitidez que la foto de al lado, servida a 772 px, no va a cumplir. La serif de lujo no
   es neutral respecto a la calidad de la imagen — **la delata**.
2. **Es exactamente el default que las dos skills mandan a evitar.** `impeccable`
   (`new-work.md` §4) nombra la agrupación literal: _"warm cream ground, high-contrast serif
   display, and a terracotta or signal-red accent"_ como el cúmulo en el que cae la interfaz
   generada por IA cuando el brief la deja libre. Un rancho de caballos es precisamente el
   brief que aterriza ahí solo. Que el resultado sea predecible desde la categoría es el
   síntoma de que la autocrítica falló.
3. **`Nyghtserif` no es una opción real.** No está en el pool de la skill, no está prohibida,
   y **es de pago**. Copiarla obliga a comprarla o a sustituirla por una parecida, que es la
   peor de las dos opciones.

### Decisión — CERRADA 2026-08-29: sans display, licencia libre

Registrada en [ADR-0002](docs/adr/0002-tipografia-display-sans.md).

El objetivo que César precisó es el que decide: **ni lo más impactante y ambicioso, ni algo que
se vea mal.** Eso no es un punto medio tibio, es un criterio nítido: se descarta toda decisión
cuyo éxito dependa de que las fotos salgan excelentes.

Serif de contraste es exactamente esa clase de decisión. Su techo es más alto y su piso es más
bajo. Sans display tiene el techo un poco más bajo y el piso mucho más alto, y con 0 de 88 fotos
utilizables hoy, el piso es lo que hay que comprar.

**Elección:**

| Rol                  | Fuente                        | Licencia                             |
| -------------------- | ----------------------------- | ------------------------------------ |
| Titulares            | `Cabinet Grotesk Display`     | Fontshare, gratis para uso comercial |
| Texto y datos        | `Satoshi` o stack del sistema | Fontshare, gratis                    |
| Alternativa completa | `Geist` + `Geist Mono`        | Vercel, código abierto               |

Las tres se autohospedan con `next/font` sin trámite. **No hay fuente que comprar.** Eso también
era parte del pedido: no batallar.

**Por qué Cabinet Grotesk y no una grotesca neutra.** "Que no se vea mal" no significa "que no se
vea". Una grotesca de sistema no falla, pero tampoco dice nada, y este sitio necesita que el
nombre del rancho tenga alguna presencia. Cabinet Grotesk tiene carácter en las mayúsculas y en
los remates cortados sin pedirle nitidez a la foto de al lado. Está en la lista aprobada de la
skill.

**Descartadas:** `Nyghtserif` (de pago, fuera del pool), `Inter` como display, `Outfit`,
`DM Sans`, `Plus Jakarta Sans`, `Space Grotesk` (defaults de datos de entrenamiento nombrados por
`impeccable`), `Fraunces` e `Instrument Serif` (prohibidas por la skill).

**Regla relacionada, que se aplica igual:** el énfasis dentro de un titular se hace con itálica o
bold de la **misma** familia. Nunca metiendo una palabra serif en un titular sans.

### Lo que esta decisión compra y lo que cuesta

- **Compra:** con fotos mediocres el diseño **se degrada con dignidad** en vez de romperse. R1 y
  R3 vuelven a ser riesgo alto y dejan de ser bloqueante de diseño. T0.1 sigue siendo la Tarea 0
  más importante, pero porque un sitio foto-céntrico necesita fotos, no porque la tipografía lo
  exija.
- **Cuesta:** el techo visual baja. Este sitio no va a ganar un premio de diseño. No era el
  objetivo.
- **Se revisa** solo si T0.1 cierra bien y aparece un set claramente por encima de 2×. Con ese
  material, una serif deja de ser una apuesta. Antes de eso, no.

## 1.4 Color

> **Anulada en parte 2026-08-30 → [ADR-0003](docs/adr/0003-reskin-identidad-catalogo-impreso.md).**
> Se conserva "claro, no oscuro" y "un solo acento". Se anula "neutro frío / acento no cálido":
> el fondo va cream (`#f5f0e8`, papel del PDF) y el acento sepia tabaco (`#8a5a3c`), por decisión
> de César. El riesgo (los bayos se disuelven en un cromo cálido) queda escrito en el ADR.

`impeccable` pide elegir la estrategia antes que los colores, y escribir una frase de escena
física que fuerce la respuesta de claro contra oscuro.

**La escena:** un comprador mira el sitio en su teléfono, de día, probablemente afuera o en una
camioneta, con el brillo de la pantalla peleando contra el sol. Puede estar parado frente a
otros caballos.

Eso decide dos cosas de un tirón:

- **Claro, no oscuro.** El `#1E1F21` de jetmonde es un fondo de estudio de diseño mirado de
  noche en una laptop. Bajo sol directo, un fondo casi negro con fotos oscuras de caballos
  bayos es ilegible. Copiar ese token sería copiar la respuesta a una pregunta distinta.
- **Estrategia: Restrained** (neutros + un acento). El visitante vino a mirar, no a operar ni a
  leer, pero el contenido es tan visual que cualquier color que compita con las fotos es ruido.

**Y una prohibición dura, que hay que escribir porque es el error que este brief provoca:**
la skill (§4.2) prohíbe como default para briefs premium-consumer la paleta
_beige/crema + latón/arcilla/ocre + café casi negro_, con hexadecimales nombrados. Un rancho
de caballos es el brief que llama a esa paleta con más fuerza que ninguno.

Hay además una razón que no es de skill sino de este catálogo en particular, y es más fuerte:
**los 14 caballos son bayos y buckskin — o sea, la foto ya es de color tostado cálido.** Un
fondo crema y un acento latón hacen que el animal se disuelva en el cromo de la interfaz. El
fondo tiene que ser neutro frío o casi acromático precisamente para que la capa del caballo
sea lo único cálido de la pantalla.

**Dirección propuesta:** blanco roto de temperatura neutra o levemente fría como fondo,
tinta casi negra fría para el texto, y **un solo acento saturado que no sea latón ni terracota**
(candidato: un verde profundo, o un azul de señal, o nada de acento y que el único color sea el
del caballo). Los tokens exactos quedan provisionales hasta T-06: se calibran contra fotos
reales, porque calibrar contra los recortes de 200 px del PDF es calibrar contra ruido.

**Bloqueos de consistencia que se auditan en el Pre-Flight (§14):** un solo tema para todo el
sitio, un solo acento en todas las secciones, una sola escala de radio de esquina.

## 1.5 Arquitectura visual — poco alcance, alta ejecución

> **Bloque 2 modificado 2026-08-30 → [ADR-0003](docs/adr/0003-reskin-identidad-catalogo-impreso.md).**
> El grid del Catálogo pasa a 2 columnas iguales con foto 3:2 `cover` y el **nombre del caballo
> en serif sobrepuesto abajo-izquierda** (estética de la flota de jetmonde). "Sin pill sobre la
> imagen" ya no aplica al nombre: no es una pill, es el nombre como en la ficha del jet. La
> estructura de la Ficha (bloques 4-9) no cambia.

Principio 5 de `PRODUCT.md`. **Dos plantillas, cinco bloques en total.** Nada más.

### Portada (`/`)

1. **Encabezado con el catálogo empezando en el primer viewport.** El catálogo _es_ el hero.
   No hay un hero separado con titular y propuesta de valor, y eso es una decisión, no una
   omisión: no existe copy que poner ahí, y escribirlo sería inventar. El nombre del sitio, una
   línea de contexto, y arriba de la línea de scroll ya se ven las primeras fotos.
   Esto también esquiva la regla del hero de la skill: no hace falta que quepa un titular de 2
   líneas más 20 palabras de subtexto, porque no hay ninguno.
2. **Grid del Catálogo.** Ratio mixto, escalonado, solo Disponibles. Una foto por caballo (su
   hero) más el nombre. Nada más en la tarjeta: sin pill sobre la imagen, sin caption
   decorativa, sin etiqueta de categoría (§9.F).
3. **Pie con el contacto.** Teléfono y correo del rancho, `tel:` y `mailto:`. "Rancho Santa
   María" como origen.

### Ficha (`/caballos/[slug]`) — estructura tomada de la página del jet

César pidió que la Ficha siga estructuralmente a la página individual del jet de la referencia.
Esa página **se midió el 2026-08-29** y quedó volcada en `DOCUMENTO-FUNDACIONAL.md` §0. No es
una copia: tres de sus seis bloques transfieren, uno se reemplaza y dos se eliminan.

**Lo que se toma tal cual:**

4. **Miga de pan.** `Catálogo > nombre del caballo`. Barata y orienta.
5. **Hero partido 50/50: foto a la izquierda, datos a la derecha.**
   **La caja de la foto es casi cuadrada y usa `object-fit: contain`, no `cover`.** Esto es lo
   más valioso que dio la medición: es la respuesta directa a RF12. Una foto vertical y una
   horizontal caben en la **misma** caja sin recortar ninguna; la que no llena deja bandas, y
   sobre fondo liso la banda se lee como marco de galería, no como error. Los 4 heroes
   verticales dejan de ser un caso especial.
   En móvil la caja cambia de proporción (el jet pasa de 1:1 a 3:2) y la columna colapsa a una.
6. **Lista de datos: `etiqueta : valor`, una por línea, sin bordes ni tabla.**
   Encaja exacto con RF5: un campo ausente simplemente no rinde su línea, y no queda hueco,
   borde huérfano ni celda vacía. Es el patrón que la skill recomienda en vez de la tabla de
   especificaciones con hairline por fila.

**Lo que hay que reemplazar, y es el trabajo de diseño real:**

7. **La Galería.** El jet tiene **2 fotos fijas** en un par de 3:2. Un caballo tiene **5 a 9**,
   en 5 buckets distintos. El par del jet no sirve: hay que diseñar una galería de longitud
   variable con proporciones mezcladas. **Este es el único bloque que no se puede tomar
   prestado**, y es donde vive toda la dificultad de RF3 y RF11.

**Lo que se elimina, porque no tiene contenido equivalente:**

- **El plan de cabina** (sección blanca con dibujo técnico). Un caballo no tiene esquema.

**Lo que reemplaza al bloque de cifras.** El detalle clave: **las cifras del jet no son del jet,
son de la empresa** (+30 años de experiencia, +60 países, +3500 horas de vuelo al año). El
equivalente para un caballo serían datos del rancho, y del rancho no se sabe nada. Fabricarlos
está prohibido. Entonces ese hueco se llena con lo único que hay y que no cabe en la lista del
hero:

- **`descripcion`, a ancho de texto.** Es la válvula de escape del esquema: absorbe
  entrenamiento, premios, pedigrí y disciplina sin obligar a una tabla que quede coja. Es el
  único campo que puede sostener un bloque propio. Si un caballo no tiene `descripcion`, **la
  sección entera no se renderiza** (RF5 aplicado a nivel de sección, no solo de campo).
- Si César llega a tener datos reales del rancho (años operando, cantidad de caballos, ubicación),
  esos son del **rancho, no del caballo**: van en la portada o el pie, no en la Ficha.

**Bloque nuevo, que la referencia sugiere y aquí sí tiene contenido real:**

9. **"Otros caballos disponibles".** Una tira de 3 o 4 heroes al cierre de la Ficha. El jet cierra
   con foto a sangre y CTA; esto ocupa ese lugar con **datos que ya existen**, y hace algo que el
   jet no hace: devolver al Interesado al Catálogo en vez de dejarlo en un callejón. Es la única
   sección agregada, y se paga sola.

10. **Contacto.** Mismo CTA y **la misma etiqueta** que en el pie de la portada: la skill prohíbe
    dos CTA con la misma intención y etiquetas distintas.

**Diferencias deliberadas con la referencia, ya decididas:** fondo claro y no `#1E1F21` (§1.4,
por el sol), y display sans y no la serif de 80px (§1.3, ADR-0002).

**Lo que no existe:** "Nosotros", historia del rancho, testimonios, premios, mapa, blog,
newsletter, filtros, comparador. Cada uno de esos exige contenido que no hay y que no se
fabrica.

**Familias de layout usadas: 3** (grid de ratio mixto, galería, pie de contacto). La skill
prohíbe repetir familia de layout entre secciones; con 5 bloques y 3 familias no hay
repetición. El zigzag imagen+texto no se usa ni una vez.

## 1.7 Galería: lo que dijo el prototipo

Se construyó un prototipo estático de la Ficha con los datos reales de `data/caballos.json` y
marcadores de color sólido en el ratio real (RF7), y se midieron tres estrategias sobre los 14
caballos. No es opinión: son mediciones del DOM renderizado.

| Estrategia                               | Resultado                                                                                                                                                                                             |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **A. Par 2-up fijo en 3:2**, como el jet | **Falla.** En el caballo 04, 4 de 5 fotos sufren un **segundo recorte** sobre el que ya se les hizo al entrar en su bucket. Con cuenta impar deja una celda vacía al final. Rompe RF11 en la práctica |
| **B. Columnas masonry, bucket real**     | **Funciona.** Los 14 caballos renderizan sin celda vacía y sin desborde. Ninguna foto se recorta dos veces. Absorbe de 4 a 8 fotos de galería sin cambiar nada                                        |
| C. Filas por orientación                 | Conserva el bucket pero deja huecos al final cuando la cuenta no cierra. Más reglas para el mismo resultado que B                                                                                     |

**Por qué A falla y no es obvio de antemano.** El par del jet funciona porque **las dos fotos del
jet ya son 3:2**. Nuestras fotos están repartidas en 5 buckets: el caballo 04 tiene los 5 en 6
fotos, y el 08 tiene 9 fotos con 5 verticales. Meter un 2:3 en una celda 3:2 recorta el 55% de la
altura. Apilar filas de dos solo funciona si todas las fotos comparten proporción, y ese es
justo el hecho que este catálogo no tiene.

**Elegido: B.**

**Lo que quedó sin resolver, y hay que decirlo.** En móvil, B a una columna deja la foto vertical
a ancho completo. Para el caballo 08 (el de 9 fotos) la página mide **5711 px**, o sea **6.8
pantallas**. Es mucho scroll para un caballo. Tres salidas, ninguna probada todavía:
dos columnas también en móvil (fotos de ~167 px, quizá demasiado chicas para juzgar un animal),
un carrusel horizontal con `scroll-snap` para la galería (comportamiento nativo de móvil, fotos
grandes, sin scroll infinito), o aceptar el scroll largo como el costo de un catálogo
foto-céntrico. **Se decide dentro de T-08b, con el prototipo delante.**

## 1.6 Reglas de copy heredadas de la skill, aplicables desde el primer commit

- **Cero em-dash (`—`) en cualquier texto visible del sitio.** Titulares, etiquetas, botones,
  `alt`, pie. Cero. Se usa guion normal (`-`). _(Esta regla aplica al sitio, no a estos
  documentos de planeación, que sí los usan.)_
- Sin eyebrows numerados (`01 / Catálogo`), sin cues de scroll, sin tiras de locación u hora,
  sin sellos de versión.
- Máximo 1 eyebrow cada 3 secciones. Con 5 bloques: **máximo 1 en todo el sitio**. La
  recomendación es cero.
- Sin puntos de estado decorativos, sin separador `·` repetido.
- Nombres, cifras y datos de los caballos: **nunca inventados**. Mientras sean placeholder,
  tienen que **verse** como placeholder en la maqueta, no como datos plausibles.

---

# 2. Tickets de ejecución

> **Esta sección ya no es la fuente de verdad. Es el origen histórico.**
>
> Los 16 tickets viven desde el 2026-08-30 en `docs/tickets/*.md`, uno por archivo, con campos y
> cuerpo propio. **El estado de cada uno es el campo `Estado:` de su archivo**, y el resumen
> derivado está en [`docs/tickets/ESTADO.md`](docs/tickets/ESTADO.md)
> (`node scripts/estado-tickets.js --escribir`).
>
> Lo de abajo se conserva porque explica **por qué** cada ticket existe y de donde salió su
> condición de terminado. **No lo edites para registrar avance** — eso va en el ticket. Si esta
> sección y un ticket se contradicen, manda el ticket.

Convención: cada ticket tiene **condición de terminado verificable por ejecución**, no por
lectura. `[bloqueado]` marca los que dependen de una pregunta abierta.

Stack propuesto (a confirmar en T-01): Next.js App Router con generación estática, TypeScript,
Tailwind v4, `next/image`, deploy en Vercel. Sin CMS (ADR-0001). Sin librería de animación:
con `MOTION_INTENSITY: 4` alcanza CSS nativo, y evita el peso de Motion en móvil.

## Fase A — cimientos

### T-01 · Bootstrap del repo y despliegue vacío

Iniciar git, `package.json`, Next.js + TS + Tailwind v4, ESLint, Prettier. Fuentes con
`next/font`, self-hosted. Conectar a Vercel.
**Terminado:** una URL de Vercel responde 200 con una página que dice el nombre del sitio, y
`git log` tiene al menos un commit. Verificado abriendo la URL, no leyendo la config.
**Depende de:** nada. Es lo primero.

### T-02 · Tipado y validación del dato

Tipo `Caballo` y `Foto` en TypeScript que espejeen el esquema confirmado de §4 del Documento
Fundacional. Validación en tiempo de build (Zod o equivalente) para que un `data/caballos.json`
malformado rompa el build en vez de romper la página.
**Terminado:** el build falla con mensaje legible si se le quita `nombre` a un caballo, y pasa
con el archivo actual. Probado corriendo el build con el archivo roto a propósito.
**Nota TDD:** sin test. La validación de esquema en build es la red, no un test unitario.

### T-03 · Capa de acceso al Catálogo

La función que lee `data/caballos.json` y devuelve el Catálogo. Filtra `estado: "retirado"`.
Resuelve el slug de cada caballo.
**Terminado:** con un caballo marcado `retirado` en los datos, no aparece en la portada ni
tiene ruta propia accesible. Verificado navegando la URL directa del retirado y viendo un 404.
**Nota TDD:** el Seam A quedó **no acordado**. No hay test automático acá. La verificación es
la de arriba, a mano, y se repite en T-15 antes de publicar. RF1.

## Fase B — el sistema de imagen (lo más riesgoso, primero)

### T-04 · Mapeo bucket → CSS y `focus` → `object-position`

Los 5 buckets (`2:3 · 3:4 · 1:1 · 4:3 · 3:2`) a `aspect-ratio`. El campo `focus` de cada foto a
`object-position`, con `center` por defecto.
**Terminado:** una página de prueba renderiza las 86 fotos con su bucket asignado y ninguna
tiene `aspect-ratio` fuera de los 5 permitidos. Verificado leyendo el DOM renderizado, no el
código fuente.
**Nota TDD:** **Seam B, acordado.** Es el único seam con tests. RF11, RF13. Ver §3.

### T-05 · Marcador de posición en color sólido

Mientras no haya fotos, cada hueco se rellena con color sólido **en el ratio real de la foto que
va a ir ahí** (RF7), para que al llegar la foto no se mueva nada.
**Terminado:** se sustituye un marcador por una foto real y el CLS medido de esa página no
cambia. Verificado con Lighthouse o con el panel de rendimiento, antes y después.
**Por qué está tan temprano:** es lo que permite construir y evaluar todo el layout **sin
fotos**, o sea sin esperar a T0.1. Es el ticket que desbloquea la fase C.

## Fase C — las dos plantillas

### T-06 · Sistema visual: tokens, tipografía, color

Cerrar la elección de display (§1.3), los tokens de color (§1.4), la escala tipográfica, la
escala de espaciado, y la única escala de radio. Escribirlos en `DESIGN.md` — `impeccable`
lo exige antes del primer build de UI, no después.
**Terminado:** existe `DESIGN.md` con los tokens, y una página de muestra los usa. Revisada en
móvil real y en escritorio, en el tema definitivo.
**Desbloqueado:** la tipografía está cerrada y sin licencia pendiente (ADR-0002). Lo único que
falta calibrar contra fotos reales son los tokens de color, y eso se puede hacer al llegar las
fotos sin rehacer nada más. Este ticket ya no está bloqueado por T0.1.

### T-07 · Grid del Catálogo

Grid de ratio mixto, escalonado, con las 5 proporciones conviviendo. Móvil primero: columna
única abajo de 768 px (skill §7, "MOBILE OVERRIDE").
**Terminado:** las 14 tarjetas se ven correctas en 375 px, 768 px y 1440 px, con los 5 buckets
presentes, sin desbordes horizontales. Verificado en navegador real a los tres anchos.

### T-08a · Ficha: hero partido y lista de datos

Estructura del jet: miga de pan, grid 50/50 con la foto a la izquierda en **caja casi cuadrada
con `object-fit: contain`**, y a la derecha nombre más lista `etiqueta : valor` sin bordes.
Colapsa a una columna en móvil, con la caja pasando a proporción apaisada.
**Terminado:** se abre la ficha de un caballo de hero horizontal (01) y una de hero vertical
(03, 04, 09 o 13), y en las dos el hero se ve completo, sin recorte y sin desborde. Verificado en
375 px y 1440 px, las cuatro combinaciones.
**Riesgo bajo ahora.** La caja cuadrada con `contain` resuelve RF12 por construcción, que era la
restricción más dura del proyecto. Antes de medir la referencia, este ticket era el más
probable de rehacer.

### T-08b · Ficha: Galería de longitud variable

**El único bloque sin equivalente en la referencia.** El jet tiene 2 fotos fijas en 3:2; un
caballo tiene 5 a 9 en 5 buckets mezclados.

**Resuelto por prototipo el 2026-08-29** (ver §1.7). Columnas tipo masonry, cada foto en su
bucket real, sin recorte adicional. 3 columnas en escritorio, 2 abajo de 820 px.
**Descartado:** el par 2-up fijo de la referencia. Medido: obliga a un segundo recorte sobre el
que la foto ya sufrió al entrar en su bucket, y deja celda vacía cuando la cuenta es impar.

**Terminado:** las 14 fichas renderizadas, ninguna con celda vacía ni desborde horizontal, y
ninguna foto con proporción distinta a su bucket. Verificado leyendo el DOM en 1346 px y 390 px.
**Pendiente dentro de este ticket:** el largo de scroll en móvil (ver §1.7).

### T-09 · Ficha: datos, con borrado de campos vacíos

Renderiza solo los campos presentes. Un campo ausente **desaparece**: no rinde "N/A", ni un
guion, ni una etiqueta huérfana, ni un hueco de espaciado. La edad se calcula desde
`nacimiento`, nunca se guarda.
**Terminado:** un caballo con solo `nombre` renderiza una ficha sin huecos ni etiquetas
sueltas, al lado de uno con los ocho campos, y las dos se ven intencionales. Verificado
mirando las dos fichas juntas.
**Nota TDD:** el Seam C quedó **no acordado**. Sin test. La verificación es la de arriba,
mirando las dos fichas juntas. RF5.

### T-10 · Contacto

`tel:` y `mailto:` del rancho, en el pie de la portada y en cada ficha. **Una sola etiqueta**
para toda la intención de contacto en todo el sitio. Contraste del botón verificado contra su
fondo (WCAG AA), etiqueta de una sola línea en escritorio.
**Terminado:** el toque en el teléfono abre el marcador en un teléfono real. Verificado en un
dispositivo, no en el emulador.
**`[bloqueado]` por:** el teléfono y correo reales. Se construye con placeholder y se
desbloquea con el dato.

## Fase D — cuando lleguen las fotos

### T-11 · Pipeline de imagen

Fotos reales a WebP (RF8), con los tamaños servidos a **2× del tamaño en pantalla como piso**,
que es el piso medido de la referencia (2.1× a 3.45×), no los 1000 px que se había supuesto.
`next/image` con `priority` en el hero.
**Terminado:** ninguna `<img>` del sitio tiene `naturalWidth` menor a 2× su ancho renderizado.
Verificado leyendo `naturalWidth` en el navegador sobre el sitio desplegado. Es exactamente la
medición que se le hizo a jetmonde.
**`[bloqueado]` por T0.1 y T0.3.**

### T-12 · Reencuadre manual de las 7 fotos con recorte >8%

Las 7 fotos que pierden más del 8% al encajar en su bucket, dos de las cuales son heroes
(caballo 12 con -15.1% de ancho, caballo 11 con -12.7%). Se ajusta `focus` a mano, foto por
foto.
**Terminado:** las 7 revisadas visualmente una por una, y en ninguna el recorte corta hocico,
cola, patas ni grupa. Es revisión a ojo: no hay forma de automatizarla.
**`[bloqueado]` por T-11.**

## Fase E — cierre

### T-13 · Accesibilidad y rendimiento

Texto alternativo real en cada foto (depende de que existan los nombres). Contraste AA en todo.
`prefers-reduced-motion` honrado en los tres movimientos de §1.2. Navegación por teclado en la
Galería.
**Terminado:** Lighthouse con LCP < 2.5s, CLS < 0.1, y accesibilidad sin errores, corrido
contra la URL de Vercel y no contra el servidor local.

### T-14 · Pre-Flight Check

Correr la matriz completa de `design-taste-frontend` §14 contra el sitio desplegado. Incluye el
conteo mecánico de eyebrows, la búsqueda literal de em-dash en el texto visible, y la
verificación de tema y acento únicos.
**Terminado:** la matriz corrida casilla por casilla, con la lista de las que fallaron y qué se
hizo con cada una. Una casilla que no se puede marcar con honestidad significa que el sitio no
está terminado.

### T-15 · Puerta de publicación

No es un ticket de código. Es la lista de lo que tiene que ser real antes de que la URL se
comparta con alguien:

- [ ] Teléfono y correo reales de Rancho Santa María.
- [ ] Los 14 nombres reales (T0.2).
- [ ] Fotos que pasen el piso de 2× (T0.1).
- [ ] Verificado sobre qué se corrió Magnific (T0.3). Si una marca blanca de la cara cambió de
      forma o tamaño, ese set no se publica.

**Nada de esto bloquea la maqueta. Todo bloquea publicar.**

## Orden y camino crítico

```
T-01 → T-02 → T-03
             ↓
       T-04 → T-05  ← acá el proyecto ya puede construir UI sin fotos
             ↓
       T-06 → T-07 → T-08a → T-08b → T-09 → T-10
                                    ↓
                      (llegan fotos) T-11 → T-12
                                            ↓
                                T-13 → T-14 → T-15
```

**T-05 es la bisagra.** Con el marcador de color sólido en el ratio correcto, toda la fase C se
construye y se evalúa sin una sola foto real. Sin él, el proyecto queda esperando a T0.1.

---

# 3. Estrategia TDD

Método: skill `tdd`. Dos reglas suyas gobiernan todo lo de abajo.

**Regla 1 — ningún test se escribe en un seam no acordado.** Textual: _"Test only at
pre-agreed seams. Before writing any test, write down the seams under test and confirm them
with the user. No test is written at an unconfirmed seam."_

**Resuelto 2026-08-29. César acordó solo el Seam B.** Los seams A y C quedan **no acordados**,
y por lo tanto **no se testean**. No es un pendiente: es una decisión, y abajo está su costo.

**Regla 2 — nada de horizontal slicing.** No se escriben todos los tests primero. Rebanadas
verticales: un test → una implementación → repetir. Cada test es una bala trazadora que
responde a lo que enseñó el ciclo anterior.

Además: los tests leen `CONTEXT.md`, para que su vocabulario sea el del dominio. Los nombres de
test se escriben con las palabras del glosario — Catálogo, Ficha, Galería, Disponible,
Retirado — no con "item", "record" ni "entity".

## Estado de los tres seams

| Seam  | Qué cubre                                  | Estado                      |
| ----- | ------------------------------------------ | --------------------------- |
| A     | El Catálogo excluye a los Retirados (RF1)  | **No acordado. Sin tests.** |
| **B** | **Bucket de ratio y `focus` (RF11, RF13)** | **ACORDADO. Se testea.**    |
| C     | Un campo ausente desaparece (RF5)          | **No acordado. Sin tests.** |

### Seam B — la asignación de bucket y el respeto de `focus` (el único acordado)

**Interfaz pública:** la función que traduce una foto a su proporción de render y su
`object-position`.

**Por qué es el correcto para ser el único.** Es la única lógica con aritmética real del
proyecto: 78 ratios distintos comprimidos a 5 buckets, sobre 86 fotos. Es también el único
lugar donde el error **no se ve como error**: se ve como una foto un poco rara, y con 86 fotos
nadie las revisa todas a mano. Los seams A y C fallan de formas que un humano detecta mirando
una pantalla; el B no.

**Comportamiento a especificar:**

- Una foto se asigna al bucket más cercano de los 5 (`2:3 · 3:4 · 1:1 · 4:3 · 3:2`).
- Ninguna foto sale con una proporción fuera de esos 5.
- El `focus` de la foto se respeta; ausente, es `center`.

**Fuente de verdad independiente:** `data/caballos.json` ya trae `bucket` y `recorte_pct`
**calculados y medidos** en la sesión de análisis, antes de que exista una línea de código de
render. Ese archivo es el valor esperado, que es exactamente lo que la skill pide: un valor que
viene de afuera y **puede discrepar** del código. Esto es lo que impide el anti-patrón
tautológico: el test no puede recalcular el bucket como lo hace la implementación, porque el
esperado ya estaba escrito antes.

**Vocabulario:** los nombres de test usan las palabras de `CONTEXT.md` (Foto, Galería, bucket,
`focus`), no "item" ni "record".

## Costo de dejar A y C sin tests

No es un pendiente, es una decisión, y tiene precio. Se escribe para que nadie lo descubra
después:

- **Seam A sin test = RF1 sin red.** Publicar un caballo ya vendido es la única falla del
  sistema que es visible para un tercero, costosa, y **silenciosa**: nadie se entera hasta que
  suena el teléfono. La compensación es humana y hay que respetarla: la condición de terminado
  de T-03 exige navegar la URL directa de un Retirado y ver un 404, y T-15 lo vuelve a exigir
  antes de cada publicación. Si en algún momento el filtro se toca, esa verificación se repite
  a mano.
- **Seam C sin test = RF5 sin red.** El riesgo es menor: un campo huérfano se ve al abrir la
  ficha. Se detecta mirando. La condición de terminado de T-09 lo cubre.

**Ninguna de las dos compensaciones es equivalente a un test**, y no se debe escribir como si
lo fuera. Son verificación manual repetible, que es más barata de acordar y más fácil de
olvidar.

## Lo que explícitamente NO se testea

Decirlo importa tanto como decir qué sí:

- **El layout.** Que el grid se vea bien es criterio de ojo, no de aserción. Un test de
  snapshot de un grid de ratio mixto se rompe en cada ajuste de diseño sin haber detectado
  nunca un bug real. Eso es el anti-patrón _implementation-coupled_ de la skill.
- **El estilo.** Ningún test toca clases de Tailwind ni valores de CSS.
- **El renderizado de componentes.** Con 5 bloques y cero interactividad, los tests de
  componente costarían más de lo que informan.
- **Que las fotos existan.** Eso lo verifica el build, no un test.

## Runner propuesto

Vitest. Razón: es lo que corre nativo en un proyecto Vite/Next moderno sin configuración
propia, y el Seam B es una función pura sin DOM. Con un solo seam acordado, la infraestructura
de test que hace falta es mínima: un runner y nada más. Sin jsdom, sin testing-library, sin
mocks.

## Ciclo, ticket por ticket

Con un solo seam acordado, el ciclo es corto. Tres rebanadas verticales, todas dentro de T-04:

| Ciclo | Test rojo                                                              | Implementación mínima          |
| ----- | ---------------------------------------------------------------------- | ------------------------------ |
| 1     | Una foto de ratio 1.4988 se asigna al bucket `3:2`                     | El mapeo al bucket más cercano |
| 2     | Ninguna de las 86 fotos sale con una proporción fuera de los 5 buckets | El caso límite                 |
| 3     | Una foto sin `focus` rinde `center`                                    | El default                     |

Uno a la vez. El ciclo 2 se escribe **después** de que el 1 esté verde, no antes. Rojo antes que
verde, y solo el código necesario para pasar cada test.

# 4. Registro de decisiones y lo que queda abierto

## Respondido 2026-08-29

**Tipografía: sans display de licencia libre** (`Cabinet Grotesk Display` + `Satoshi`).
Registrada en ADR-0002. Criterio de César: ni lo más ambicioso ni algo que se vea mal, y sin
fuentes que comprar. Consecuencia: R1 y R3 vuelven a ser riesgo alto en vez de bloqueante de
diseño, y T-06 queda desbloqueado.

_Registro:_ esta decisión estuvo unas horas cerrada al revés, en serif. Se revirtió el mismo día,
antes de que existiera código. El argumento a favor de serif queda documentado en §1.3 y en
ADR-0002 por si el set de fotos lo reabre.

**Seams de TDD: solo el B.** A y C sin tests, con verificación manual en su lugar. Costo escrito
arriba.

## Sigue abierto

Ninguna de estas bloquea el arranque de los tickets T-01 a T-05.

1. **Teléfono y correo de Rancho Santa María.** `null` en `data/caballos.json`. Bloquea T-10 y
   T-15. Es lo más barato de responder de toda la lista.
2. **Nombres reales de los 14 caballos** (T0.2). Bloquea T-15 y el texto alternativo de T-13.
3. **Sobre qué se corrió Magnific** (T0.3). Bloquea T-11 y T-15.
4. **T0.1: ¿existen originales de ≥1600 px?** Es la Tarea 0 más importante del proyecto. No
   bloquea T-06 (la tipografía ya no depende de ella), pero sí T-11 y T-15, y define si el sitio
   foto-céntrico es viable.

## Anexo: qué queda sin verificar en este documento

Fiel a la forma de trabajo del proyecto, lo que **no** se comprobó por ejecución:

- **Nada de este plan se corrió.** No hay repo, no hay `package.json`, no hay una sola línea de
  código. Todo lo de arriba es propuesta, salvo las dos decisiones de §4.
- **La elección de fuente no se probó contra una foto real**, porque no hay foto real a tamaño
  final. Con sans esto es tolerable: el riesgo de que la fuente no combine con la foto es bajo.
  Con serif no lo habría sido, y esa asimetría es parte de por qué se eligió sans.
- **Los tokens de color** no se calibraron. Calibrar contra los recortes de 200 px del PDF sería
  calibrar contra ruido.
- **El stack** (Next.js + Tailwind v4 + Vitest) es propuesta razonada, no verificada en este
  entorno. T-01 lo verifica desplegando.
