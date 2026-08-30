# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

**Interesado** — un comprador de caballos. No se autentica, no deja datos en el sitio, no
compara ni cotiza dentro de él. Llega, mira caballos, y si uno le interesa **sale del sitio**
para llamar o escribir. Su recorrido termina fuera.

Situación de uso confirmada: **móvil primero, no como adaptación posterior** (RF10, decisión
de César). El escritorio existe pero no gobierna el diseño.

*Sin confirmar:* que el canal de llegada sea WhatsApp. Es la hipótesis que motivó RF6, y no
está verificada. No se debe construir nada que dependa de ella.

No hay una segunda audiencia. El Vendedor no es usuario del sistema: no edita, no inicia
sesión, no tiene panel.

## Product Purpose

Publicar el catálogo de caballos en venta de Rancho Santa María en un sitio propio, que se vea
a la altura de los animales, y que lleve al Interesado a llamar o escribir.

**Éxito** = el Interesado contacta. El sitio no cierra la venta: la inicia.

**No** es una tienda. Fuera de alcance, explícito y cerrado: precios de cualquier tipo,
cotizador, formularios, carrito, pagos, cuentas de usuario, login, notificaciones, favoritos,
comparador, filtros complejos, y multi-idioma.

## Positioning

Un catálogo foto-céntrico de un solo rancho, con inventario finito y conocido (14 caballos), no
un marketplace ni un clasificado. La diferencia no está en funciones: está en que cada caballo
recibe una Galería de 5 a 9 fotos y una ficha propia, en vez de una miniatura en una lista.

Consecuencia asumida: el sitio vive o muere por la calidad de la fotografía. No hay
funcionalidad que compense un set de fotos pobre.

## Operating Context

- **Mantenimiento:** César edita un archivo de datos versionado en el repo y despliega por push
  a Vercel. No hay CMS ni panel (ADR-0001).
- **Retirar un caballo** = cambiar su `estado` a `retirado` y desplegar. Lo hace César, no el
  Vendedor. Es una dependencia operativa permanente, aceptada, no un detalle de arranque.
- **Rotación esperada:** baja. La decisión de no usar CMS se revisa si el inventario pasa de
  ~40 caballos o la rotación se vuelve semanal.
- **Fuente del contenido:** un PDF de 15 páginas armado por Eduardo Galán, con 14 caballos
  numerados 01–14 y sin nombres ni datos.

## Capabilities and Constraints

### Lo que el sitio hace

- Portada con los caballos **Disponibles**. Los **Retirados** no aparecen nunca (RF1).
- Ficha por caballo: Galería + datos.
- Teléfono y correo accionables (`tel:` / `mailto:`) desde cualquier caballo (RF4).

### Vocabulario

Definido en `CONTEXT.md`: Caballo, Catálogo, Ficha, Galería, Vendedor, Interesado,
Disponible / Retirado. **"Vendido" es una causa de Retirado, no un sinónimo** — un caballo
también se retira porque el dueño lo sacó de venta o porque sus fotos no sirven.

### Esquema de datos — confirmado 2026-08-29

`nombre`, `sexo`, `nacimiento`, `raza`, `capa`, `alzada`, `descripcion`, `estado`, `fotos`.

- Todo campo salvo `nombre`, `estado` y `fotos` es opcional.
- **Un campo ausente desaparece; nunca se muestra "N/A" ni un hueco** (RF5). Esto evita el modo
  de falla real: fichas desparejas porque de un caballo se sabe todo y de otro casi nada.
- Se guarda el **año** de nacimiento, no la edad: la edad se calcula y nunca queda vieja.
- `descripcion` es la válvula de escape — absorbe entrenamiento, premios y pedigrí sin obligar
  a una tabla que quede coja.
- **No existe campo `disciplina`.** "Performance" es marca (ver Brand Commitments).

### Restricciones de imagen — medidas, no estimadas

- 86 fotos de caballo, **5 a 9 por caballo**. No es fijo: cualquier vista que asuma "siempre 5"
  está mal.
- **78 ratios distintos entre 86 fotos.** De ahí la decisión de **5 buckets fijos**:
  `2:3 · 3:4 · 1:1 · 4:3 · 3:2`. Cada foto va al más cercano y se recorta el resto (RF11).
  Recorte medio 3.0%; 56 de 86 pierden menos del 3%.
- **4 de 14 heroes son verticales** (caballos 03, 04, 09, 13). Un layout con hero horizontal
  fijo se rompe en el 29% del catálogo (RF12).
