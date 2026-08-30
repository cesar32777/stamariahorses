# Documento Fundacional — Santa María Performance Horses

Estado: **ABIERTO — en extracción**. Nada se implementa hasta que su sección esté cerrada.
Última actualización: 2026-08-29 (ronda 3: tipografía sans y seams de TDD cerrados)

---

## 0. Hechos verificados (no son supuestos)

Verificados por ejecución, no por lectura.

### Sobre el PDF actual
Archivo: `White Black Photo-centric Photography Personal Interests Zine_20260807_121844_0000.pdf` (29.7 MB)

| Dato | Valor |
|---|---|
| Páginas | 15 (1 portada + 14 caballos) |
| Formato | 418 × 598 pt (vertical, ~ratio A) |
| Portada | "CATÁLOGO DE CABALLOS" — firma lateral: *Eduardo Galán* |
| Identificación de caballos | Solo número: `01` … `14`. Sin nombres, sin datos |
| Layout por caballo | Grid de 5–6 fotos: una principal ancha + 2 medianas + 2 inferiores |
| Marca visible en foto | Lona de fondo: **"RANCHO SANTA MARÍA"** |
| Tipografía portada | Serif display (didone/transitional), caja alta |

### ⚠️ Hallazgo crítico — resolución de las fotos
Resoluciones reales de las imágenes **embebidas en el PDF**:

| Página | Resoluciones (px) |
|---|---|
| p2 (01) | 643×429, 239×363, 461×301, 463×302, 455×303 |
| p3 (02) | 733×490, 460×308, 363×238, 362×241, 242×365, 202×308 |
| p4 (03) | 406×604, 553×354, 349×493, 244×354, 242×337 |
| p8 (07) | 651×439, 369×244, 288×243, 242×357, 229×373, 201×303 |

**Censo completo (88 imágenes extraídas, las 15 páginas):**
- Fotos de caballos: **86**, repartidas en 14 caballos → **entre 5 y 9 fotos por caballo** (no es fijo).
- Lado más largo máximo en TODO el PDF: **1076 px** (y es de la portada). En las fichas: **772 px**.
- Imágenes con lado largo ≥ 1200 px: **0 de 88.**

Un hero de escritorio necesita ≥1600 px. Un card de grid necesita ≥800 px.
**Las fotos del PDF no sirven para la web.** Extraerlas y escalarlas produce un sitio borroso.

### Sobre la referencia (jetmonde.com)
Capturado y medido en navegador real, no de memoria:

| Token | Valor real |
|---|---|
| Fuente display | `Nyghtserif` — serif alto contraste, **weight 300**, h1 90px / h2 64px, line-height ~1.1 |
| Fuente texto | `Albert Sans` — 16px, line-height 1.3 |
| Fondo | `#1E1F21` (casi negro) |
| Texto | `#FFFFFF` / `#333333` / `#707070` |
| Acento | `#1EA6C1` (cian) — usado solo en botones y el avioncito del logo |
| Ancho de contenido | `900px` máx |
| Patrón de catálogo | Grid **asimétrico escalonado** de fotos grandes; etiqueta serif sobrepuesta abajo-izquierda; sin bordes ni sombras |
| Animación | Reveal por scroll (IntersectionObserver) en casi todas las secciones |

**Cómo se capturó** (respuesta a la pregunta original): MCP `chrome-devtools` — navegador real.
Un `fullPage` directo sale **con las secciones en blanco**, porque los reveals por scroll no
se disparan. El método que sí funciona:
1. Scroll progresivo de 500 px con pausa de ~90 ms hasta el fondo (dispara todos los observers).
2. Volver a la coordenada objetivo, esperar ~900 ms.
3. Capturar viewport (no fullPage).
4. Los tokens (fuente, color, tamaño, ancho) se leen con `getComputedStyle`, **no se estiman
   a ojo desde el screenshot**.

---


### Resolución real que sirve jetmonde (medido, no estimado)

