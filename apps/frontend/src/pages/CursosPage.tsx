import { useEffect, useState } from 'react'
import type { Curso, Nivel } from '../types/curso'
import { Link } from 'react-router-dom'

import {
    listarCursos,
    crearCurso,
    actualizarCurso,
    eliminarCurso,
    duplicarCurso,
    publicarCurso,
    programarPublicacion,
    programarDescuento,
    cancelarDescuento
} from '../api/cursos'

type FormState = {
    id_curso?: number
    titulo: string
    descripcion: string
    categoria: string
    idioma: string
    nivel: Nivel
    precio: string
}

const NIVEL_OPTIONS: Nivel[] = ['basico', 'intermedio', 'avanzado']

export default function CursosPage() {
    const [cursos, setCursos] = useState<Curso[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formOpen, setFormOpen] = useState(false)
    const [form, setForm] = useState<FormState>({
        titulo: '',
        descripcion: '',
        categoria: '',
        idioma: '',
        nivel: 'basico',
        precio: '0'
    })

    const [pagina, setPagina] = useState(1)
    const [total, setTotal] = useState(0)
    const [size] = useState(10)

    async function cargar() {
        try {
            setLoading(true)
            setError(null)
            const resp = await listarCursos(pagina, size)
            setCursos(resp.data)
            setTotal(resp.total)
        } catch (e) {
            console.error(e)
            setError('Error cargando cursos')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        cargar()
    }, [pagina])

    function abrirCrear() {
        setForm({
            id_curso: undefined,
            titulo: '',
            descripcion: '',
            categoria: '',
            idioma: '',
            nivel: 'basico',
            precio: '0'
        })
        setFormOpen(true)
    }

    function abrirEditar(curso: Curso) {
        setForm({
            id_curso: curso.id_curso,
            titulo: curso.titulo,
            descripcion: curso.descripcion ?? '',
            categoria: curso.categoria ?? '',
            idioma: curso.idioma ?? '',
            nivel: curso.nivel,
            precio: String(curso.precio ?? 0)
        })
        setFormOpen(true)
    }

    async function guardarCurso(e: React.FormEvent) {
        e.preventDefault()
        try {
            setLoading(true)
            setError(null)

            const payload = {
                titulo: form.titulo,
                descripcion: form.descripcion || undefined,
                categoria: form.categoria || undefined,
                idioma: form.idioma || undefined,
                nivel: form.nivel,
                precio: Number(form.precio) || 0
            }

            if (!form.id_curso) {
                await crearCurso(payload)
            } else {
                await actualizarCurso(form.id_curso, payload)
            }

            setFormOpen(false)
            await cargar()
        } catch (e) {
            console.error(e)
            setError('Error guardando curso')
        } finally {
            setLoading(false)
        }
    }

    async function onEliminar(id: number) {
        if (!confirm('¿Eliminar este curso?')) return
        try {
            setLoading(true)
            await eliminarCurso(id)
            await cargar()
        } catch (e) {
            console.error(e)
            setError('Error eliminando curso')
        } finally {
            setLoading(false)
        }
    }

    async function onDuplicar(id: number) {
        try {
            setLoading(true)
            await duplicarCurso(id)
            await cargar()
        } catch (e) {
            console.error(e)
            setError('Error duplicando curso')
        } finally {
            setLoading(false)
        }
    }

    async function onPublicarAhora(id: number) {
        try {
            setLoading(true)
            await publicarCurso(id)
            await cargar()
        } catch (e) {
            console.error(e)
            setError('Error publicando curso (verifica módulos/lecciones)')
        } finally {
            setLoading(false)
        }
    }

    async function onProgramarPublicacion(id: number) {
        const fecha = prompt('Fecha/hora de publicación (ISO, ej: 2025-11-20T12:00:00Z):')
        if (!fecha) return
        try {
            setLoading(true)
            await programarPublicacion(id, fecha)
            await cargar()
        } catch (e) {
            console.error(e)
            setError('Error programando publicación')
        } finally {
            setLoading(false)
        }
    }

    async function onProgramarDescuento(id: number) {
        const precio = prompt('Precio promocional:')
        if (!precio) return
        const desde = prompt('Fecha desde (ISO, ej: 2025-11-20T00:00:00Z):')
        if (!desde) return
        const hasta = prompt('Fecha hasta (ISO, ej: 2025-11-30T23:59:59Z):')
        if (!hasta) return

        try {
            setLoading(true)
            await programarDescuento(id, {
                precio_promocional: Number(precio),
                descuento_desde: desde,
                descuento_hasta: hasta
            })
            await cargar()
        } catch (e) {
            console.error(e)
            setError('Error programando descuento')
        } finally {
            setLoading(false)
        }
    }

    async function onCancelarDescuento(id: number) {
        try {
            setLoading(true)
            await cancelarDescuento(id)
            await cargar()
        } catch (e) {
            console.error(e)
            setError('Error cancelando descuento')
        } finally {
            setLoading(false)
        }
    }

    const totalPaginas = Math.ceil(total / size) || 1

    return (
        <div className="min-h-screen bg-ucp-grisFondo">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">Mis cursos</h1>
                        <p className="text-sm text-slate-600 mt-1">
                            Crea, edita, publica y programa descuentos para tus cursos.
                        </p>
                    </div>
                    <button
                        onClick={abrirCrear}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-md 
                       bg-ucp-verde text-white text-sm font-semibold shadow-sm
                       hover:bg-ucp-verdeOscuro transition-colors"
                    >
                        Nuevo curso
                    </button>
                </header>

                {error && (
                    <div className="mb-4 rounded-md bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                {loading && (
                    <div className="mb-4 text-sm text-slate-500">
                        Procesando...
                    </div>
                )}

                {/* Tabla de cursos */}
                <div className="bg-white shadow-md rounded-lg overflow-hidden border border-slate-100">
                    <table className="w-full text-sm">
                        <thead className="bg-slate-100 text-slate-700">
                            <tr>
                                <th className="px-4 py-2 text-left font-semibold">Título</th>
                                <th className="px-4 py-2 text-left font-semibold">Nivel</th>
                                <th className="px-4 py-2 text-left font-semibold">Precio</th>
                                <th className="px-4 py-2 text-left font-semibold">Estado</th>
                                <th className="px-4 py-2 text-left font-semibold">Descuento</th>
                                <th className="px-4 py-2 text-right font-semibold">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {cursos.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-6 text-center text-slate-400">
                                        No hay cursos aún.
                                    </td>
                                </tr>
                            )}
                            {cursos.map((c) => {
                                const tieneDescuento = c.precio_promocional && c.descuento_desde && c.descuento_hasta
                                return (
                                    <tr key={c.id_curso} className="border-t border-slate-100 hover:bg-slate-50/60">
                                        <td className="px-4 py-3">
                                            <div className="font-semibold text-slate-900">{c.titulo}</div>
                                            <div className="text-xs text-slate-500">
                                                {c.categoria ?? 'Sin categoría'} · {c.idioma ?? 'Sin idioma'}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 capitalize text-slate-700">{c.nivel}</td>
                                        <td className="px-4 py-3">
                                            <div className="text-slate-900 font-medium">
                                                ${Number(c.precio).toLocaleString('es-CO')}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`
                          inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold
                          ${c.estado === 'publicado'
                                                        ? 'bg-ucp-verde/10 text-ucp-verde'
                                                        : c.estado === 'programado'
                                                            ? 'bg-ucp-amarillo/10 text-amber-700'
                                                            : c.estado === 'inactivo'
                                                                ? 'bg-slate-200 text-slate-600'
                                                                : 'bg-slate-100 text-slate-700'
                                                    }
                        `}
                                            >
                                                {c.estado}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            {tieneDescuento ? (
                                                <div className="text-xs text-ucp-verde font-medium">
                                                    ${Number(c.precio_promocional).toLocaleString('es-CO')}
                                                    <div className="text-[10px] text-slate-500">
                                                        {new Date(c.descuento_desde!).toLocaleDateString()} –{' '}
                                                        {new Date(c.descuento_hasta!).toLocaleDateString()}
                                                    </div>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-400">Sin descuento</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-right space-x-1">

                                            
                                                <Link
                                                    to={`/cursos/${c.id_curso}/contenido`}
                                                    className="inline-flex px-2.5 py-1 rounded-md text-xs bg-slate-100 text-slate-800 hover:bg-slate-200"
                                                >
                                                    Contenido
                                                </Link>


                                                <button
                                                    onClick={() => abrirEditar(c)}
                                                    className="inline-flex px-2.5 py-1 rounded-md text-xs bg-slate-100 text-slate-800 hover:bg-slate-200"
                                                >
                                                    Editar
                                                </button>
                                                <button
                                                    onClick={() => onDuplicar(c.id_curso)}
                                                    className="inline-flex px-2.5 py-1 rounded-md text-xs bg-slate-100 text-slate-800 hover:bg-slate-200"
                                                >
                                                    Duplicar
                                                </button>
                                                <button
                                                    onClick={() => onPublicarAhora(c.id_curso)}
                                                    className="inline-flex px-2.5 py-1 rounded-md text-xs bg-ucp-verde text-white hover:bg-ucp-verdeOscuro"
                                                >
                                                    Publicar
                                                </button>
                                                <button
                                                    onClick={() => onProgramarPublicacion(c.id_curso)}
                                                    className="inline-flex px-2.5 py-1 rounded-md text-xs bg-indigo-600 text-white hover:bg-indigo-700"
                                                >
                                                    Prog. pub
                                                </button>
                                                <button
                                                    onClick={() => onProgramarDescuento(c.id_curso)}
                                                    className="inline-flex px-2.5 py-1 rounded-md text-xs bg-ucp-amarillo text-slate-900 hover:bg-amber-400"
                                                >
                                                    Desc.
                                                </button>
                                                {tieneDescuento && (
                                                    <button
                                                        onClick={() => onCancelarDescuento(c.id_curso)}
                                                        className="inline-flex px-2.5 py-1 rounded-md text-xs bg-red-100 text-red-700 hover:bg-red-200"
                                                    >
                                                        Quitar desc.
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => onEliminar(c.id_curso)}
                                                    className="inline-flex px-2.5 py-1 rounded-md text-xs bg-red-600 text-white hover:bg-red-700"
                                                >
                                                    Eliminar
                                                </button>
                                            </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Paginación */}
                <div className="mt-4 flex justify-between items-center text-xs text-slate-600">
                    <div>
                        Página {pagina} de {totalPaginas} — Total {total}
                    </div>
                    <div className="space-x-2">
                        <button
                            disabled={pagina <= 1}
                            onClick={() => setPagina((p) => Math.max(1, p - 1))}
                            className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700 
                         disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                        >
                            Anterior
                        </button>
                        <button
                            disabled={pagina >= totalPaginas}
                            onClick={() => setPagina((p) => Math.min(totalPaginas, p + 1))}
                            className="px-3 py-1.5 rounded-md border border-slate-300 bg-white text-slate-700
                         disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
                        >
                            Siguiente
                        </button>
                    </div>
                </div>

                {/* Modal */}
                {formOpen && (
                    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6">
                            <h2 className="text-lg font-semibold mb-4 text-slate-900">
                                {form.id_curso ? 'Editar curso' : 'Nuevo curso'}
                            </h2>
                            <form onSubmit={guardarCurso} className="space-y-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Título
                                    </label>
                                    <input
                                        type="text"
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ucp-verde/60"
                                        value={form.titulo}
                                        onChange={(e) => setForm((f) => ({ ...f, titulo: e.target.value }))}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                                        Descripción
                                    </label>
                                    <textarea
                                        className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ucp-verde/60"
                                        rows={3}
                                        value={form.descripcion}
                                        onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                                    />
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Categoría
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ucp-verde/60"
                                            value={form.categoria}
                                            onChange={(e) => setForm((f) => ({ ...f, categoria: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Idioma
                                        </label>
                                        <input
                                            type="text"
                                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ucp-verde/60"
                                            value={form.idioma}
                                            onChange={(e) => setForm((f) => ({ ...f, idioma: e.target.value }))}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Nivel
                                        </label>
                                        <select
                                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ucp-verde/60"
                                            value={form.nivel}
                                            onChange={(e) =>
                                                setForm((f) => ({ ...f, nivel: e.target.value as Nivel }))
                                            }
                                        >
                                            {NIVEL_OPTIONS.map((n) => (
                                                <option key={n} value={n}>
                                                    {n}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-xs font-semibold text-slate-700 mb-1">
                                            Precio (COP)
                                        </label>
                                        <input
                                            type="number"
                                            min={0}
                                            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ucp-verde/60"
                                            value={form.precio}
                                            onChange={(e) => setForm((f) => ({ ...f, precio: e.target.value }))}
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-2 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setFormOpen(false)}
                                        className="px-4 py-2 text-sm rounded-md border border-slate-300 text-slate-700 hover:bg-slate-50"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 text-sm rounded-md bg-ucp-verde text-white font-semibold hover:bg-ucp-verdeOscuro"
                                    >
                                        Guardar
                                    </button>


                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )

}
