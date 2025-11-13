import { useState } from 'react'
import {
  subirArchivoLeccion,
  eliminarArchivoLeccion,
  asignarEnlaceALeccion,
} from '../api/media'
import type { ResMediaLeccion } from '../api/media'

const BACKEND_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:4000'

type Props = {
  idLeccion: number
  tipoInicial?: ResMediaLeccion['tipo_contenido'] | null
  urlInicial?: string | null
  onChange?: (media: ResMediaLeccion | null) => void
}

export default function LeccionMediaUploader({
  idLeccion,
  tipoInicial,
  urlInicial,
  onChange,
}: Props) {
  const [subiendo, setSubiendo] = useState(false)
  const [borrando, setBorrando] = useState(false)
  const [guardandoEnlace, setGuardandoEnlace] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [link, setLink] = useState('')

  const [media, setMedia] = useState<ResMediaLeccion | null>(
    urlInicial && tipoInicial
      ? { id_leccion: idLeccion, tipo_contenido: tipoInicial, url_contenido: urlInicial }
      : null
  )

  // Si es URL absoluta (http/https) la usamos tal cual
  // Si es relativa (/uploads/...) la pegamos al BACKEND_URL
  const fullUrl =
    media && media.url_contenido
      ? media.url_contenido.startsWith('http')
        ? media.url_contenido
        : `${BACKEND_URL}${media.url_contenido}`
      : null

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      setError(null)
      setSubiendo(true)
      const resp = await subirArchivoLeccion(idLeccion, file)
      setMedia(resp)
      setLink('') // limpiamos enlace si había
      onChange?.(resp)
    } catch (err) {
      console.error(err)
      setError('Error subiendo archivo')
    } finally {
      setSubiendo(false)
      e.target.value = '' // limpiar input
    }
  }

  async function handleDelete() {
    if (!media) return
    if (!confirm('¿Quitar recurso de esta lección?')) return

    try {
      setError(null)
      setBorrando(true)
      await eliminarArchivoLeccion(idLeccion)
      setMedia(null)
      setLink('')
      onChange?.(null)
    } catch (err) {
      console.error(err)
      setError('Error eliminando recurso')
    } finally {
      setBorrando(false)
    }
  }

  async function handleGuardarEnlace() {
    const url = link.trim()
    if (!url) {
      setError('Debes ingresar un enlace')
      return
    }

    try {
      setError(null)
      setGuardandoEnlace(true)
      const resp = await asignarEnlaceALeccion(idLeccion, url)
      setMedia(resp)
      onChange?.(resp)
    } catch (err) {
      console.error(err)
      setError('Error guardando enlace')
    } finally {
      setGuardandoEnlace(false)
    }
  }

  function renderPreview() {
    if (!media || !fullUrl) return null

    const tipo = media.tipo_contenido

    if (tipo === 'video') {
      return (
        <video
          controls
          src={fullUrl}
          className="mt-3 w-full max-h-64 rounded-md border border-gray-200 bg-black/80"
        />
      )
    }

    if (tipo === 'audio') {
      return (
        <audio controls src={fullUrl} className="mt-3 w-full">
          Tu navegador no soporta audio.
        </audio>
      )
    }

    if (tipo === 'pdf' || tipo === 'presentacion') {
      return (
        <a
          href={fullUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center text-sm text-ucp-verde hover:underline"
        >
          Ver documento
        </a>
      )
    }

    if (tipo === 'enlace') {
      return (
        <a
          href={fullUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-3 inline-flex items-center text-sm text-ucp-verde hover:underline"
        >
          Abrir enlace externo
        </a>
      )
    }

    // Otros tipos / fallback
    return (
      <a
        href={fullUrl}
        target="_blank"
        rel="noreferrer"
        className="mt-3 inline-flex items-center text-sm text-ucp-verde hover:underline"
      >
        Abrir recurso
      </a>
    )
  }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-gray-800">Contenido multimedia</h3>
          <p className="text-xs text-gray-500">
            Sube un video, audio, PDF, presentación o define un enlace externo relacionado a esta
            lección.
          </p>
        </div>
      </div>

      {/* Sección de archivo */}
      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center">
        <label className="inline-flex cursor-pointer items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50">
          <span>{subiendo ? 'Subiendo…' : media ? 'Cambiar archivo' : 'Subir archivo'}</span>
          <input
            type="file"
            className="hidden"
            onChange={handleFileChange}
            disabled={subiendo || guardandoEnlace}
          />
        </label>

        {media && (
          <button
            type="button"
            onClick={handleDelete}
            disabled={borrando}
            className="inline-flex items-center rounded-md bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            {borrando ? 'Eliminando…' : 'Quitar recurso'}
          </button>
        )}
      </div>

      {/* Separador */}
      <div className="my-3 flex items-center gap-2">
        <div className="h-px flex-1 bg-gray-200" />
        <span className="text-[10px] uppercase tracking-wide text-gray-400">o</span>
        <div className="h-px flex-1 bg-gray-200" />
      </div>

      {/* Sección de enlace externo */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          type="url"
          placeholder="https://enlace-externo.com/recurso"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-xs focus:border-ucp-verde focus:outline-none focus:ring-1 focus:ring-ucp-verde"
        />
        <button
          type="button"
          onClick={handleGuardarEnlace}
          disabled={guardandoEnlace}
          className="mt-1 inline-flex items-center justify-center rounded-md bg-ucp-verde px-3 py-2 text-xs font-medium text-white hover:bg-ucp-verde/90 disabled:opacity-50 sm:mt-0"
        >
          {guardandoEnlace ? 'Guardando…' : 'Guardar enlace'}
        </button>
      </div>

      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {renderPreview()}
    </div>
  )
}
