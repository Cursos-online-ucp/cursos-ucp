import api from './client'

export interface ResMediaLeccion {
  id_leccion: number
  tipo_contenido: 'video' | 'audio' | 'pdf' | 'presentacion' | 'enlace' | 'texto'
  url_contenido: string
}

// Subir archivo a una lección
export async function subirArchivoLeccion(
  id_leccion: number,
  file: File
): Promise<ResMediaLeccion> {
  const formData = new FormData()
  formData.append('file', file) // el backend espera 'file'

  const { data } = await api.post<ResMediaLeccion>(
    `/media/lecciones/${id_leccion}`,
    formData,
    {
      headers: {
        // axios ya pone multipart con boundary, esto es opcional
        'Content-Type': 'multipart/form-data',
      },
    }
  )

  return data
}

// Eliminar archivo asociado a una lección
export async function eliminarArchivoLeccion(id_leccion: number): Promise<void> {
  await api.delete(`/media/lecciones/${id_leccion}`)
}

export async function asignarEnlaceALeccion(idLeccion: number, url: string) {
    const { data } = await api.post(`/media/lecciones/${idLeccion}/enlace`, { url })
    return data
  }
