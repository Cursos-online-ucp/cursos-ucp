import { NextFunction, Request, Response } from 'express'

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction) {
  console.error(err)
  if (err?.name === 'SequelizeValidationError') {
    return res.status(400).json({ error: 'Validación DB', details: err.errors?.map((e: any) => e.message) })
  }
  return res.status(500).json({ error: 'Error interno' })
}
