import { z } from 'zod';

export const tipoPreguntaEnum = z.enum(['opcion_multiple', 'verdadero_falso']);

export const createQuizSchema = z.object({
  id_leccion: z.number().int().positive(),
  titulo: z.string().min(3).max(200),
  descripcion: z.string().max(2000).optional().nullable(),
  porcentaje_aprobacion: z.preprocess(
    v => (v === undefined || v === null || v === '' ? undefined : typeof v === 'string' ? Number(v) : v),
    z.number().min(0).max(100).optional()
  )
});

export const createPreguntaSchema = z.object({
  enunciado: z.string().min(3).max(500),
  tipo_pregunta: tipoPreguntaEnum,
  orden: z.coerce.number().int().min(1).optional()
});

export const createOpcionSchema = z.object({
  texto: z.string().min(1).max(500),
  es_correcta: z.coerce.boolean(),
  orden: z.coerce.number().int().min(1).optional()
});
