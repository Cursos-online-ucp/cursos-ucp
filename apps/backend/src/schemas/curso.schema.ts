import { z } from 'zod'

export const nivelEnum = z.enum(['basico','intermedio','avanzado'])
export const estadoEnum = z.enum(['borrador','programado','publicado','inactivo'])

export const createCursoSchema = z.object({
  titulo: z.string().min(3).max(200),
  descripcion: z.string().max(20_000).optional().nullable(),
  categoria: z.string().max(100).optional().nullable(),
  idioma: z.string().max(50).optional().nullable(),
  nivel: nivelEnum.default('basico'),
  precio: z.preprocess(
    v => (typeof v === 'string' ? Number(v) : v),
    z.number().nonnegative().max(9_999_999).default(0)
  ),
  id_productor: z.preprocess(
    v => (v === null || v === undefined || v === '' ? undefined : v),
    z.number().int().positive().optional()
  )
})

export const updateCursoSchema = z.object({
  titulo: z.string().min(3).max(200).optional(),
  descripcion: z.string().max(20_000).optional().nullable(),
  categoria: z.string().max(100).optional().nullable(),
  idioma: z.string().max(50).optional().nullable(),
  nivel: nivelEnum.optional(),
  precio: z.preprocess(
    v => (v === undefined ? undefined : typeof v === 'string' ? Number(v) : v),
    z.number().nonnegative().max(9_999_999).optional()
  ),
  estado: estadoEnum.optional(),
  publicar_desde: z.coerce.date().optional(),
  publicado_en: z.coerce.date().optional(),
  id_productor: z.number().int().positive().optional()
})

export const programarPublicacionSchema = z.object({
    publicar_desde: z.coerce
      .date()
      .refine((v) => !isNaN(v.getTime()), { message: 'publicar_desde inválido' })
  })
