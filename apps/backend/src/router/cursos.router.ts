import { Router } from 'express'
import Curso from '../models/Curso.models'
import ModuloCurso from '../models/ModuloCurso.models'
import Leccion from '../models/Leccion.models'
import { validateBody } from '../middlewares/validate'
import { programarDescuentoSchema } from '../schemas/descuento.schema'
import {
  createCursoSchema,
  updateCursoSchema,
  programarPublicacionSchema
} from '../schemas/curso.schema'

const r = Router()

// Crear curso (borrador)
r.post('/', validateBody(createCursoSchema), async (req, res) => {
  const { titulo, descripcion, categoria, idioma, nivel, precio, id_productor } = req.body

  const curso = await Curso.create({
    titulo,
    descripcion,
    categoria,
    idioma,
    nivel,                 // 'basico' | 'intermedio' | 'avanzado'
    precio: precio ?? 0,
    estado: 'borrador',
    id_productor,
  })

  res.status(201).json(curso)
})

// Listar (simple, con paginación opcional)
r.get('/', async (req, res) => {
  const page = Math.max(1, Number(req.query.page || 1))
  const size = Math.min(100, Number(req.query.size || 10))
  const offset = (page - 1) * size

  const { rows, count } = await Curso.findAndCountAll({
    offset,
    limit: size,
    order: [['id_curso', 'DESC']],
  })

  res.json({ data: rows, page, size, total: count })
})

// Detalle simple
r.get('/:id', async (req, res) => {
  const curso = await Curso.findByPk(req.params.id)
  if (!curso) return res.status(404).json({ error: 'No encontrado' })
  res.json(curso)
})

// Detalle con árbol (curso + módulos + lecciones)
r.get('/:id/arbol', async (req, res) => {
  const curso = await Curso.findByPk(req.params.id, {
    include: [
      {
        model: ModuloCurso,
        as: 'modulos',
        include: [{ model: Leccion, as: 'lecciones' }],
      },
    ],
    order: [
      [{ model: ModuloCurso, as: 'modulos' }, 'orden', 'ASC'],
      [{ model: ModuloCurso, as: 'modulos' }, { model: Leccion, as: 'lecciones' }, 'orden', 'ASC'],
    ],
  })
  if (!curso) return res.status(404).json({ error: 'No encontrado' })
  res.json(curso)
})

// Editar curso
r.put('/:id', validateBody(updateCursoSchema), async (req, res) => {
  const curso = await Curso.findByPk(req.params.id)
  if (!curso) return res.status(404).json({ error: 'No encontrado' })

  await curso.update(req.body)
  res.json(curso)
})

// Eliminar curso
r.delete('/:id', async (req, res) => {
  const deleted = await Curso.destroy({ where: { id_curso: req.params.id } })
  if (!deleted) return res.status(404).json({ error: 'No encontrado' })
  res.status(204).send()
})

// --------- Validación de completitud (para publicación) ---------
async function validarCursoCompleto(id_curso: number) {
  const modulos = await ModuloCurso.findAll({ where: { id_curso } })
  if (modulos.length === 0) {
    return { ok: false, reason: 'El curso debe tener al menos un módulo' }
  }

  const ids = modulos.map((m) => m.id_modulo)
  const lecciones = await Leccion.count({ where: { id_modulo: ids } })
  if (lecciones === 0) {
    return { ok: false, reason: 'Cada curso debe tener al menos una lección' }
  }

  // Si quisieras ser más estricto: validar que cada módulo tenga ≥1 lección
  return { ok: true }
}

// Publicar ahora (si está completo)
r.post('/:id/publicar', async (req, res) => {
  const curso = await Curso.findByPk(req.params.id)
  if (!curso) return res.status(404).json({ error: 'No encontrado' })

  const v = await validarCursoCompleto(curso.id_curso)
  if (!v.ok) return res.status(400).json({ error: v.reason })

  await curso.update({
    estado: 'publicado',
    publicado_en: new Date(),
    publicar_desde: null,
  })

  res.json(curso)
})

// Programar publicación
r.post(
  '/:id/programar-publicacion',
  validateBody(programarPublicacionSchema),
  async (req, res) => {
    const curso = await Curso.findByPk(req.params.id)
    if (!curso) return res.status(404).json({ error: 'No encontrado' })

    const { publicar_desde } = req.body as { publicar_desde: Date }

    // SRS: si la fecha es futura → programado; si es pasada o ahora → publicado
    if (publicar_desde > new Date()) {
      await curso.update({
        publicar_desde,
        estado: 'programado',
        publicado_en: null,
      })
    } else {
      const v = await validarCursoCompleto(curso.id_curso)
      if (!v.ok) return res.status(400).json({ error: v.reason })

      await curso.update({
        publicar_desde: null,
        estado: 'publicado',
        publicado_en: new Date(),
      })
    }

    res.json(curso)
  }
)

// Duplicar curso (estructura completa)
r.post('/:id/duplicar', async (req, res) => {
  const original = await Curso.findByPk(req.params.id, {
    include: [
      {
        model: ModuloCurso,
        as: 'modulos',
        include: [{ model: Leccion, as: 'lecciones' }],
      },
    ],
  })
  if (!original) return res.status(404).json({ error: 'No encontrado' })

  const copia = await Curso.create({
    titulo: `${original.titulo} (copia)`,
    descripcion: original.descripcion,
    categoria: original.categoria,
    idioma: original.idioma,
    nivel: original.nivel,
    precio: original.precio,
    estado: 'borrador',
    id_productor: original.id_productor,
  })

  for (const m of (original.modulos ?? [])) {
    const nuevoM = await ModuloCurso.create({
      id_curso: copia.id_curso,
      titulo: m.titulo,
      orden: m.orden,
    })

    for (const l of (m.lecciones ?? [])) {
      await Leccion.create({
        id_modulo: nuevoM.id_modulo,
        titulo: l.titulo,
        descripcion: l.descripcion,
        tipo_contenido: l.tipo_contenido,
        url_contenido: l.url_contenido,
        texto_contenido: l.texto_contenido,
        duracion_seg: l.duracion_seg,
        orden: l.orden,
      })
    }
  }

  res.status(201).json(copia)
})

// Programar descuento

r.post('/:id/programar-descuento', async (req, res) => {
  try {
    const parsed = programarDescuentoSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten() });
    }

    const { precio_promocional, descuento_desde, descuento_hasta } = parsed.data;

    const curso = await Curso.findByPk(req.params.id);
    if (!curso) return res.status(404).json({ error: 'No encontrado' });

    // validar que el precio final < precio original
    if (precio_promocional >= Number(curso.precio)) {
      return res.status(400).json({
        error: "precio_promocional debe ser menor al precio original"
      });
    }

    await curso.update({
      precio_promocional,
      descuento_desde,
      descuento_hasta
    });

    res.json({
      message: "Descuento programado correctamente",
      curso
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Error al programar descuento' });
  }
});

// Cancelar descuento

r.post('/:id/cancelar-descuento', async (req, res) => {
  const curso = await Curso.findByPk(req.params.id);
  if (!curso) return res.status(404).json({ error: 'No encontrado' });

  await curso.update({
    precio_promocional: null,
    descuento_desde: null,
    descuento_hasta: null
  });

  res.json({ message: "Descuento eliminado" });
});



export default r
