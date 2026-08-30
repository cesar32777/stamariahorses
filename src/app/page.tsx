import { caballosPublicos } from "@/data/catalogo";

const SITE_NAME = "Santa Maria Performance Horses";

// El Catálogo (solo Disponibles, Retirados ya filtrados) llega desde la capa de
// acceso de T-03. El grid real de la portada llega en fase C (T-07).
const EN_CATALOGO = caballosPublicos.length;

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
      <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
        {SITE_NAME}
      </h1>
      <p className="text-sm text-foreground/40">
        {EN_CATALOGO} caballos en el catálogo · sitio en construcción
      </p>
    </main>
  );
}
