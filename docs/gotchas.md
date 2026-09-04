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
- **No verifiques contra un valor que tú mismo calculas.** `data/caballos.json` trae `bucket` y
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

## Asignación de bucket (T-04)

- **El bucket se asigna por distancia logarítmica, no lineal.** Medido: con distancia lineal
  entre ratios, 2 de las 86 fotos (ratio ~0.708) caen en `2:3` cuando `data/caballos.json` dice
  `3:4`. El dato original se midió con la frontera en la **media geométrica** de dos buckets
  (`Math.abs(Math.log(ratioBucket) - Math.log(ratioFoto))`). Si tocas `bucketDeRatio`, **nada lo
  caza solo**: la suite que lo cubría se borró el 2026-09-04. Compará las 86 fotos contra el
  `bucket` del dato en `/prueba-imagen`.

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

## Medido en T-18..T-22 (2026-08-30)

- **`git checkout -- <archivo>` revierte a HEAD, no "deshace la prueba".** El patrón del proyecto
  para las pruebas en rojo es "rompo el JSON, mido, `git checkout` para restaurar". Eso **solo es
  seguro si el archivo ya está commiteado**. En T-18 el `data/caballos.json` poblado todavía no lo
  estaba, y el `checkout` borró los 14 caballos de golpe. Se recuperó porque el poblado vive en un
  script determinista, no en ediciones a mano. **Antes de romper un archivo a propósito:
  `git status` de ese archivo, y si aparece modificado, `git stash` o copia a scratchpad.**
- **Un `next start` zombi sirve el build ANTERIOR y el chequeo de "servible" da falso positivo.**
  El segundo `next start` falló con `EADDRINUSE`, el viejo siguió atendiendo, y `curl | grep` de un
  texto que existía en los dos builds dijo que todo estaba bien. Se cazó al buscar una cadena que
  **solo** existe en el build nuevo. **El texto que valida "servible" tiene que ser algo que el
  build anterior NO tenía.** Para liberar el puerto:
  ```powershell
  Get-NetTCPConnection -LocalPort 3111 -State Listen |
    ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
  ```
- **`print()` de Python revienta con `UnicodeEncodeError` al imprimir acentos o iconos** (la salida
  va a cp1252). El archivo se escribe bien igual: el error es del `print`, no de `io.open(...,
  encoding='utf-8')`. **No imprimas el contenido, verifícalo con `grep`.**
- **`cd` dentro de una llamada de Bash persiste entre llamadas.** Un `cd .next/server/app` para
  inspeccionar el HTML dejó las llamadas siguientes fuera de la raíz del repo. Usa rutas absolutas
  o vuelve con `cd` explícito.
- **`emulate` del MCP de Chrome no expone `prefers-reduced-motion`.** La otra mitad sí se puede
  verificar por ejecución: inyectar las mismas declaraciones del bloque `reduce` **sin** el
  `@media` y leer `transitionDuration` antes y después. Si pasan a `1e-05s` (así lo reporta
  Chrome, no `0.01ms`) y vuelven al quitarlo, la cascada gana. Lo que queda sin probar es que el
  `@media` **dispare**, no que sus reglas funcionen.
- **`naturalWidth` MIENTE en una imagen con `srcset`.** El navegador corrige las dimensiones
  intrinsecas por la densidad que el mismo calculo: `naturalWidth = pixeles reales / (w elegido /
  ancho de `sizes`)`. Medido: el hero devolvia `1125` con una fuente de **3000 px** reales, y la
  banda del pie `900` con una de **2400** -- las dos exactamente x0.375, que es `1440/3840`. Con
  eso, la verificacion de T-11 tal como esta escrita ("`naturalWidth` >= 2x el ancho renderizado")
  da **falsos rojos** en cuanto la imagen tiene `srcset`.
  **Mide los pixeles de verdad**: saca el `w=` de `currentSrc`, pide esa URL y lee el tamano del
  archivo servido. Anotado tambien en `docs/tickets/T-11.md`.
- **`getClientRects().length` sobre un elemento de bloque siempre da 1**, aunque el texto ocupe
  tres lineas: devuelve la caja del bloque, no las cajas de linea. Para contar lineas de verdad hay
  que envolver el contenido en un `Range` y leer `rg.getClientRects().length`. Confundir los dos
  hizo reportar "titular de 1 linea" sobre un titular de 3.