- 7 fotos pierden más del 8% al encajar; 2 son heroes. Se mitigan a mano con `focus`
  (`object-position`), sin tocar el sistema de ratios (RF13).
- Entrega en **WebP** (RF8).
- Mientras no haya fotos, cada hueco se rellena con **color sólido en el ratio real** de la foto
  que va ahí, para que al llegar la foto no se mueva nada del layout (RF7).

### Decisiones abiertas — no inventar

- **Teléfono y correo de Rancho Santa María.** Hoy `null` en `data/caballos.json`. No bloquea la
  maqueta; **bloquea publicar**: sin ellos el sitio no tiene su única llamada a la acción.
- **Nombres reales de los 14 caballos.** Los actuales son placeholder ("Caballo 01"…).
- **Sobre qué se corrió Magnific** (originales de cámara contra imágenes del PDF). Determina si
  lo que se publica es una foto o una interpretación.

## Brand Commitments

- **Nombre del sitio: Santa Maria Performance Horses.** Cerrado.
- **"Performance" es solo marca.** No implica disciplina declarada por caballo. Cerrado
  2026-08-29.
- **Rancho Santa María** es el origen: aparece en la lona de fondo de las fotos y va en el
  footer. **Es también el Vendedor** — el contacto es del rancho, sin persona nombrada.
- **Eduardo Galán** firma el PDF original. **No aparece en el sitio.**
- **Idioma: español (MX), único.** Sin i18n, sin ruteo por locale. Cerrado.
- **Tipografía display: sans, de licencia libre.** Cerrado 2026-08-29 (ADR-0002).
  `Cabinet Grotesk Display` para titulares, `Satoshi` para texto. `Nyghtserif` descartada por
  licencia y por no estar en el pool de la skill. Criterio: ni lo más ambicioso ni algo que se
  vea mal. Consecuencia asumida: el techo visual baja, y a cambio ninguna calidad de foto puede
  romper el diseño.
- **Referencia visual que dio César: `jetmonde.com`.** Es una referencia, no un mandato de
  copia. Sus tokens medidos están en `DOCUMENTO-FUNDACIONAL.md` §0.

## Evidence on Hand

**Existe:**

- `data/caballos.json` — 14 caballos, 86 fotos, con `ratio`, `bucket`, `recorte_pct`,
  `recorte_eje`, `focus`, `hero` y `archivo` por foto. Medido, no estimado.
- El PDF fuente (29.7 MB) en la raíz del proyecto.
- Fotos extraídas del PDF, en baja resolución. **Solo sirven de referencia de encuadre.**

**No existe — y no se debe fabricar:**

- Nombres, edades, razas, capas, alzadas y descripciones reales. Todo lo que hay es placeholder.
- Teléfono y correo.
- Testimonios, premios, historial de ventas, pedigrí, precios, o cualquier prueba social.
- **Fotos utilizables.** Máximo lado largo en el PDF: 772 px en fichas. **0 de 88 imágenes
  llegan a 1200 px.** La referencia sirve sus cards a 2.1×–3.45× del tamaño en pantalla.
  Las fotos de alta resolución son responsabilidad de César, declarada por él explícitamente.

## Plan de ejecución

Tickets, análisis de diseño (Design Read, dials `7/4/3`, tipografía) y estrategia TDD en
[`PLAN-TICKETS.md`](PLAN-TICKETS.md).

## Product Principles

1. **El sitio termina en el contacto.** Cualquier función que retenga al Interesado dentro del
   sitio en vez de empujarlo al teléfono está fuera de propósito.
2. **Un dato ausente desaparece, no se rellena.** Las fichas van a ser desparejas porque el
   conocimiento es dispar. El diseño absorbe eso; no lo disimula con huecos ni con "N/A".
3. **El catálogo es lo Disponible, no el histórico.** Un Retirado no se muestra atenuado ni
   tachado: no existe para el Interesado.
4. **La foto manda, y su forma es irregular por naturaleza.** Vertical y horizontal conviven en
   proporciones casi iguales. Todo layout debe funcionar con ambas o está mal.
5. **Poco alcance, alta ejecución.** César pidió que se vea bien *y* ajustar la ambición a algo
   simple. No es contradicción: son pocas secciones, bien hechas. No agregar secciones de más.

## Accessibility & Inclusion

- Contacto accionable por `tel:` y `mailto:` — que funcione con un toque en móvil, sin copiar
  y pegar (RF4).
- Móvil es el caso principal, no una adaptación (RF10).
- No hay requisito de estándar formal establecido por el usuario. Las fotos necesitarán texto
  alternativo; el contenido de ese texto depende de datos que todavía no existen.
