export type Nivel = 'basico' | 'intermedio' | 'avanzado'
export type Estado = 'borrador' | 'programado' | 'publicado' | 'inactivo'

export interface Curso {
  id_curso: number
  titulo: string
  descripcion?: string | null
  categoria?: string | null
  idioma?: string | null
  nivel: Nivel
  precio: number
  estado: Estado
  id_productor?: number | null
  publicar_desde?: string | null
  publicado_en?: string | null
  // descuentos (si ya los agregaste en backend)
  precio_promocional?: number | null
  descuento_desde?: string | null
  descuento_hasta?: string | null
}