Leído con `naturalWidth` sobre las `<img>` de la página, no a ojo:

| Uso | Archivo fuente | Se muestra a | Factor |
|---|---|---|---|
| Card de flota | **2646 px** | 768 px | **3.45×** |
| Card de flota | **1346 px** | 629 px | **2.14×** |
| Card de flota | **1309 px** | 609 px | **2.15×** |
| Hero | 1346 px | 1346 px | 1.0× |
| Máximo en el sitio | **4096 px** | — | — |

**Sus cards de catálogo se sirven a 2.1×–3.45× del tamaño en pantalla.** Ese sobredimensionado
es lo que las hace ver nítidas en pantallas retina — que es casi todo el tráfico móvil.

> **Corrección a un supuesto de César:** "1k webp para que coincida con la calidad de los jets".
> Los jets **no son 1k**. Un archivo de 1000 px en un card de 640 px da 1.5× — por debajo del
> piso de jetmonde, y visiblemente blando en cualquier pantalla 2×.

### Estructura de la página individual del jet (medida 2026-08-29)

Medido en `/avions/dassault-falcon-8x` con `getComputedStyle` y `getBoundingClientRect`, en
1346 px y en 390 px emulado. **Antes de esta medición solo estaba medida la grilla de flota, no
la ficha individual.**

Seis bloques, de arriba abajo:

| # | Bloque | Estructura medida |
|---|---|---|
| 1 | Miga de pan | `Accueil > Flotte > Dassault Falcon 8X` |
| 2 | **Hero partido 50/50** | `grid-template-columns: 633px 633px`, padding `120px 32px`. **Imagen a la izquierda en caja de 633×638 (ratio 0.99, casi cuadrada) con `object-fit: contain`.** Derecha: categoría chica, H1 serif 80px/88px weight 300, lista de datos, CTA |
| 3 | Lista de datos | 8 líneas `etiqueta : valor`, Albert Sans 14px, blanco. **Sin bordes, sin filas, sin tabla.** CTA de texto subrayado debajo |
| 4 | Galería | `grid-template-columns: 601px 601px`. **Solo 2 fotos.** Contenedor 601×418 (ratio 1.438 ≈ 3:2) con `object-fit: cover` |
| 5 | Plan de cabina | Sección **blanca** (`#FFFFFF`) dentro de la página oscura. Dibujo técnico a 1346×338, `contain` |
| 6 | Cifras + cierre | Bloque de estadísticas (+30 años, +60 países, +3500 horas) y foto a sangre completa 1346×812 |

**Fondo:** `#1E1F21`, igual que la portada. La única sección clara es la del plan de cabina.
`document.body` reporta blanco, pero el oscuro lo pinta `section.main`: medir el body engaña.

**Comportamiento en móvil (390 px):** el grid colapsa a `1fr`. La caja del hero **cambia de
proporción**, de casi cuadrada (0.99) a 3:2 (326×217). El H1 baja de 80px a 54px. Sin desborde
horizontal. A 500 px todavía no colapsa y sí desborda: el punto de quiebre está por debajo.

**El hallazgo que sirve:** el hero es una **caja casi cuadrada con `contain`**, no una caja
apaisada con `cover`. Una foto horizontal deja bandas arriba y abajo, y se ve deliberado, como
el marco de una galería. Esa es una respuesta directa a RF12: la misma caja acepta hero vertical
y horizontal sin recortar ninguno de los dos.

**Lo que no transfiere a un caballo:** el plan de cabina (un caballo no tiene esquema) y el
bloque de cifras (fabricar números está prohibido en `PRODUCT.md`). Y la galería del jet tiene
**2 fotos fijas**, mientras que un caballo tiene **5 a 9**.

### Orientación de las fotos (86 fotos de caballo)

| Orientación | Cantidad | % |
|---|---|---|
| Vertical 2:3 | 38 | 44% |
| Horizontal 3:2 | 28 | 33% |
| Vertical suave 3:4 | 8 | 9% |
| Horizontal suave 4:3 | 7 | 8% |
| Cuadrada | 5 | 6% |

