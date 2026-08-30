import { caballos } from "@/data/caballos";

const SITE_NAME = "Santa Maria Performance Horses";

// Consume el dato validado en build (T-02) para que el módulo no se elimine
// como import muerto. El Catálogo real (Ficha, Galería) llega en fase C.
const EN_CATALOGO = caballos.filter((c) => c.estado === "disponible").length;

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
