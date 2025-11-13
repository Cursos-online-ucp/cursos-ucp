import api from './client'
import  type { Curso } from '../types/curso'

export interface PaginatedCursos {
  data: Curso[]
  page: number
  size: number
  total: number
}

// Listar cursos
export async function listarCursos(page = 1, size = 10): Promise<PaginatedCursos> {
  const { data } = await api.get<PaginatedCursos>('/cursos', {
    params: { page, size }
  })
  return data
}

// Crear curso
export async function crearCurso(payload: Partial<Curso>): Promise<Curso> {
  const { data } = await api.post<Curso>('/cursos', payload)
  return data
}

// Actualizar curso
export async function actualizarCurso(id: number, payload: Partial<Curso>): Promise<Curso> {
  const { data } = await api.put<Curso>(`/cursos/${id}`, payload)
  return data
}

// Eliminar curso
export async function eliminarCurso(id: number): Promise<void> {
  await api.delete(`/cursos/${id}`)
}

// Duplicar curso
export async function duplicarCurso(id: number): Promise<Curso> {
  const { data } = await api.post<Curso>(`/cursos/${id}/duplicar`)
  return data
}

// Programar publicación
export async function programarPublicacion(id: number, publicar_desde: string): Promise<Curso> {
  const { data } = await api.post<Curso>(`/cursos/${id}/programar-publicacion`, {
    publicar_desde
  })
  return data
}

// Publicar ahora
export async function publicarCurso(id: number): Promise<Curso> {
  const { data } = await api.post<Curso>(`/cursos/${id}/publicar`)
  return data
}

// Programar descuento
export async function programarDescuento(
  id: number,
  payload: {
    precio_promocional: number
    descuento_desde: string
    descuento_hasta: string
  }
): Promise<Curso> {
  const { data } = await api.post<Curso>(`/cursos/${id}/programar-descuento`, payload)
  return data
}

// Cancelar descuento
export async function cancelarDescuento(id: number): Promise<void> {
  await api.post(`/cursos/${id}/cancelar-descuento`)
}

// añadir arbol del curso

export interface Leccion {
    id_leccion: number
    id_modulo: number
    titulo: string
    descripcion?: string | null
    tipo_contenido: 'video' | 'audio' | 'pdf' | 'presentacion' | 'enlace' | 'texto' | null
    url_contenido?: string | null
    orden: number
  }
  
  export interface ModuloCurso {
    id_modulo: number
    id_curso: number
    titulo: string
    orden: number
    lecciones?: Leccion[]
  }
  
  export interface CursoArbol {
    id_curso: number
    titulo: string
    descripcion?: string | null
    categoria?: string | null
    idioma?: string | null
    nivel: 'basico' | 'intermedio' | 'avanzado'
    precio: string | number
    estado: 'borrador' | 'programado' | 'publicado' | 'inactivo'
    modulos: ModuloCurso[]
  }
  
  export async function obtenerCursoArbol(id: number): Promise<CursoArbol> {
    const { data } = await api.get<CursoArbol>(`/cursos/${id}/arbol`)
    return data
  }
