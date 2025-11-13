import { z } from 'zod'

export const createModuloSchema = z.object({
  id_curso: z.number().int().positive(),
  titulo: z.string().min(3).max(200),
  orden: z.coerce.number().int().min(1).default(1)
})

export const updateModuloSchema = z.object({
  titulo: z.string().min(3).max(200).optional(),
  orden: z.coerce.number().int().min(1).optional()
})
