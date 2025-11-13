import { useEffect, useState } from 'react'
import {
  getQuizByLeccion,
  createQuiz,
  createPregunta,
  deletePregunta,
  createOpcion,
  deleteOpcion,
  type Quiz,
  type PreguntaQuiz,
  type OpcionQuiz,
  type TipoPregunta,
} from '../api/quizzes'

type Props = {
  idLeccion: number
}

export default function LeccionQuizPanel({ idLeccion }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quiz, setQuiz] = useState<Quiz | null>(null)

  // formulario crear quiz
  const [tituloQuiz, setTituloQuiz] = useState('')
  const [descripcionQuiz, setDescripcionQuiz] = useState('')
  const [porcentajeAprob, setPorcentajeAprob] = useState<string>('')

  // formularios por pregunta
  const [nuevoEnunciado, setNuevoEnunciado] = useState<Record<number, string>>({})
  const [nuevoTipo, setNuevoTipo] = useState<Record<number, TipoPregunta>>({})
  const [nuevaOpcionTexto, setNuevaOpcionTexto] = useState<Record<number, string>>({})
  const [nuevaOpcionCorrecta, setNuevaOpcionCorrecta] = useState<Record<number, boolean>>({})

  async function cargar() {
    try {
      setLoading(true)
      setError(null)
      const q = await getQuizByLeccion(idLeccion)
      setQuiz(q)
    } catch (e) {
      console.error(e)
      setError('Error cargando quiz')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idLeccion])

  async function handleCrearQuiz() {
    const titulo = tituloQuiz.trim()
    if (!titulo) {
      setError('El título del quiz es requerido')
      return
    }

    const porcentaje =
      porcentajeAprob.trim() === '' ? undefined : Number(porcentajeAprob.trim())

    try {
      setError(null)
      const q = await createQuiz({
        id_leccion: idLeccion,
        titulo,
        descripcion: descripcionQuiz.trim() || undefined,
        porcentaje_aprobacion:
          porcentaje !== undefined && !Number.isNaN(porcentaje) ? porcentaje : undefined,
      })
      setQuiz({ ...q, preguntas: [] })
      setTituloQuiz('')
      setDescripcionQuiz('')
      setPorcentajeAprob('')
    } catch (e: any) {
      console.error(e)
      const msg =
        e?.response?.data?.error ||
        e?.response?.data?.message ||
        'Error creando quiz (verifica que la lección no tenga uno existente)'
      setError(msg)
    }
  }

  async function handleCrearPregunta() {
    if (!quiz) return
    const idQuiz = quiz.id_quiz

    const enunciado = (nuevoEnunciado[idQuiz] || '').trim()
    const tipo = nuevoTipo[idQuiz] || 'opcion_multiple'

    if (!enunciado) {
      setError('El enunciado de la pregunta es requerido')
      return
    }

    try {
      setError(null)
      const orden = (quiz.preguntas?.length || 0) + 1
      const p = await createPregunta(idQuiz, { enunciado, tipo_pregunta: tipo, orden })

      setQuiz((prev) =>
        prev
          ? {
              ...prev,
              preguntas: [...(prev.preguntas || []), { ...p, opciones: [] }],
            }
          : prev
      )

      setNuevoEnunciado((prev) => ({ ...prev, [idQuiz]: '' }))
      setNuevoTipo((prev) => ({ ...prev, [idQuiz]: 'opcion_multiple' }))
    } catch (e) {
      console.error(e)
      setError('Error creando pregunta')
    }
  }

  async function handleEliminarPregunta(p: PreguntaQuiz) {
    if (!quiz) return
    if (!confirm('¿Eliminar esta pregunta y sus opciones?')) return

    try {
      setError(null)
      await deletePregunta(p.id_pregunta)
      setQuiz((prev) =>
        prev
          ? {
              ...prev,
              preguntas: (prev.preguntas || []).filter(
                (q) => q.id_pregunta !== p.id_pregunta
              ),
            }
          : prev
      )
    } catch (e) {
      console.error(e)
      setError('Error eliminando pregunta')
    }
  }

  async function handleCrearOpcion(p: PreguntaQuiz) {
    if (!quiz) return

    const texto = (nuevaOpcionTexto[p.id_pregunta] || '').trim()
    if (!texto) {
      setError('El texto de la opción es requerido')
      return
    }

    const es_correcta = nuevaOpcionCorrecta[p.id_pregunta] || false

    try {
      setError(null)
      const orden = (p.opciones?.length || 0) + 1
      const op = await createOpcion(p.id_pregunta, { texto, es_correcta, orden })

      setQuiz((prev) =>
        prev
          ? {
              ...prev,
              preguntas: (prev.preguntas || []).map((q) =>
                q.id_pregunta === p.id_pregunta
                  ? {
                      ...q,
                      opciones: [...(q.opciones || []), op],
                    }
                  : q
              ),
            }
          : prev
      )

      setNuevaOpcionTexto((prev) => ({ ...prev, [p.id_pregunta]: '' }))
      setNuevaOpcionCorrecta((prev) => ({ ...prev, [p.id_pregunta]: false }))
    } catch (e) {
      console.error(e)
      setError('Error creando opción')
    }
  }

  async function handleEliminarOpcion(p: PreguntaQuiz, op: OpcionQuiz) {
    if (!quiz) return
    if (!confirm('¿Eliminar esta opción?')) return

    try {
      setError(null)
      await deleteOpcion(op.id_opcion)
      setQuiz((prev) =>
        prev
          ? {
              ...prev,
              preguntas: (prev.preguntas || []).map((q) =>
                q.id_pregunta === p.id_pregunta
                  ? {
                      ...q,
                      opciones: (q.opciones || []).filter(
                        (o) => o.id_opcion !== op.id_opcion
                      ),
                    }
                  : q
              ),
            }
          : prev
      )
    } catch (e) {
      console.error(e)
      setError('Error eliminando opción')
    }
  }

  return (
    <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="flex items-center justify-between gap-2">
        <h3 className="text-sm font-semibold text-slate-800">Quiz de la lección</h3>
        <button
          type="button"
          onClick={cargar}
          className="text-xs text-slate-500 hover:text-slate-700"
        >
          Recargar
        </button>
      </div>

      {loading && <p className="mt-2 text-xs text-slate-500">Cargando…</p>}
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {/* Si no hay quiz → formulario de creación */}
      {!quiz && !loading && (
        <div className="mt-3 space-y-2 rounded-md bg-white p-3 shadow-sm">
          <p className="text-xs text-slate-600">
            Esta lección aún no tiene un quiz configurado. Crea uno para evaluar al estudiante.
          </p>

          <input
            type="text"
            placeholder="Título del quiz"
            value={tituloQuiz}
            onChange={(e) => setTituloQuiz(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-ucp-verde focus:outline-none focus:ring-1 focus:ring-ucp-verde"
          />

          <textarea
            placeholder="Descripción (opcional)"
            value={descripcionQuiz}
            onChange={(e) => setDescripcionQuiz(e.target.value)}
            rows={2}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-ucp-verde focus:outline-none focus:ring-1 focus:ring-ucp-verde"
          />

          <div className="flex items-center gap-2">
            <input
              type="number"
              min={0}
              max={100}
              placeholder="% aprobación (opcional)"
              value={porcentajeAprob}
              onChange={(e) => setPorcentajeAprob(e.target.value)}
              className="w-32 rounded-md border border-slate-300 px-3 py-1.5 text-xs focus:border-ucp-verde focus:outline-none focus:ring-1 focus:ring-ucp-verde"
            />
            <span className="text-[11px] text-slate-500">Porcentaje mínimo para aprobar</span>
          </div>

          <button
            type="button"
            onClick={handleCrearQuiz}
            className="inline-flex items-center justify-center rounded-md bg-ucp-verde px-3 py-1.5 text-xs font-medium text-white hover:bg-ucp-verde/90"
          >
            Crear quiz
          </button>
        </div>
      )}

      {/* Si hay quiz → mostrar y gestionar preguntas/opciones */}
      {quiz && (
        <div className="mt-3 space-y-3">
          <div className="rounded-md bg-white p-3 shadow-sm">
            <h4 className="text-xs font-semibold text-slate-800">{quiz.titulo}</h4>
            {quiz.descripcion && (
              <p className="mt-1 text-xs text-slate-500">{quiz.descripcion}</p>
            )}
            {quiz.porcentaje_aprobacion != null && (
              <p className="mt-1 text-xs text-slate-500">
                Aprobación mínima:{' '}
                <span className="font-semibold">
                  {Number(quiz.porcentaje_aprobacion).toFixed(0)}%
                </span>
              </p>
            )}
          </div>

          {/* Preguntas */}
          <div className="space-y-2">
            {(quiz.preguntas || []).map((p) => (
              <div
                key={p.id_pregunta}
                className="rounded-md border border-slate-200 bg-white p-3 shadow-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="text-xs font-medium text-slate-800">{p.enunciado}</p>
                    <p className="text-[11px] text-slate-400">
                      Tipo:{' '}
                      {p.tipo_pregunta === 'opcion_multiple'
                        ? 'Opción múltiple'
                        : 'Verdadero / falso'}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleEliminarPregunta(p)}
                    className="text-[10px] text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                </div>

                {/* Opciones */}
                <div className="mt-2 space-y-1">
                  {(p.opciones || []).map((op) => (
                    <div
                      key={op.id_opcion}
                      className="flex items-center justify-between gap-2 rounded bg-slate-50 px-2 py-1"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-800">{op.texto}</span>
                        {op.es_correcta && (
                          <span className="rounded bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
                            Correcta
                          </span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleEliminarOpcion(p, op)}
                        className="text-[10px] text-red-500 hover:text-red-700"
                      >
                        Quitar
                      </button>
                    </div>
                  ))}
                </div>

                {/* Añadir opción */}
                <div className="mt-2 rounded-md bg-slate-50 p-2">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <input
                      type="text"
                      placeholder="Nueva opción"
                      value={nuevaOpcionTexto[p.id_pregunta] || ''}
                      onChange={(e) =>
                        setNuevaOpcionTexto((prev) => ({
                          ...prev,
                          [p.id_pregunta]: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-ucp-verde focus:outline-none focus:ring-1 focus:ring-ucp-verde"
                    />
                    <label className="flex items-center gap-1 text-[11px] text-slate-600">
                      <input
                        type="checkbox"
                        checked={!!nuevaOpcionCorrecta[p.id_pregunta]}
                        onChange={(e) =>
                          setNuevaOpcionCorrecta((prev) => ({
                            ...prev,
                            [p.id_pregunta]: e.target.checked,
                          }))
                        }
                      />
                      Correcta
                    </label>
                    <button
                      type="button"
                      onClick={() => handleCrearOpcion(p)}
                      className="inline-flex items-center justify-center rounded-md bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-white hover:bg-slate-900"
                    >
                      Añadir opción
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {!loading && (quiz.preguntas || []).length === 0 && (
              <p className="text-xs text-slate-500">
                Este quiz aún no tiene preguntas. Crea la primera pregunta.
              </p>
            )}
          </div>

          {/* Crear nueva pregunta */}
          <div className="rounded-md bg-white p-3 shadow-sm">
            <p className="mb-2 text-xs font-semibold text-slate-800">
              Añadir nueva pregunta
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                type="text"
                placeholder="Enunciado de la pregunta"
                value={quiz ? nuevoEnunciado[quiz.id_quiz] || '' : ''}
                onChange={(e) =>
                  quiz &&
                  setNuevoEnunciado((prev) => ({
                    ...prev,
                    [quiz.id_quiz]: e.target.value,
                  }))
                }
                className="w-full rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-ucp-verde focus:outline-none focus:ring-1 focus:ring-ucp-verde"
              />
              <select
                value={quiz ? nuevoTipo[quiz.id_quiz] || 'opcion_multiple' : 'opcion_multiple'}
                onChange={(e) =>
                  quiz &&
                  setNuevoTipo((prev) => ({
                    ...prev,
                    [quiz.id_quiz]: e.target.value as TipoPregunta,
                  }))
                }
                className="rounded-md border border-slate-300 px-2 py-1 text-xs focus:border-ucp-verde focus:outline-none focus:ring-1 focus:ring-ucp-verde"
              >
                <option value="opcion_multiple">Opción múltiple</option>
                <option value="verdadero_falso">Verdadero / falso</option>
              </select>
              <button
                type="button"
                onClick={handleCrearPregunta}
                className="inline-flex items-center justify-center rounded-md bg-ucp-verde px-3 py-1.5 text-xs font-medium text-white hover:bg-ucp-verde/90"
              >
                Añadir pregunta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
