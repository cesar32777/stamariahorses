import { notFound } from "next/navigation";
import { caballosPublicos, getCaballoPorSlug, slugsPublicos } from "@/data/catalogo";

// Ruta de la Ficha. En T-03 es un esqueleto: su único trabajo es probar que la
// capa de acceso al Catálogo enruta solo a los Caballos Disponibles. Un
// Retirado (o un slug inventado) no está en `generateStaticParams` y, con
// `dynamicParams = false`, devuelve 404.
//
// El contenido real de la Ficha -- hero partido, lista de datos, galeria -- lo
// construye T-08a y siguientes. No agregar nada de eso aquí.

export const dynamicParams = false;

export function generateStaticParams() {
  return slugsPublicos().map((slug) => ({ slug }));
}

export default async function FichaCaballo({ params }: PageProps<"/caballos/[slug]">) {
  const { slug } = await params;
  const caballo = getCaballoPorSlug(slug);

  if (!caballo) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-24">
      <h1 className="font-display text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
        {caballo.nombre}
      </h1>
      <p className="text-sm text-foreground/40">
        ficha en construccion · {caballosPublicos.length} caballos en el catalogo
      </p>
    </main>
  );
}
