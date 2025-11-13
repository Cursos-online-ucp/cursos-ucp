import api from './client'

export type TipoPregunta = 'opcion_multiple' | 'verdadero_falso'

export interface OpcionQuiz {
  id_opcion: number
  id_pregunta: number
  texto: string
  es_correcta: boolean
  orden?: number | null
}

export interface PreguntaQuiz {
  id_pregunta: number
  id_quiz: number
  enunciado: string
  tipo_pregunta: TipoPregunta
  orden?: number | null
  opciones?: OpcionQuiz[]
}

export interface Quiz {
  id_quiz: number
  id_leccion: number
  titulo: string
  descripcion?: string | null
  porcentaje_aprobacion?: number | null
  preguntas?: PreguntaQuiz[]
}

/**
 * Obtener quiz de una lección (quiz + preguntas + opciones)
 * GET /api/quizzes/leccion/:id_leccion
 */
export async function getQuizByLeccion(idLeccion: number): Promise<Quiz | null> {
  try {
    const { data } = await api.get<Quiz>(`/quizzes/leccion/${idLeccion}`)
    return data
  } catch (err: any) {
    if (err?.response?.status === 404) {
      // la lección aún no tiene quiz
      return null
    }
    throw err
  }
}

/**
 * Crear quiz para una lección
 * POST /api/quizzes
 */
export async function createQuiz(payload: {
  id_leccion: number
  titulo: string
  descripcion?: string
  porcentaje_aprobacion?: number
}): Promise<Quiz> {
  const { data } = await api.post<Quiz>('/quizzes', payload)
  return data
}

/**
 * Crear pregunta dentro de un quiz
 * POST /api/quizzes/:id_quiz/preguntas
 */
export async function createPregunta(
  idQuiz: number,
  payload: {
    enunciado: string
    tipo_pregunta: TipoPregunta
    orden?: number
  }
): Promise<PreguntaQuiz> {
  const { data } = await api.post<PreguntaQuiz>(`/quizzes/${idQuiz}/preguntas`, payload)
  return data
}

/**
 * Eliminar pregunta (y sus opciones)
 * DELETE /api/quizzes/preguntas/:id_pregunta
 */
export async function deletePregunta(idPregunta: number): Promise<void> {
  await api.delete(`/quizzes/preguntas/${idPregunta}`)
}

/**
 * Crear opción para una pregunta
 * POST /api/quizzes/preguntas/:id_pregunta/opciones
 */
export async function createOpcion(
  idPregunta: number,
  payload: {
    texto: string
    es_correcta: boolean
    orden?: number
  }
): Promise<OpcionQuiz> {
  const { data } = await api.post<OpcionQuiz>(
    `/quizzes/preguntas/${idPregunta}/opciones`,
    payload
  )
  return data
}

/**
 * Eliminar opción
 * DELETE /api/quizzes/opciones/:id_opcion
 */
export async function deleteOpcion(idOpcion: number): Promise<void> {
  await api.delete(`/quizzes/opciones/${idOpcion}`)
}
