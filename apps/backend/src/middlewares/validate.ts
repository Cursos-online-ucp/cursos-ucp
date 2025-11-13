import { ZodSchema } from 'zod'
import { Request, Response, NextFunction } from 'express'

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.body)
    if (!parsed.success) {
      const issues = parsed.error.issues.map(i => ({
        path: i.path.join('.'),
        message: i.message
      }))
      return res.status(400).json({ error: 'Validación falló', issues })
    }
    // sobrescribe con datos tipados/limpios
    req.body = parsed.data as any
    next()
  }
}