**78 ratios distintos entre 86 fotos.** Rango 0.5688 a 1.7669.

**Decisión de César (2026-08-29): reducir a 5 ratios y recortar el sobrante.**
Se evaluaron 4 juegos de 5 buckets midiendo el recorte real de las 86 fotos
(`recorte = 1 - min(r,b)/max(r,b)`):

| Juego | Recorte medio | Peor | >8% |
|---|---|---|---|
| **2:3 · 3:4 · 1:1 · 4:3 · 3:2** | **3.0%** | 15.1% | **7/86** |
| 2:3 · 4:5 · 1:1 · 5:4 · 3:2 | 3.4% | 15.1% | 7/86 |
| k-center óptimo (13:8, 10:9, 9:7…) | 5.5% | **9.1%** | 14/86 |
| 5:8 · 4:5 · 1:1 · 4:3 · 8:5 | 5.5% | 11.5% | 15/86 |

**Elegido: 2:3 · 3:4 · 1:1 · 4:3 · 3:2.** Menor recorte medio, ratios estándar (CSS y grid
limpios), y **56 de 86 fotos pierden menos del 3%**. El k-center baja el peor caso pero sube
el promedio y obliga a ratios como 13:8 que ensucian todo el sistema.

Reparto: 2:3 = 35 · 3:2 = 27 · 3:4 = 11 · 4:3 = 7 · 1:1 = 6.

**El hero tampoco es predecible:** 10 caballos tienen su foto principal horizontal, pero
**4 la tienen vertical** (03, 04, 09, 13). Un layout con hero horizontal fijo se rompe en el 29%
del catálogo.

Rango de ratio: 0.57 a 1.77. **El set está partido casi a la mitad entre vertical y horizontal.**
Un grid de celdas uniformes va a recortar mal la mitad de las fotos — y en un caballo el recorte
malo corta patas o grupa, que es justo lo que un comprador mira.


## 1. Objetivo

**Nombre del sitio: Santa Maria Performance Horses.** Idioma: español (MX), único.

Publicar el catálogo de caballos en venta de Rancho Santa María en una página web propia,
que se vea a la altura de los animales, y que lleve al Interesado a llamar o escribir al Vendedor.

**No** es una tienda. No hay precios, cotizaciones, carrito ni pagos. El sitio no cierra la
venta: la inicia. Su único llamado a la acción es el contacto.

**Vendedor (cerrado 2026-08-29): Rancho Santa María, no una persona nombrada.** El sitio no
firma con nombre propio: el contacto es del rancho. Eduardo Galán es el autor del PDF original
y no aparece en el sitio.

## 2. Alcance

### Dentro (v1)
- Portada con los caballos Disponibles.
- Ficha por caballo: Galería (5–9 fotos) + datos.
- Contacto del Vendedor: teléfono y correo, accesibles desde cualquier caballo.
- Despliegue en Vercel.

### Fuera — explícito, para no volver a discutirlo
- Precios de cualquier tipo.
- Formularios, cotizador, carrito, pagos, cuentas de usuario, login.
- CMS o panel de administración (ver ADR-0001).
- Notificaciones, favoritos, comparador, filtros complejos.
- Multi-idioma. **Cerrado: solo español (MX).** Agregar inglés después no obliga a rehacer nada.

## 3. Requerimientos

