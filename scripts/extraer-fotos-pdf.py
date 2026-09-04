"""
Extrae las imagenes embebidas del PDF fuente y las organiza en carpetas por
numero de caballo (usa el id y el nombre de archivo ya definidos en
data/caballos.json). Salida: extraidas/<id>-<nombre>/<archivo original>.

Uso: python scripts/extraer-fotos-pdf.py
"""
import json
import re
import sys
from pathlib import Path

import fitz

ROOT = Path(__file__).resolve().parent.parent
PDF_PATH = ROOT / "White Black Photo-centric Photography Personal Interests Zine_20260807_121844_0000.pdf"
DATA_PATH = ROOT / "data" / "caballos.json"
OUT_DIR = ROOT / "extraidas"


def slug(nombre: str) -> str:
    s = nombre.lower()
    s = (
        s.replace("á", "a").replace("é", "e").replace("í", "i")
        .replace("ó", "o").replace("ú", "u").replace("ñ", "n")
    )
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")
    return s


def main():
    data = json.loads(DATA_PATH.read_text(encoding="utf-8"))
    caballos = data["caballos"]

    doc = fitz.open(PDF_PATH)
    # pagina 0 = portada, paginas 1..14 = un caballo por pagina
    if len(doc) - 1 != len(caballos):
        print(f"AVISO: {len(doc)} paginas en el PDF, {len(caballos)} caballos en el JSON", file=sys.stderr)

    OUT_DIR.mkdir(exist_ok=True)

    for i, caballo in enumerate(caballos):
        page_idx = i + 1
        if page_idx >= len(doc):
            print(f"AVISO: no hay pagina {page_idx} para {caballo['id']} {caballo['nombre']}", file=sys.stderr)
            continue

        page = doc[page_idx]
        imgs = page.get_images(full=True)
        fotos = caballo["fotos"]

        if len(imgs) != len(fotos):
            print(
                f"AVISO {caballo['id']} {caballo['nombre']}: "
                f"{len(imgs)} imagenes en pagina {page_idx} vs {len(fotos)} en JSON",
                file=sys.stderr,
            )

        carpeta = OUT_DIR / f"{caballo['id']}-{slug(caballo['nombre'])}"
        carpeta.mkdir(parents=True, exist_ok=True)

        for j, img in enumerate(imgs):
            xref = img[0]
            base = doc.extract_image(xref)
            ext = base["ext"]
            nombre_destino = fotos[j]["archivo"].rsplit(".", 1)[0] if j < len(fotos) else f"extra-{j+1}"
            destino = carpeta / f"{nombre_destino}.{ext}"
            destino.write_bytes(base["image"])
            print(f"  {destino.relative_to(ROOT)}  ({base['width']}x{base['height']})")

    print(f"\nListo. Fotos en {OUT_DIR.relative_to(ROOT)}/<id>-<nombre>/")


if __name__ == "__main__":
    main()
