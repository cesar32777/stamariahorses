# Bitácora

**Append-only.** Una línea al final por cada cierre de ticket o hallazgo que cueste tiempo.
**Nunca se reescribe ni se reordena** — su valor es que el orden sea el real.

Formato: `AAAA-MM-DD · <ID o ámbito> · qué pasó · commit · qué se verificó · qué quedó abierto`.

Lo que **no** va aquí: conteos (eso lo deriva `scripts/estado-tickets.js`), narración de estado
actual (eso vive en el campo `Estado:` de cada ticket), ni prosa de handoff (el handoff es
desechable y vive fuera del repo).

---

- 2026-08-29 · planeación · cerrados `DOCUMENTO-FUNDACIONAL.md`, `PRODUCT.md`, `CONTEXT.md`, `PLAN-TICKETS.md`, ADR-0001 y ADR-0002. Prototipo `prototipo/ficha-proto.html` con datos reales: valida el hero partido con `object-fit: contain` y descarta el par 2-up de la referencia. Sin código todavía.
- 2026-08-30 · andamiaje · montado el carril secuencial del método (skill `metodo-tickets`): `docs/tickets/` con los 16 tickets derivados de `PLAN-TICKETS.md` §2, `scripts/estado-tickets.js` y `scripts/handoff.js`, esta bitácora, `docs/gotchas.md` y el `CLAUDE.md` del repo. Verificado: `node scripts/estado-tickets.js` sale con código 0 y 16/16 tickets con sus 10 campos. **No se montó el carril paralelo** (worktrees, rol integrador) — decisión explícita: 16 tickets con camino crítico casi lineal no lo justifican. Sigue abierto todo lo de `docs/tickets/README.md` § Bloqueos.
- 2026-08-30 · T-01 · bootstrap Next.js App Router + TS + Tailwind v4 + ESLint + Prettier, fuentes Cabinet Grotesk Display + Satoshi self-hosted (`next/font/local`, ADR-0002). Commit `5fbb095`. Verificado: `npm run dev` sirve `Santa Maria Performance Horses` en `/` (confirmado por contenido, no por código HTTP, y en navegador real vía chrome-devtools); `npm run build` genera `/` como estática; `.next/server/app` contiene el nombre del sitio. Baseline de lint fijado en `.lint-baseline.json` (4 errores heredados de `scripts/*.js`, ajenos a este ticket). **Queda abierto:** la URL de Vercel — el deploy lo hace César, no verificado.
