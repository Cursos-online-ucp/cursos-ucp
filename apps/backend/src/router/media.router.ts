import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import Leccion from '../models/Leccion.models'
import { TipoContenido } from '../schemas/leccion.schema'

const r = Router()

// Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const base = path.join(__dirname, '..', '..', 'uploads')
    let folder = 'otros'

    if (file.mimetype.startsWith('video/')) folder = 'videos'
    else if (file.mimetype.startsWith('audio/')) folder = 'audios'
    else if (file.mimetype === 'application/pdf' || file.mimetype.startsWith('application/vnd'))
      folder = 'docs'
    else if (file.mimetype.startsWith('image/')) folder = 'images'

    const dest = path.join(base, folder)
    fs.mkdirSync(dest, { recursive: true })
    cb(null, dest)
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now()
    const ext = path.extname(file.originalname)
    const baseName = path
      .basename(file.originalname, ext)
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9\-]/g, '')
    cb(null, `${timestamp}-${baseName}${ext}`)
  },
})

const upload = multer({
  storage,
  limits: { fileSize: 1024 * 1024 * 200 }, // 200MB
})

// Helper tipo_contenido
function inferirTipoContenido(mime: string): TipoContenido {
  if (mime.startsWith('video/')) return 'video'
  if (mime.startsWith('audio/')) return 'audio'
  if (mime === 'application/pdf') return 'pdf'
  if (mime.startsWith('application/vnd')) return 'presentacion'
  return 'enlace'
}

// POST /api/media/lecciones/:id  (file)
r.post('/lecciones/:id', upload.single('file'), async (req, res) => {
  try {
    const id_leccion = Number(req.params.id)
    const leccion = await Leccion.findByPk(id_leccion)
    if (!leccion) {
      if (req.file) fs.unlinkSync(req.file.path)
      return res.status(404).json({ error: 'Lección no encontrada' })
    }

    if (!req.file) {
      return res.status(400).json({ error: 'Archivo (file) requerido' })
    }

    const mime = req.file.mimetype
    const tipo_contenido = inferirTipoContenido(mime)

    const relativePath = req.file.path.split('uploads').pop() || ''
    // ⬇️ aquí ya guardamos la URL EXACTA que sirve el backend
    const url_contenido = `/uploads${relativePath.replace(/\\/g, '/')}`

    await leccion.update({
      tipo_contenido,
      url_contenido,
    })

    return res.status(201).json({ id_leccion, tipo_contenido, url_contenido })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Error subiendo archivo' })
  }
})

r.post('/lecciones/:id/enlace', async (req, res) => {
  try {
    const id_leccion = Number(req.params.id)
    const { url } = req.body as { url?: string }

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'url requerida' })
    }

    // validación básica
    if (!/^https?:\/\//i.test(url)) {
      return res.status(400).json({ error: 'url debe empezar por http:// o https://' })
    }

    const leccion = await Leccion.findByPk(id_leccion)
    if (!leccion) {
      return res.status(404).json({ error: 'Lección no encontrada' })
    }

    await leccion.update({
      tipo_contenido: 'enlace',
      url_contenido: url,
      texto_contenido: null,
      duracion_seg: null,
    })

    return res.status(200).json({
      id_leccion,
      tipo_contenido: 'enlace',
      url_contenido: url,
    })
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Error guardando enlace' })
  }
})

// DELETE /api/media/lecciones/:id
r.delete('/lecciones/:id', async (req, res) => {
  try {
    const id_leccion = Number(req.params.id)
    const leccion = await Leccion.findByPk(id_leccion)
    if (!leccion) return res.status(404).json({ error: 'Lección no encontrada' })

    const url = leccion.url_contenido
    if (url && url.startsWith('/api/uploads')) {
      const filePath = path.join(
        __dirname,
        '..',
        '..',
        url.replace('/api/uploads', 'uploads')
      )
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath)
      }
    }

    await leccion.update({
      url_contenido: null,
    })

    return res.status(204).send()
  } catch (e) {
    console.error(e)
    return res.status(500).json({ error: 'Error eliminando archivo' })
  }
})

export default r
