import { Router } from 'express'
import cursos from './cursos.router'
import modulos from './modulos.router'
import precios from './precios.router'
import quizzes from './quizzes.router';
import media from './media.router'

const r = Router()

r.get('/ping', (_req, res) => res.json({ ok: true, msg: 'pong' }))
r.use('/cursos', cursos)
r.use('/modulos', modulos);
r.use('/precios', precios);
r.use('/quizzes', quizzes);
r.use('/media', media)

export default r
