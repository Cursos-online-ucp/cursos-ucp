import api from './client'
import type { ModuloCurso, Leccion } from './cursos'

export async function crearModulo(id_curso: number, titulo: string): Promise<ModuloCurso> {
  const { data } = await api.post<ModuloCurso>('/modulos', { id_curso, titulo })
  return data
}

export async function actualizarModulo(id_modulo: number, payload: Partial<ModuloCurso>) {
  const { data } = await api.put<ModuloCurso>(`/modulos/${id_modulo}`, payload)
  return data
}

export async function eliminarModulo(id_modulo: number) {
  await api.delete(`/modulos/${id_modulo}`)
}

export async function crearLeccion(
  id_modulo: number,
  payload: { titulo: string; descripcion?: string; orden: number }
): Promise<Leccion> {
  const { data } = await api.post<Leccion>(`/modulos/${id_modulo}/lecciones`, {
    titulo: payload.titulo,
    descripcion: payload.descripcion ?? '',
    orden: payload.orden,
    // tipo_contenido, url_contenido, etc. los pone el backend por defecto
  })
  return data
}
