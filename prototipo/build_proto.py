import json, io, os

SRC = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'caballos.json')
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'ficha-proto.html')

d = json.load(io.open(SRC, encoding='utf-8'))
caballos = d['caballos']

# Solo lo que el prototipo necesita, para no inflar el HTML.
slim = []
for c in caballos:
    slim.append({
        'id': c['id'],
        'nombre': c['nombre'],
        'fotos': [{
            'bucket': f['bucket'],
            'br': f['bucket_ratio'],
            'hero': bool(f.get('hero')),
            'orient': f['orient'],
            'recorte': f['recorte_pct'],
        } for f in c['fotos']]
    })

DATA = json.dumps(slim, ensure_ascii=False)

HTML = """<!doctype html>
<html lang="es">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Ficha - prototipo de estructura</title>
<link rel="preconnect" href="https://api.fontshare.com">
<link href="https://api.fontshare.com/v2/css?f[]=cabinet-grotesk@800,500&f[]=satoshi@400,500&display=swap" rel="stylesheet">
<style>
:root{
  --ground:#F3F3F1;
  --ink:#17181B;
  --muted:#6E7075;
  --line:#DDDDD9;
  --accent:#1F4D3A;
  --ph1:#C9C7C0; --ph2:#BFBDB6; --ph3:#D2D0C9; --ph4:#B6B4AD;
  --pad:32px;
}
*{box-sizing:border-box}
body{margin:0;background:var(--ground);color:var(--ink);
  font-family:"Satoshi",system-ui,-apple-system,"Segoe UI",sans-serif;
  font-size:15px;line-height:1.5;-webkit-font-smoothing:antialiased}
.wrap{max-width:1346px;margin:0 auto;padding:0 var(--pad)}

/* barra de control del prototipo, NO es parte del diseno */
.ctl{position:sticky;top:0;z-index:50;background:var(--ink);color:#fff;padding:10px var(--pad);
  display:flex;gap:18px;align-items:center;flex-wrap:wrap;font-size:12px}
.ctl b{font-weight:500;opacity:.55;letter-spacing:.08em;text-transform:uppercase;font-size:10px}
.ctl select,.ctl button{font:inherit;background:#2A2C31;color:#fff;border:1px solid #3A3D44;
  border-radius:4px;padding:5px 9px;cursor:pointer}
.ctl button.on{background:#fff;color:var(--ink);border-color:#fff}

.crumb{padding:28px 0 0;font-size:12px;color:var(--muted)}
.crumb span{margin:0 6px;opacity:.5}

/* HERO partido, estructura del jet */
.hero{display:grid;grid-template-columns:1fr 1fr;gap:48px;padding:56px 0 96px;align-items:start}
.heroBox{aspect-ratio:1/1;background:transparent;display:flex;align-items:center;justify-content:center}
.heroBox .ph{max-width:100%;max-height:100%}
.eyebrow{font-size:11px;letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin-bottom:14px}
h1{font-family:"Cabinet Grotesk",system-ui,sans-serif;font-weight:800;
  font-size:clamp(38px,5.2vw,72px);line-height:1.02;letter-spacing:-.02em;margin:0 0 40px}
.datos{list-style:none;margin:0 0 40px;padding:0}
.datos li{padding:7px 0;font-size:14px}
.datos li .k{color:var(--muted)}
.cta{display:inline-block;font-size:14px;color:var(--accent);text-decoration:none;
  border-bottom:1px solid var(--accent);padding-bottom:3px}
.cta:active{transform:translateY(1px)}

/* marcador de posicion en el ratio real (RF7) */
.ph{position:relative;background:var(--ph1);width:100%}
.ph:nth-child(3n){background:var(--ph2)}
.ph:nth-child(4n){background:var(--ph3)}
.ph:nth-child(5n){background:var(--ph4)}
.ph small{position:absolute;left:8px;bottom:6px;font-size:10px;letter-spacing:.06em;
  color:#4A4A46;opacity:.75}

h2{font-family:"Cabinet Grotesk",system-ui,sans-serif;font-weight:500;font-size:13px;
  letter-spacing:.14em;text-transform:uppercase;color:var(--muted);margin:0 0 20px;font-weight:500}
section.blk{padding:0 0 96px}

/* A. par fijo 2-up con recorte (lo que hace el jet) */
.galA{display:grid;grid-template-columns:1fr 1fr;gap:16px}
.galA .cell{aspect-ratio:3/2;overflow:hidden;position:relative}
.galA .cell .ph{position:absolute;inset:0;width:100%;height:100%}
.galA .warn{position:absolute;inset:0;background:repeating-linear-gradient(45deg,rgba(190,60,40,.16) 0 8px,transparent 8px 16px)}

/* B. masonry por columnas, cada foto en su bucket real */
.galB{column-count:3;column-gap:16px}
.galB .cell{break-inside:avoid;margin-bottom:16px}

/* C. filas por orientacion */
.galC{display:flex;flex-wrap:wrap;gap:16px}
.galC .cell{flex:0 0 auto}
.galC .cell.h{width:calc(66.666% - 5.34px)}
.galC .cell.v{width:calc(33.333% - 10.67px)}
.galC .cell.s{width:calc(33.333% - 10.67px)}

.note{font-size:13px;color:var(--muted);max-width:62ch;margin:0 0 24px}
.desc{max-width:62ch;font-size:16px;line-height:1.65}
.otros{display:grid;grid-template-columns:repeat(4,1fr);gap:16px}
.otros .cell{aspect-ratio:3/2;overflow:hidden;position:relative}
.otros .cell .ph{position:absolute;inset:0;height:100%}
.otros .nm{font-size:13px;margin-top:8px}
footer{border-top:1px solid var(--line);padding:40px 0 80px;font-size:13px;color:var(--muted)}
footer a{color:var(--accent)}

@media (max-width:820px){
  :root{--pad:20px}
  .hero{grid-template-columns:1fr;gap:28px;padding:32px 0 64px}
  .heroBox{aspect-ratio:3/2}
  .galB{column-count:2}
  .otros{grid-template-columns:repeat(2,1fr)}
  .galC .cell.h,.galC .cell.v,.galC .cell.s{width:100%}
}
@media (max-width:520px){
  .galB{column-count:1}
  .galA{grid-template-columns:1fr}
}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}
</style>
</head>
<body>

<div class="ctl">
  <b>prototipo</b>
  <label>caballo
    <select id="selH"></select>
  </label>
  <label>galeria</label>
  <button data-m="A" class="on">A: par 2-up (jet)</button>
  <button data-m="B">B: masonry, ratio real</button>
  <button data-m="C">C: filas por orientacion</button>
  <span id="meta" style="opacity:.6"></span>
</div>

<div class="wrap">
  <div class="crumb">Catalogo <span>&rsaquo;</span> <em id="cr"></em></div>

  <div class="hero">
    <div class="heroBox" id="heroBox"></div>
    <div>
      <div class="eyebrow">Disponible</div>
      <h1 id="nombre"></h1>
      <ul class="datos" id="datos"></ul>
      <a class="cta" href="tel:">Llamar al rancho</a>
    </div>
  </div>

  <section class="blk">
    <h2>Galeria</h2>
    <p class="note" id="galNote"></p>
    <div id="gal"></div>
  </section>

  <section class="blk">
    <h2>Sobre este caballo</h2>
    <p class="desc" id="desc"></p>
  </section>

  <section class="blk">
    <h2>Otros caballos disponibles</h2>
    <div class="otros" id="otros"></div>
  </section>

  <footer>
    Rancho Santa Maria &nbsp;&middot;&nbsp;
    <a href="tel:">telefono pendiente</a> &nbsp;&middot;&nbsp;
    <a href="mailto:">correo pendiente</a>
  </footer>
</div>

<script>
const DATA = __DATA__;
let mode = 'A', cur = 0;

const sel = document.getElementById('selH');
DATA.forEach((c,i)=>{ const o=document.createElement('option'); o.value=i;
  o.textContent = c.id+' - '+c.fotos.length+' fotos - hero '+(c.fotos.find(f=>f.hero)||{}).bucket; sel.appendChild(o); });

function ph(b, br, label){
  const d=document.createElement('div'); d.className='ph';
  d.style.aspectRatio = b.replace(':','/');
  d.innerHTML = '<small>'+label+'</small>';
  return d;
}

// Campos de ejemplo. Marcados como pendientes a proposito: no se inventan datos.
const CAMPOS = [
  ['Sexo','pendiente'], ['Nacimiento','pendiente'], ['Raza','pendiente'],
  ['Capa','pendiente'], ['Alzada','pendiente']
];

function render(){
  const c = DATA[cur];
  document.getElementById('cr').textContent = c.nombre;
  document.getElementById('nombre').textContent = c.nombre;
  const hero = c.fotos.find(f=>f.hero) || c.fotos[0];

  const hb = document.getElementById('heroBox'); hb.innerHTML='';
  const hp = ph(hero.bucket, hero.br, hero.bucket+' '+hero.orient);
  hp.style.width='auto'; hp.style.height='auto';
  hp.style.maxWidth='100%'; hp.style.maxHeight='100%';
  // contain dentro de la caja: la foto toma el lado que le toque
  if (hero.br >= 1) { hp.style.width='100%'; } else { hp.style.height='100%'; hp.style.width='auto';
    hp.style.aspectRatio = hero.bucket.replace(':','/'); }
  hb.appendChild(hp);

  const ul=document.getElementById('datos'); ul.innerHTML='';
  CAMPOS.forEach(([k,v])=>{ const li=document.createElement('li');
    li.innerHTML='<span class="k">'+k+':</span> '+v; ul.appendChild(li); });

  document.getElementById('desc').textContent =
    'Este bloque reemplaza al de cifras del jet. Es el campo descripcion, texto libre, '+
    'la unica valvula de escape del esquema: absorbe entrenamiento, premios, pedigri y '+
    'disciplina sin obligar a una tabla que quede coja. Si un caballo no tiene descripcion, '+
    'la seccion entera no se renderiza.';

  const resto = c.fotos.filter(f=>f!==hero);
  const gal = document.getElementById('gal');
  gal.className = 'gal'+mode; gal.innerHTML='';
  const note = document.getElementById('galNote');

  if(mode==='A'){
    note.textContent = 'Celda fija 3:2 con recorte, igual que el par del jet. El rayado marca '+
      'la foto que sufre un segundo recorte sobre el que ya se le hizo al meterla en su bucket.';
    resto.forEach(f=>{ const cell=document.createElement('div'); cell.className='cell';
      const p=ph(f.bucket,f.br,f.bucket); p.style.aspectRatio='auto'; cell.appendChild(p);
      if(Math.abs(f.br-1.5)>0.12){ const w=document.createElement('div'); w.className='warn'; cell.appendChild(w); }
      gal.appendChild(cell); });
  } else if(mode==='B'){
    note.textContent = 'Columnas verticales. Cada foto conserva su bucket real, sin un segundo '+
      'recorte. Se apilan solas sin importar si son 5 o 9.';
    resto.forEach(f=>{ const cell=document.createElement('div'); cell.className='cell';
      cell.appendChild(ph(f.bucket,f.br,f.bucket)); gal.appendChild(cell); });
  } else {
    note.textContent = 'Filas donde la horizontal ocupa dos tercios y las verticales un tercio. '+
      'Conserva el bucket real, pero deja huecos al final cuando la cuenta no cierra.';
    resto.forEach(f=>{ const cell=document.createElement('div');
      cell.className='cell '+(f.br>1.15?'h':(f.br<0.9?'v':'s'));
      cell.appendChild(ph(f.bucket,f.br,f.bucket)); gal.appendChild(cell); });
  }

  const ot=document.getElementById('otros'); ot.innerHTML='';
  DATA.filter((_,i)=>i!==cur).slice(0,4).forEach(o=>{
    const wrapEl=document.createElement('div');
    const cell=document.createElement('div'); cell.className='cell';
    const h=o.fotos.find(f=>f.hero)||o.fotos[0];
    const p=ph(h.bucket,h.br,''); p.style.aspectRatio='auto'; p.style.width='100%';
    cell.appendChild(p);
    const nm=document.createElement('div'); nm.className='nm'; nm.textContent=o.nombre;
    wrapEl.appendChild(cell); wrapEl.appendChild(nm); ot.appendChild(wrapEl);
  });

  const cnt={}; c.fotos.forEach(f=>cnt[f.bucket]=(cnt[f.bucket]||0)+1);
  document.getElementById('meta').textContent =
    c.fotos.length+' fotos - '+Object.entries(cnt).map(([k,v])=>k+'x'+v).join('  ');
}

sel.addEventListener('change', e=>{ cur=+e.target.value; render(); });
document.querySelectorAll('.ctl button').forEach(b=>b.addEventListener('click',()=>{
  document.querySelectorAll('.ctl button').forEach(x=>x.classList.remove('on'));
  b.classList.add('on'); mode=b.dataset.m; render();
}));
render();
</script>
</body>
</html>
"""

io.open(OUT, 'w', encoding='utf-8').write(HTML.replace('__DATA__', DATA))
print('escrito:', OUT)
