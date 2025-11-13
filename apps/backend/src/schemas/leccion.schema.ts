// apps/backend/src/schemas/leccion.schema.ts
import { z } from 'zod'

export const tipoContenidoEnum = z.enum([
  'video',
  'audio',
  'pdf',
  'presentacion',
  'enlace',
  'texto',
])

export type TipoContenido = z.infer<typeof tipoContenidoEnum>

export const createLeccionSchema = z.object({
  titulo: z.string().min(3).max(200),
  descripcion: z.string().max(10_000).optional().nullable(),
  // al crear desde el builder arrancamos como "texto" sin contenido aún
  tipo_contenido: tipoContenidoEnum.default('texto'),
  url_contenido: z.string().url().optional().nullable(),
  texto_contenido: z.string().max(100_000).optional().nullable(),
  duracion_seg: z.coerce.number().int().min(0).optional(),
  orden: z.coerce.number().int().min(1).optional(),
})
