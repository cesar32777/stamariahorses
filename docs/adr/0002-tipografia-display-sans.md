# ADR-0002 — Tipografía display sans, sin licencia de pago

- **Estado:** Aceptada
- **Fecha:** 2026-08-29
- **Decide:** César

> Nota de registro: este ADR se escribió primero al revés, con serif. César lo revirtió el mismo
> día, antes de que existiera una sola línea de código, al precisar el objetivo:
> *"no quiero lo más impactante y ambicioso, pero tampoco quiero que se vea mal."*
> El argumento a favor de serif queda documentado abajo porque sigue siendo válido; lo que
> cambió es el objetivo contra el que se lo evalúa.

## Contexto

La skill `design-taste-frontend` desaconseja fuertemente serif como display por defecto. Solo la
acepta si el brief nombra una serif, o si la familia estética es genuinamente editorial, de lujo,
publicación, manuscrito, heritage o vintage, y se puede articular por qué esa serif en concreto
encaja con esa marca en concreto.

Había argumento legítimo para serif: un catálogo de venta de caballos con pedigrí pertenece de
verdad a la familia heritage/publicación, la portada del PDF original ya usa una serif display
didone, y la referencia que dio César (jetmonde.com) usa `Nyghtserif`.

Y había argumento en contra, que es el que pesa dado el objetivo:

- **R1 medido:** 0 de 88 imágenes disponibles llegan a 1200 px.
- **R3 escrito:** copiar el lenguaje de jetmonde sin su calidad fotográfica da un resultado peor
  que un diseño más humilde.
- Una serif de contraste le pide al ojo una nitidez que la foto de al lado no cumple. No es
  neutral respecto a la calidad de imagen: la delata.
- "Fondo crema, serif display de alto contraste, acento terracota" es el cúmulo que `impeccable`
  nombra como el default de las interfaces generadas por IA. Un rancho de caballos es el brief
  que aterriza ahí solo.

## Objetivo declarado por César

Ni el techo más alto ni el mínimo esfuerzo: **un resultado que no pueda verse mal.** Esa frase
descarta una decisión cuyo éxito depende de que las fotos salgan excelentes.

## Decisión

**Sans display. Y solo fuentes de licencia libre.**

- **Titulares:** `Cabinet Grotesk Display` (Fontshare, gratis para uso comercial). Está en la
  lista aprobada de la skill, tiene más carácter que una grotesca neutra, y no cuesta nada.
- **Texto y datos:** `Satoshi` (Fontshare, gratis) o el stack del sistema.
- **Alternativa si se quiere aún más neutro:** `Geist` más `Geist Mono` (Vercel, código abierto),
  que es una pareja nombrada por la skill y se autohospeda con `next/font` sin fricción.

**Descartadas y por qué:**

- `Nyghtserif` (la de jetmonde): de pago, fuera del pool de la skill.
- `GT Sectra Display`, `Tiempos Headline`: buenas serifs, pero de pago y ya no aplica la familia.
- `Inter` como display, `Outfit`, `DM Sans`, `Plus Jakarta Sans`, `Space Grotesk`: defaults de
  datos de entrenamiento, nombrados por `impeccable`.
- `Fraunces`, `Instrument Serif`: prohibidas por la skill.

## Consecuencias

**Aceptadas:**

- **El techo visual baja.** Este sitio no va a ganar un premio de diseño. No era el objetivo.
- **El piso sube, que es lo que se buscaba.** Con fotos mediocres, el diseño **se degrada con
  dignidad** en vez de romperse. Sans display no le pide nitidez a la foto de al lado.
- **R1 y R3 vuelven a ser riesgo alto, no bloqueante de diseño.** T0.1 sigue siendo la Tarea 0
  más importante del proyecto, pero ahora porque un sitio foto-céntrico necesita fotos, no
  porque la tipografía lo exija.
- **Cero costo de licencia y cero trámite.** Fontshare y Geist se autohospedan directo. No hay
  fuente que comprar ni contrato que leer.
- La paleta de fondo neutro frío de `PLAN-TICKETS.md` §1.4 se mantiene, pero por su razón propia
  (los caballos son bayos y un fondo cálido los disuelve), no como contramedida a la serif.

**Cuándo se revisa:** si T0.1 cierra bien y aparece un set de fotos claramente por encima de 2×,
vale reabrir la pregunta. Con ese material, una serif deja de ser una apuesta. Antes de eso, no.
