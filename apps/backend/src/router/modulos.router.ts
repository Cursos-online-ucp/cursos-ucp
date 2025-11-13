// apps/backend/src/router/modulos.router.ts
import { Router } from 'express'
import ModuloCurso from '../models/ModuloCurso.models'
import Leccion from '../models/Leccion.models'
import { createLeccionSchema } from '../schemas/leccion.schema'

const r = Router()

// Crear módulo
r.post('/', async (req, res) => {
  const { id_curso, titulo, orden } = req.body
  if (!id_curso || !titulo) {
    return res.status(400).json({ error: 'id_curso y titulo son requeridos' })
  }

  const m = await ModuloCurso.create({
    id_curso,
    titulo,
    orden: orden ?? 1,
  })

  res.status(201).json(m)
})

// Editar módulo
r.put('/:id', async (req, res) => {
  const m = await ModuloCurso.findByPk(req.params.id)
  if (!m) return res.status(404).json({ error: 'No encontrado' })
  await m.update(req.body)
  res.json(m)
})

// Eliminar módulo (cascada borra sus lecciones)
r.delete('/:id', async (req, res) => {
  const deleted = await ModuloCurso.destroy({ where: { id_modulo: req.params.id } })
  if (!deleted) return res.status(404).json({ error: 'No encontrado' })
  res.status(204).send()
})

// Listar módulos de un curso con lecciones
r.get('/curso/:id_curso', async (req, res) => {
  const modulos = await ModuloCurso.findAll({
    where: { id_curso: req.params.id_curso },
    include: [{ model: Leccion, as: 'lecciones' }],
    order: [['orden', 'ASC']],
  })
  res.json(modulos)
})

// Crear lección dentro de un módulo
r.post('/:id_modulo/lecciones', async (req, res) => {
  try {
    const id_modulo = Number(req.params.id_modulo)
    const modulo = await ModuloCurso.findByPk(id_modulo)
    if (!modulo) {
      return res.status(404).json({ error: 'Módulo no encontrado' })
    }

    const parsed = createLeccionSchema.safeParse(req.body)
    if (!parsed.success) {
      console.error('ZOD ERROR LECCION =>', parsed.error.format())
      return res.status(400).json({
        error: 'Datos inválidos',
        detalles: parsed.error.format(),
      })
    }
    const datos = parsed.data

    let orden = datos.orden
    if (!orden) {
      const count = await Leccion.count({ where: { id_modulo } })
      orden = count + 1
    }

    const lec = await Leccion.create({
      id_modulo,
      titulo: datos.titulo,
      descripcion: datos.descripcion ?? null,
      tipo_contenido: datos.tipo_contenido, // por defecto 'texto'
      url_contenido: datos.url_contenido ?? null,
      texto_contenido: datos.texto_contenido ?? null,
      duracion_seg: datos.duracion_seg ?? null,
      orden,
    })

    return res.status(201).json(lec)
  } catch (e) {
    console.error('ERROR CREANDO LECCION =>', e)
    return res.status(500).json({ error: 'Error creando lección' })
  }
})

export default r
