# ADR-0001 — Catálogo estático, sin CMS

- **Fecha:** 2026-08-29
- **Estado:** Aceptada

## Contexto

Catálogo de 14 caballos en venta. No hay precios, ni cotizaciones, ni transacciones: el sitio
termina en un teléfono y un correo. El inventario cambia poco y solo en una dirección
(un caballo se retira). César lo mantiene él mismo y pidió explícitamente ajustar la ambición
a algo simple y visual, no a un sistema automatizado.

## Alternativas consideradas

1. **CMS headless** (Sanity, Contentful, Payload). El Vendedor edita sin tocar código.
   Costo: un servicio más, un esquema más, autenticación, y una cuenta que alguien tiene que
   recordar que existe dentro de seis meses.
2. **Estático con los datos en el repo.** Los caballos viven en un archivo de datos versionado;
   retirar uno es editar el archivo y desplegar.

## Decisión

Estático, datos en el repo. Vercel despliega solo al hacer push.

## Consecuencias

**A favor**
- Cero servicios externos, cero costo recurrente, cero autenticación que mantener.
- El contenido queda versionado: se ve qué cambió y cuándo.
- Nada que se rompa por un cambio de plan gratuito de un tercero.

**En contra — lo que estamos aceptando**
- **El Vendedor no puede retirar un caballo por su cuenta.** Depende de César. Si César no está
  disponible, un caballo vendido sigue publicado. Esta es una dependencia operativa permanente,
  no un detalle de arranque.
- Retirar un caballo exige editar y desplegar. Aceptable con 14 caballos y baja rotación;
  deja de serlo si el inventario crece o rota rápido.
- Si más adelante hace falta un CMS, hay que rehacer la capa de datos.

## Cuándo revisar esta decisión

Si pasa cualquiera de estas: el inventario pasa de ~40 caballos, la rotación se vuelve semanal,
o el Vendedor necesita editar sin intermediario.
