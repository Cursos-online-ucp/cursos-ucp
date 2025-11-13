import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  obtenerCursoArbol,
  type CursoArbol,
  type ModuloCurso,
  type Leccion,
} from '../api/cursos'
import {
  crearModulo,
  actualizarModulo,
  eliminarModulo,
  crearLeccion,
} from '../api/modulos'
import { actualizarLeccion, eliminarLeccion } from '../api/lecciones'
import LeccionMediaUploader from '../components/LeccionMediaUploader'
import LeccionQuizPanel from '../components/LeccionQuizPanel'

export default function CursoBuilderPage() {
  const { id } = useParams<{ id: string }>()
  const [curso, setCurso] = useState<CursoArbol | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [nuevoModuloTitulo, setNuevoModuloTitulo] = useState('')
  const [nuevoTituloLeccion, setNuevoTituloLeccion] = useState<Record<number, string>>({})

  async function cargar() {
    if (!id) return
    try {
      setLoading(true)
      setError(null)
      const data = await obtenerCursoArbol(Number(id))
      // Ordenamos por orden
      data.modulos.sort((a, b) => a.orden - b.orden)
      data.modulos.forEach((m) => m.lecciones?.sort((a, b) => a.orden - b.orden))
      setCurso(data)
    } catch (e) {
      console.error(e)
      setError('Error cargando curso')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
  }, [id])

  async function handleCrearModulo() {
    if (!curso || !nuevoModuloTitulo.trim()) return
    try {
      const mod = await crearModulo(curso.id_curso, nuevoModuloTitulo.trim())
      setNuevoModuloTitulo('')
      setCurso((c) =>
        c ? { ...c, modulos: [...c.modulos, { ...mod, lecciones: [] }] } : c
      )
    } catch (e) {
      console.error(e)
      setError('Error creando módulo')
    }
  }

  async function handleActualizarModulo(m: ModuloCurso, titulo: string) {
    try {
      const modActualizado = await actualizarModulo(m.id_modulo, { titulo })
      setCurso((c) =>
        c
          ? {
              ...c,
              modulos: c.modulos.map((x) =>
                x.id_modulo === m.id_modulo ? { ...x, titulo: modActualizado.titulo } : x
              ),
            }
          : c
      )
    } catch (e) {
      console.error(e)
      setError('Error actualizando módulo')
    }
  }

  async function handleEliminarModulo(m: ModuloCurso) {
    if (!confirm('¿Eliminar módulo y todas sus lecciones?')) return
    try {
      await eliminarModulo(m.id_modulo)
      setCurso((c) =>
        c ? { ...c, modulos: c.modulos.filter((x) => x.id_modulo !== m.id_modulo) } : c
      )
    } catch (e) {
      console.error(e)
      setError('Error eliminando módulo')
    }
  }

  async function handleCrearLeccion(m: ModuloCurso) {
    const titulo = (nuevoTituloLeccion[m.id_modulo] || '').trim()
    if (!titulo) return
    try {
      const l = await crearLeccion(m.id_modulo, {
        titulo,
        descripcion: '',
        orden: (m.lecciones?.length || 0) + 1,
      })
      setNuevoTituloLeccion((prev) => ({ ...prev, [m.id_modulo]: '' }))
      setCurso((c) =>
        c
          ? {
              ...c,
              modulos: c.modulos.map((mod) =>
                mod.id_modulo === m.id_modulo
                  ? { ...mod, lecciones: [...(mod.lecciones || []), l] }
                  : mod
              ),
            }
          : c
      )
    } catch (e) {
      console.error(e)
      setError('Error creando lección')
    }
  }

  async function handleActualizarLeccion(l: Leccion, campos: Partial<Leccion>) {
    try {
      const actualizada = await actualizarLeccion(l.id_leccion, campos)
      setCurso((c) =>
        c
          ? {
              ...c,
              modulos: c.modulos.map((m) => ({
                ...m,
                lecciones: m.lecciones?.map((lx) =>
                  lx.id_leccion === l.id_leccion ? { ...lx, ...actualizada } : lx
                ),
              })),
            }
          : c
      )
    } catch (e) {
      console.error(e)
      setError('Error actualizando lección')
    }
  }

  async function handleEliminarLeccion(l: Leccion) {
    if (!confirm('¿Eliminar lección?')) return
    try {
      await eliminarLeccion(l.id_leccion)
      setCurso((c) =>
        c
          ? {
              ...c,
              modulos: c.modulos.map((m) => ({
                ...m,
                lecciones: m.lecciones?.filter((lx) => lx.id_leccion !== l.id_leccion),
              })),
            }
          : c
      )
    } catch (e) {
      console.error(e)
      setError('Error eliminando lección')
    }
  }

  if (loading) {
    return <div className="p-6 text-sm text-gray-500">Cargando curso…</div>
  }

  if (!curso) {
    return <div className="p-6 text-sm text-red-600">Curso no encontrado</div>
  }

  return (
    <div className="min-h-screen bg-ucp-gris-fondo">
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{curso.titulo}</h1>
            <p className="text-xs text-slate-500">
              Constructor de contenido: módulos, lecciones, multimedia y cuestionarios.
            </p>
          </div>
          <Link
            to="/cursos"
            className="text-xs text-ucp-verde hover:underline"
          >
            ← Volver a mis cursos
          </Link>
        </div>

        {error && (
          <div className="rounded-md border border-red-200 bg-red-50 px-4 py-2 text-xs text-red-700">
            {error}
          </div>
        )}

        {/* Crear módulo */}
        <div className="rounded-lg bg-white p-4 shadow-sm border border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800 mb-2">Módulos del curso</h2>
          <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
            <input
              type="text"
              className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ucp-verde/60"
              placeholder="Nombre del nuevo módulo"
              value={nuevoModuloTitulo}
              onChange={(e) => setNuevoModuloTitulo(e.target.value)}
            />
            <button
              onClick={handleCrearModulo}
              className="inline-flex items-center justify-center rounded-md bg-ucp-verde px-3 py-2 text-xs font-semibold text-white hover:bg-ucp-verde-oscuro"
            >
              Añadir módulo
            </button>
          </div>
        </div>

        {/* Lista de módulos y lecciones */}
        <div className="space-y-4">
          {curso.modulos.map((m) => (
            <div
              key={m.id_modulo}
              className="rounded-lg bg-white shadow-sm border border-slate-100 p-4"
            >
              {/* Encabezado módulo */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <input
                    className="w-full bg-transparent text-sm font-semibold text-slate-900 border-b border-transparent focus:border-ucp-verde focus:outline-none"
                    value={m.titulo}
                    onChange={(e) =>
                      setCurso((c) =>
                        c
                          ? {
                              ...c,
                              modulos: c.modulos.map((x) =>
                                x.id_modulo === m.id_modulo
                                  ? { ...x, titulo: e.target.value }
                                  : x
                              ),
                            }
                          : c
                      )
                    }
                    onBlur={(e) => handleActualizarModulo(m, e.target.value)}
                  />
                  <p className="text-[11px] text-slate-500 mt-1">
                    Módulo #{m.orden ?? '-'}
                  </p>
                </div>
                <button
                  onClick={() => handleEliminarModulo(m)}
                  className="text-[11px] text-red-600 hover:underline"
                >
                  Eliminar módulo
                </button>
              </div>

              {/* Lecciones */}
              <div className="mt-4 space-y-3">
                {(m.lecciones || []).map((l) => (
                  <div
                    key={l.id_leccion}
                    className="rounded-md border border-slate-200 bg-slate-50 px-3 py-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <div className="flex-1">
                        <input
                          className="w-full bg-transparent text-sm font-medium text-slate-900 border-b border-transparent focus:border-ucp-verde focus:outline-none"
                          value={l.titulo}
                          onChange={(e) =>
                            setCurso((c) =>
                              c
                                ? {
                                    ...c,
                                    modulos: c.modulos.map((mod) => ({
                                      ...mod,
                                      lecciones: mod.lecciones?.map((lx) =>
                                        lx.id_leccion === l.id_leccion
                                          ? { ...lx, titulo: e.target.value }
                                          : lx
                                      ),
                                    })),
                                  }
                                : c
                            )
                          }
                          onBlur={(e) =>
                            handleActualizarLeccion(l, { titulo: e.target.value })
                          }
                        />
                        <textarea
                          className="mt-1 w-full bg-transparent text-xs text-slate-700 border border-slate-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-ucp-verde/60"
                          placeholder="Descripción de la lección (opcional)"
                          value={l.descripcion ?? ''}
                          onChange={(e) =>
                            setCurso((c) =>
                              c
                                ? {
                                    ...c,
                                    modulos: c.modulos.map((mod) => ({
                                      ...mod,
                                      lecciones: mod.lecciones?.map((lx) =>
                                        lx.id_leccion === l.id_leccion
                                          ? { ...lx, descripcion: e.target.value }
                                          : lx
                                      ),
                                    })),
                                  }
                                : c
                            )
                          }
                          onBlur={(e) =>
                            handleActualizarLeccion(l, { descripcion: e.target.value })
                          }
                          rows={2}
                        />
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className="text-[11px] text-slate-500">
                          Orden: {l.orden}
                        </span>
                        <button
                          onClick={() => handleEliminarLeccion(l)}
                          className="text-[11px] text-red-600 hover:underline"
                        >
                          Eliminar lección
                        </button>
                      </div>
                    </div>

                    {/* Bloque de multimedia para la lección */}
                    <div className="mt-3">
                      <LeccionMediaUploader
                        idLeccion={l.id_leccion}
                        tipoInicial={l.tipo_contenido as any}
                        urlInicial={l.url_contenido ?? undefined}
                        onChange={(media) =>
                          setCurso((c) =>
                            c
                              ? {
                                  ...c,
                                  modulos: c.modulos.map((mod) => ({
                                    ...mod,
                                    lecciones: mod.lecciones?.map((lx) =>
                                      lx.id_leccion === l.id_leccion
                                        ? {
                                            ...lx,
                                            tipo_contenido:
                                              media?.tipo_contenido ?? null,
                                            url_contenido:
                                              media?.url_contenido ?? null,
                                          }
                                        : lx
                                    ),
                                  })),
                                }
                              : c
                          )
                        }
                      />
                    </div>

                    {/* Bloque de quiz para la lección */}
                    <div className="mt-3">
                      <LeccionQuizPanel idLeccion={l.id_leccion} />
                    </div>
                  </div>
                ))}

                {/* Crear nueva lección */}
                <div className="mt-2 flex flex-col sm:flex-row gap-2 sm:items-center">
                  <input
                    type="text"
                    className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-ucp-verde/60"
                    placeholder="Título de la nueva lección"
                    value={nuevoTituloLeccion[m.id_modulo] || ''}
                    onChange={(e) =>
                      setNuevoTituloLeccion((prev) => ({
                        ...prev,
                        [m.id_modulo]: e.target.value,
                      }))
                    }
                  />
                  <button
                    onClick={() => handleCrearLeccion(m)}
                    className="inline-flex items-center justify-center rounded-md bg-ucp-verde px-3 py-2 text-xs font-semibold text-white hover:bg-ucp-verde-oscuro"
                  >
                    Añadir lección
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
