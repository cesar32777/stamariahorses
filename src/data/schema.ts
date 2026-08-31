import { z } from "zod";

// Esquema del dato del Catálogo. Espeja la lista de campos confirmada en
// DOCUMENTO-FUNDACIONAL §4 y el vocabulario de CONTEXT.md (Caballo, Foto,
// bucket, focus, Disponible/Retirado). No hay campo `disciplina`: si se sabe,
// va dentro de `descripcion` (texto libre).
//
// Todo campo salvo `nombre`, `estado` y `fotos` es opcional y llega como
// `null` mientras el dato real no se capture (RF5). El objetivo de este
// esquema es que un `data/caballos.json` malformado ROMPA el build (T-02),
// no que la Ficha se renderee a medias.

export const FotoSchema = z.object({
  archivo: z.string().min(1),
  w: z.number().int().positive(),
  h: z.number().int().positive(),
  ratio: z.number().positive(),
  x: z.number(),
  y: z.number(),
  hero: z.boolean(),
  orient: z.enum(["horizontal", "vertical", "cuadrada"]),
  bucket: z.enum(["2:3", "3:4", "1:1", "4:3", "3:2"]),
  bucket_ratio: z.number().positive(),
  recorte_pct: z.number().min(0),
  recorte_eje: z.enum(["alto", "ancho"]),
  focus: z.string().min(1),
});

export const CaballoSchema = z.object({
  // `id` es un accidente del PDF (01–14), no del dominio: se descarta en
  // cuanto haya nombres. Se valida porque hoy está en cada registro y
  // sirve para nombrar al caballo en un error de build.
  id: z.string().min(1),
  nombre: z.string().min(1),
  sexo: z.enum(["macho", "hembra", "castrado"]).nullable(),
  nacimiento: z.number().int().nullable(),
  raza: z.string().min(1).nullable(),
  capa: z.string().min(1).nullable(),
  alzada: z.number().positive().nullable(),
  // Campos agregados en T-18 (ADR-0004 §4) para que el bloque de datos de la
  // Ficha tenga la densidad del de la referencia: 5 filas no la tienen, 9 si.
  // Son el vocabulario estandar de un catalogo de venta de caballos. `peso` en
  // kg; `padre`/`madre` son los progenitores; `registro` es el folio de la
  // asociacion. NINGUNO reintroduce `disciplina` (decision 11 / CONTEXT.md).
  // Todos nulables: campo ausente, fila ausente (RF5, T-09).
  peso: z.number().positive().nullable(),
  padre: z.string().min(1).nullable(),
  madre: z.string().min(1).nullable(),
  registro: z.string().min(1).nullable(),
  descripcion: z.string().min(1).nullable(),
  estado: z.enum(["disponible", "retirado"]),
  fotos: z.array(FotoSchema).min(1),
});

export const VendedorSchema = z.object({
  telefono: z.string().min(1).nullable(),
  email: z.string().min(1).nullable(),
});

export const CatalogoSchema = z.object({
  vendedor: VendedorSchema,
  caballos: z.array(CaballoSchema).min(1),
  ratios: z.record(z.string(), z.number().positive()),
  // `true` mientras el archivo lleve datos de ejemplo (contacto, sexo, edad,
  // raza, capa, alzada). La UI pinta un aviso visible en cada página y marca
  // los valores como muestra: la prohibición dura exige que un placeholder se
  // VEA como placeholder. Se pone en `false` (o se borra) cuando el dato es
  // real. Ausente = `false`.
  ejemplo: z.boolean().optional(),
});

export type Foto = z.infer<typeof FotoSchema>;
export type Caballo = z.infer<typeof CaballoSchema>;
export type Vendedor = z.infer<typeof VendedorSchema>;
export type Catalogo = z.infer<typeof CatalogoSchema>;
