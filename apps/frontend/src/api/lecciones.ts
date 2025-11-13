import api from './client'
import type { Leccion } from './cursos'

export async function actualizarLeccion(
  id_leccion: number,
  payload: Partial<Leccion>
): Promise<Leccion> {
  const { data } = await api.put<Leccion>(`/lecciones/${id_leccion}`, payload)
  return data
}

export async function eliminarLeccion(id_leccion: number) {
  await api.delete(`/lecciones/${id_leccion}`)
}
