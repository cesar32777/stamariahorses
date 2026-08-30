# Gotchas

Todo lo de aquí está **medido en sesión**, no sacado de documentación. Apéndalo, no lo reordenes.

> **Una gotcha descubierta y no escrita se vuelve a descubrir.** Ese es el único motivo de que este
> archivo exista. Si algo te costó más de diez minutos, va aquí antes de que cierres el ticket.

Sembrado el 2026-08-30 desde `references/gotchas-entorno.md` de la skill `metodo-tickets` más lo ya
medido en este proyecto (`HANDOFF-BUILD.md` §6).

---

## Windows: dos shells, dos sintaxis

- **Heredocs de bash con acentos y comillas fallan** (`unexpected EOF`). Para escribir un markdown
  entero usa la herramienta `Write`. Para ediciones quirúrgicas, `python - <<'PY'` con
  `io.open(..., encoding='utf-8')` **sí** funciona. Medido en este proyecto.
- **Variables de entorno.** El prefijo estilo bash `VAR=x comando` **no funciona** en PowerShell y
  falla de forma confusa. PowerShell: `$env:VAR="x"; comando`.
- **PowerShell 5.1 no tiene `&&` ni `||`.** `A; if ($?) { B }`.
- **`Set-Content`/`Add-Content` escriben en ANSI por defecto.** Pasa `-Encoding utf8` explícito o el
  siguiente que lea el archivo ve mojibake.
- Comandos que **no existen** en PowerShell: `head`, `tail`, `which`, `touch`, `wc -l`, `mkdir -p`,
  `rm -rf`, `2>/dev/null`.
- **Python tiene `PyMuPDF` (`fitz`) y `pypdf`.** **No** hay `pdftoppm` ni ImageMagick.

## Navegador vía MCP (`chrome-devtools`)

- **"Browser is already running"** = hay un Chrome zombi con el perfil del MCP. Mátalo **solo a él**,
  no el Chrome de César:
  ```powershell
  Get-CimInstance Win32_Process -Filter "Name='chrome.exe'" |
    Where-Object { $_.CommandLine -like '*chrome-devtools-mcp*' } |
    ForEach-Object { Stop-Process -Id $_.ProcessId -Force }
  ```
- **Para móvil real usa `emulate` con viewport, no `resize_page`.** La ventana no baja de ~500 px y
  medirías un layout que ningún usuario ve. `emulate` con `390x844x3,mobile,touch` sí llega.
  **Ojo: `emulate` recarga la página y resetea el estado de JS.**
- **Mide leyendo el DOM** (`getComputedStyle`, `getBoundingClientRect`), no mirando screenshots. Es
  más barato en contexto y no se equivoca. Los screenshots son para juzgar si algo **se ve** bien,
  no para medir.
- **Cuidado con medir el fondo en `document.body`.** En la referencia el body reporta blanco y la
  página es oscura: el color lo pinta un wrapper. Sube por los ancestros hasta el primer
  `background` no transparente.

## Servidor de desarrollo

- **El `HTTP 200` llega antes de que el servidor esté servible.** Medido en otro proyecto: 125 s
  entre el primer 200 y el estado real, y una suite lanzada demasiado pronto dio 6 rojos de 7,
  **todos falsos**. **Valida afirmando contenido**, no por código de estado:
  ```
  curl -s http://127.0.0.1:3000/ | grep -c "<un-texto-que-solo-existe-si-compiló>"
  ```
- **Puerto ocupado por un zombi.** Procesos de sesiones anteriores dejan el puerto tomado y el
  siguiente arranque no entiende por qué "su" puerto no responde. `netstat -ano | grep 3000` da el
  PID.

## Verificación

- **Números antes que píxeles.** Un diff de imágenes tiene un umbral que hay que adivinar, y lo
  tumba cualquier marcador de color sólido. Un número no: 335 o no es 335. **En este proyecto casi
  todo se verifica sin fotos reales**, así que el píxel casi nunca es el juez.
- **Un `overflow: hidden` hace que una sección rota se vea limpia y vacía**, no desbordada. Y al
  revés: hay defectos —un icono claro sobre fondo claro— que **solo** el screenshot detecta.
- **Un verde heredado no es evidencia de tu ticket.** Por cada capa que reportes, di cuál de sus
  pruebas ejercita tu cambio. Si la respuesta es "ninguna", es **no-regresión**, no prueba.
- **No testees contra un valor que el propio test calcula.** `data/caballos.json` trae `bucket` y
  `recorte_pct` medidos **antes** de que existiera el código de render: ese archivo es el esperado.
  Derivarlo otra vez con la misma fórmula pasa por construcción y no mide nada.

## Next.js 16 (medido en T-01)

- **`create-next-app` se niega a scaffoldear un directorio no vacío**, incluso con flags no
  interactivos. Scaffoldear en un directorio temporal y copiar a mano lo generado.
- **`next dev` reescribe `CLAUDE.md` con un bloque de "agent rules"** propio de Next 16
  (`node_modules/next/dist/server/lib/generate-agent-files.js`, marca
  `<!-- BEGIN:nextjs-agent-rules -->`). Este proyecto tiene su propio `CLAUDE.md`: hay que poner
  `agentRules: false` en `next.config.ts` **antes** del primer `npm run dev`, o el archivo se
  ensucia solo. Si ya pasó, `git checkout -- CLAUDE.md` lo revierte sin drama.
- **`api.fontshare.com/v2/css` con dos familias en la misma query puede sustituir una en
  silencio.** Pedir `f[]=cabinet-grotesk@700,500&f[]=satoshi@400,500,700` en una sola llamada
  devolvió "General Sans" en vez de "Satoshi" — sin error, sin aviso. Pedir cada familia en su
  propia llamada evita el problema.

## Seam B — asignación de bucket (T-04)

- **El bucket se asigna por distancia logarítmica, no lineal.** Medido: con distancia lineal
  entre ratios, 2 de las 86 fotos (ratio ~0.708) caen en `2:3` cuando `data/caballos.json` dice
  `3:4`. El dato original se midió con la frontera en la **media geométrica** de dos buckets
  (`Math.abs(Math.log(ratioBucket) - Math.log(ratioFoto))`). Si tocas `bucketDeRatio`, el ciclo 2
  del test (86 fotos vs el dato) es el que lo caza.

## Datos de este proyecto

- **0 de 88 imágenes llegan a 1200 px.** No extraigas las del PDF ni las uses.
- **La galería va de 5 a 9 fotos por caballo**, 86 en total para 14. Cualquier vista que asuma
  "siempre 5" está mal.
- **78 ratios distintos entre 86 fotos**, reducidos a 5 buckets, con el set partido 44 % vertical /
  33 % horizontal.
- **El caballo 08 da 5711 px de página** con la galería a una columna en móvil: casi 7 pantallas.
  Decisión abierta dentro de T-08b.
- **Teléfono, correo, nombres, sexo, nacimiento, raza, capa, alzada y descripción son `null`.** Lo
  que no existe **no se fabrica**.