| # | Requerimiento | Origen |
|---|---|---|
| RF1 | Mostrar solo los caballos Disponibles; los Retirados no aparecen | César, 2026-08-29 |
| RF2 | Retirar un caballo es editar un archivo de datos y desplegar | ADR-0001 |
| RF3 | Cada caballo muestra una Galería de 5 a 9 fotos | Hecho verificado (§0) |
| RF4 | Teléfono y correo de **Rancho Santa María** visibles y accionables (tel:/mailto:), sin nombre de persona | César, 2026-08-29 |
| RF5 | Un campo de datos ausente **desaparece**; nunca se muestra "N/A" ni un hueco | Ver §4 |
| RF6 | El sitio debe funcionar en móvil — es donde va a llegar un comprador desde WhatsApp | Inferido, a confirmar |
| RF7 | Mientras no haya fotos, cada hueco de imagen se rellena con **color sólido, en el ratio real de la foto que va a ir ahí** — para que al llegar la foto no se mueva nada del layout | César, 2026-08-29 |
| RF8 | Formato de entrega WebP | César, 2026-08-29 |
| RF9 | El grid acepta **1:1, vertical y horizontal mezclados**. ~~Sin recortar~~ → revisado por RF11: se recorta al bucket más cercano | César, 2026-08-29 |
| RF10 | Responsive en móvil. El móvil es el caso principal, no una adaptación posterior | César, 2026-08-29 |
| RF11 | **5 ratios fijos**: 2:3, 3:4, 1:1, 4:3, 3:2. Cada foto se asigna al más cercano y se recorta el sobrante | César, 2026-08-29 |
| RF13 | Cada foto lleva un `focus` (`object-position`), por defecto `center`. Solo se ajusta a mano en las 7 fotos con recorte >8% | Mitiga R9 |
| RF12 | El hero de la ficha debe funcionar vertical **y** horizontal | Hecho verificado: 4/14 heroes verticales |

## 4. Modelo de dominio

Vocabulario en `CONTEXT.md`. Aquí, solo la forma de los datos de un Caballo.

### ✅ Esquema confirmado — 2026-08-29

Los **valores** siguen siendo placeholder (César: *"todavía no me los pasan"*). La **lista de
campos ya no lo es**: César aprobó esta lista exacta al cerrar la pregunta de disciplina,
eligiendo la opción que la enunciaba textualmente — `nombre, sexo, nacimiento, raza, capa,
alzada, descripcion, estado, fotos`.

**No existe un campo `disciplina`.** "Performance" es marca, no una declaración por caballo
(ver `CONTEXT.md`). Si de un caballo se sabe su disciplina, va dentro de `descripcion`.
Consecuencia asumida: el catálogo no se puede filtrar ni agrupar por disciplina sin volver a
tocar el esquema y los datos.

Esquema en vigor:

| Campo | Tipo | Por qué está |
|---|---|---|
| `nombre` | texto | Reemplaza el número del PDF |
| `sexo` | macho / hembra / castrado | Primer filtro de cualquier comprador |
| `nacimiento` | año | Se guarda el año, no la edad: la edad se calcula sola y nunca queda vieja |
| `raza` | texto | |
| `capa` | texto | El color. Los del PDF son bayos/buckskin |
| `alzada` | número | Opcional |
| `descripcion` | texto libre | **La válvula de escape.** Absorbe disciplina, entrenamiento, premios y pedigrí sin obligar a una tabla que quede coja cuando un caballo no tiene papeles |
| `estado` | disponible / retirado | RF1 |
| `fotos` | lista | 5–9 |

**El mecanismo es genérico; el contenido de la v1 es finito: 14 caballos, nombrados.**
Todo campo salvo `nombre`, `estado` y `fotos` es opcional y desaparece si viene vacío (RF5).
Esto evita el modo de falla real: fichas desparejas porque de un caballo se sabe todo y de
otro casi nada.

## 5. Riesgos

