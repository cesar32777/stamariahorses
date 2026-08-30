# CONTEXT — Lenguaje del dominio

Glosario. Solo vocabulario: nada de decisiones técnicas ni de implementación.
Las decisiones viven en `docs/adr/`. El plan vive en `DOCUMENTO-FUNDACIONAL.md`.

## Términos

**Caballo**
La unidad del catálogo. Un animal concreto ofrecido en venta. En la fuente actual (el PDF)
no tiene nombre, solo un número de 01 a 14. El número es del PDF, no del dominio: es un
accidente del documento, no un identificador del caballo. Se descarta en cuanto haya nombres.

**Catálogo**
El conjunto de Caballos **Disponibles** en un momento dado. No es la lista completa histórica.
Lo que un Interesado ve es siempre el Catálogo, nunca el conjunto total.

**Ficha**
La vista de un solo Caballo: su Galería más sus datos.

**Galería**
Las fotos de un Caballo. En la fuente actual van de **5 a 9 fotos** por caballo (86 en total
para 14 caballos). No es un número fijo: cualquier vista que asuma "siempre 5" está mal.

**Vendedor**
El punto de contacto del sitio, y el **único**. Se expresa como un teléfono y un correo.
**Cerrado 2026-08-29: el Vendedor es Rancho Santa María, no una persona nombrada.**
El sitio no pone nombre propio en su llamado a la acción: solo teléfono y correo del rancho.
No es un usuario del sistema: no inicia sesión, no tiene cuenta.

**Interesado**
El visitante. No se autentica, no deja datos en el sitio, no hay carrito ni cotización.
Su recorrido termina **fuera** del sitio: en una llamada o un correo al Vendedor.

**Disponible / Retirado**
Los dos estados de un Caballo.
- *Disponible*: aparece en el Catálogo.
- *Retirado*: no aparece. **"Vendido" es una causa de Retirado, no un sinónimo.**
  Un caballo puede retirarse porque se vendió, porque el dueño lo sacó de venta, o porque
  las fotos no sirven. Modelarlo como "vendido" obligaría a mentir en los otros dos casos.

> _Término propuesto, pendiente de confirmar con César: él dijo "lo ocultaré". "Ocultar" describe
> la acción; "Retirado" describe el estado. Se propone Retirado como término canónico._

## Términos cerrados en esta ronda

**Performance**
**Cerrado 2026-08-29: es solo marca.** Forma parte del nombre — *Santa María Performance Horses* —
y no implica ninguna disciplina declarada. **No existe un campo `disciplina`.** Si de un caballo
concreto se sabe su disciplina, se menciona dentro de `descripcion`, que es texto libre.
Consecuencia: el catálogo no se filtra ni se agrupa por disciplina.

**Eduardo Galán**
**Cerrado 2026-08-29: es el autor del catálogo original (el PDF), no el Vendedor.**
No aparece como contacto del sitio. Su firma queda en el documento fuente, fuera del sitio.

**Rancho Santa María**
El origen de los caballos y el Vendedor del glosario. Aparece en la lona de fondo de las fotos
y va en el footer. Su teléfono y correo son el llamado a la acción del sitio.

## Términos abiertos

Ninguno pendiente de definición. Falta el **dato**, no el término: el teléfono y el correo
concretos de Rancho Santa María siguen sin capturarse (`null` en `data/caballos.json`).
