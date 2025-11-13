import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CursosPage from './pages/CursosPage'
import CursoBuilderPage from './pages/CursoBuilderPage' // la página de módulos+lecciones

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* redirigir raíz a /cursos */}
        <Route path="/" element={<Navigate to="/cursos" replace />} />

        {/* listado de cursos del productor */}
        <Route path="/cursos" element={<CursosPage />} />

        {/* constructor de contenido (módulos + lecciones) */}
        <Route path="/cursos/:id/contenido" element={<CursoBuilderPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App