| # | Riesgo | Impacto | Estado |
|---|---|---|---|
| R1 | Las fotos disponibles son de ≤772 px. **Confirmado: 0 de 88 llegan a 1200 px** | **Total** — mata el diseño foto-céntrico | **BLOQUEANTE — Tarea 0.1.** Sigue siendo el riesgo #1 del proyecto, pero por sí mismo: ADR-0002 (sans) evita que la tipografía lo agrave |
| R2 | Los caballos no tienen nombre ni ficha | Alto | Abierto — mitigado por §4 |
| R3 | Copiar el layout de jetmonde sin su calidad fotográfica da un resultado peor que un diseño más humilde | Alto | Encadenado a R1. **Mitigado** por ADR-0002: sans display en vez de serif, y fondo frío en vez de crema. Es la decisión que elige el diseño humilde a propósito |
| R4 | El Vendedor depende de César para retirar un caballo | Medio | **Aceptado** — ADR-0001 |
| R5 | 14 caballos bayos, fotos del mismo corral, mismo día, misma luz: el catálogo puede verse repetitivo | Medio | Abierto — es problema de diseño, no de datos |
| R6 | ~~Magnific es un reescalador por IA: inventa detalle.** En un caballo puede inventar textura de pelo, alterar o borrar marcas de la cara (estrella, lucero, calzado) y deformar el cabezal. Esas marcas son rasgos de identificación del animal y suelen estar en sus papeles. Una foto que muestre una marca que el caballo no tiene es una tergiversación frente a un comprador que va a viajar a verlo | **Alto** | **Asumido por César 2026-08-29** — él responde por la calidad y fidelidad del set |
| R7 | Objetivo de 1000 px por debajo del piso medido de la referencia (2.1×–3.45×) | Medio | Abierto — ver §0 |
| R9 | 7 fotos pierden >8% al encajar en bucket. **2 son heroes**: caballo 12 (-15.1% de ancho) y caballo 11 (-12.7% de ancho). Recorte centrado puede cortar hocico o cola | Medio | Mitigado por RF13 — reencuadre manual de 7 fotos |
| R8 | Set de fotos partido 44% vertical / 33% horizontal: un grid uniforme recorta mal la mitad | Medio | **Cerrado** — RF9: grid de ratio natural, sin recorte |

## 6. Tarea 0 — desriesgar antes de construir

**T0.1 — ¿Existen los originales de las fotos?**
- Supuesto a verificar: existen los archivos originales de cámara/celular, ≥1600 px de lado largo.
- Costo de verificar: minutos (buscar la carpeta / preguntar a quien tomó las fotos).
- Impacto si es falso: **total**. Si no existen, no hay sitio foto-céntrico; hay que hacer sesión de fotos nueva o cambiar de dirección de diseño.
- **Condición de cierre:** una carpeta con al menos 3 fotos de 3 caballos distintos, verificadas
  con `identify`/`fitz` mostrando ≥1600 px. *"Creo que están en el celular" no cierra esta tarea.*

**T0.2 — ¿Existe la ficha de datos de los 14 caballos?**
- Condición de cierre: una lista escrita (papel, WhatsApp, Excel, lo que sea) con al menos
  nombre + un dato más, para los 14. Sin eso, la v1 no puede ser un catálogo.
- **Desbloqueado parcialmente:** se avanza con placeholders bajo el esquema de §4. No bloquea
  la maqueta; sí bloquea publicar.

**T0.3 — ¿Sobre qué se corrió Magnific?**
- La fidelidad del resultado depende por completo de cuál fue la entrada:
  - **Sobre los originales de cámara** → el reescalado agrega poco; riesgo bajo y manejable.
  - **Sobre las imágenes sacadas del PDF (200–772 px)** → la IA está inventando la mayor parte
    de los píxeles. Lo que se publica ya no es una foto del caballo: es una interpretación.
- **Condición de cierre:** una comparación lado a lado, original contra reescalado, de **una
  cara** con marca blanca visible. Si la marca cambió de forma o de tamaño, el set no se publica.
- Costo de verificar: minutos. Impacto de fallar: alto y reputacional, no técnico.

## 6b. Plan de ejecución

El plan de tickets, el análisis de diseño (Design Read, dials, la decisión de tipografía) y la
estrategia TDD viven en [`PLAN-TICKETS.md`](PLAN-TICKETS.md). Estado: **propuesta, no acordado**.
Sus dos preguntas abiertas (serif contra sans, y los tres seams) bloquean el primer build de UI
y el primer test respectivamente.

## 7. Registro de Decisiones (ADR)

- [ADR-0001 — Catálogo estático, sin CMS](docs/adr/0001-catalogo-estatico-sin-cms.md) — *Aceptada*
- [ADR-0002 — Tipografía display sans, sin licencia de pago](docs/adr/0002-tipografia-display-sans.md) — *Aceptada*

Decisiones registradas sin ADR propio (no cumplen el umbral: reversibles y sin sorpresa):
- Grid de ratio natural (1:1 / vertical / horizontal conviven, sin recorte). RF9.
- Móvil primero, no adaptación posterior. RF10.
- Huecos de imagen con color sólido en el ratio final mientras no haya fotos. RF7.
- Sin precios, sin cotizaciones, sin transacciones. Contacto = teléfono + correo. (RF4)
- Retirar un caballo lo hace César a mano. (RF2, consecuencia de ADR-0001)

## 8. Preguntas abiertas

1. ~~¿Para qué sirve el sitio?~~ **Cerrada 2026-08-29:** inventario de caballos en venta, sin transacción.
2. ~~¿Existen los originales de las fotos?~~ **Parcial 2026-08-29:** existen archivos reescalados
   con Magnific, aún sin descargar. Reemplazada por la pregunta 2b.
2b. **¿Magnific se corrió sobre los originales de cámara o sobre las imágenes del PDF?** — Tarea 0.3.
3. ~~¿El esquema de campos de §4 es correcto?~~ **Cerrada 2026-08-29:** sí, la lista de nueve
   campos queda confirmada. Los valores siguen siendo placeholder.
4. ~~¿Qué nombre encabeza el sitio?~~ **Cerrada 2026-08-29: "Santa Maria Performance Horses".**
   Rancho Santa María queda como origen (footer, y es lo que se ve en la lona de las fotos).
   **Completada 2026-08-29:** el Vendedor es **Rancho Santa María**, sin persona nombrada.
   Eduardo Galán es solo el autor del PDF y no aparece en el sitio.
5. ~~¿Español, inglés, o los dos?~~ **Cerrada 2026-08-29: solo español (México).**
   Sin ruteo por locale, sin contenido duplicado. Queda fuera de alcance v1.
6. ~~¿Qué significa "Performance" aquí? ¿Se declara disciplina por caballo?~~
   **Cerrada 2026-08-29: es solo marca.** No hay campo `disciplina`; lo que se sepa va en
   `descripcion`.

7. ~~¿Serif o sans display?~~ **Cerrada 2026-08-29: sans display**, de licencia libre
   (`Cabinet Grotesk Display` + `Satoshi`). Criterio de César: ni lo más ambicioso ni algo que se
   vea mal, y sin fuentes que comprar. Ver ADR-0002 y `PLAN-TICKETS.md` §1.3.
8. ~~¿Dónde van los tests?~~ **Cerrada 2026-08-29:** solo el seam de bucket de ratio y `focus`.
   Los seams de RF1 (Catálogo excluye Retirados) y RF5 (campo ausente desaparece) quedan **sin
   tests**, con verificación manual en su lugar. Ver `PLAN-TICKETS.md` §3.

### Sigue abierto

- **2b.** ¿Magnific se corrió sobre los originales de cámara o sobre las imágenes del PDF?
  (Tarea 0.3 — riesgo de fidelidad, asumido por César en R6 pero sin verificar la entrada.)
- **Contacto concreto:** el teléfono y el correo de Rancho Santa María. Están en `null` en
  `data/caballos.json`. **No bloquea la maqueta** (se renderiza con placeholder), **sí bloquea
  publicar**: sin ellos el sitio no tiene su única llamada a la acción.
- **Nombres reales de los 14 caballos** (Tarea 0.2). No bloquea la maqueta; bloquea publicar.
- **Los tokens de color exactos.** Se calibran contra fotos reales en T-06. La familia (fondo
  neutro frío, un solo acento que no sea latón) ya está decidida.
