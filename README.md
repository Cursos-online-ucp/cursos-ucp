👥 GUÍA RÁPIDA PARA COLABORADORES – PROYECTO PLATAFORMA DE CURSOS VIRTUALES

Proyecto grupal de INGENIERÍA DEL SOFTWARE I – Universidad Católica de Pereira
Docente: Daniel E. Rodríguez Franco

───────────────────────────────────────────────
🧠 OBJETIVO DEL PROYECTO
Desarrollar una plataforma web tipo Udemy o Coursera enfocada en cursos de oficios, donde:
- Productores publican cursos.
- Estudiantes se inscriben, pagan y aprenden.
- Administradores gestionan usuarios y reportes.

───────────────────────────────────────────────
🚀 TECNOLOGÍAS UTILIZADAS
Frontend: React + Vite + TypeScript + tailwind
Backend: Node.js + Express + Sequelize
Base de datos: MySQL (local o Docker)
Repositorio: GitHub – Organización Cursos-online-ucp

───────────────────────────────────────────────
🪜 PRIMEROS PASOS

1️⃣ Instalar herramientas
Verificar que tengas instalados:
    git --version
    node -v

2️⃣ Clonar el proyecto
    git clone https://github.com/Cursos-online-ucp/cursos-ucp.git
    cd cursos-ucp
    npm install

───────────────────────────────────────────────
💻 CÓMO TRABAJAR EN GRUPO

Crear tu rama de trabajo:
    git checkout -b feature/<modulo>

Ejemplo:
    git checkout -b feature/cursos

Subir tus avances:
    git add .
    git commit -m "feat(cursos): creación de modelo de cursos"
    git push -u origin feature/cursos

Hacer Pull Request:
1. Entra a GitHub → pestaña "Pull Requests"
2. Clic "New Pull Request"
3. Base: develop | Compare: feature/<modulo>
4. Escribe una descripción y solicita revisión

───────────────────────────────────────────────
🧩 EQUIPOS Y MÓDULOS

Módulo          | Rama sugerida       | Ejemplo de tarea
----------------|---------------------|-----------------------------
Autenticación   | feature/auth        | Registro y login
Cursos          | feature/cursos      | CRUD de cursos
Pagos           | feature/pagos       | Integración con Stripe / PayU
Estudiantes     | feature/estudiantes | Progreso y certificados
Dashboard       | feature/reportes    | Reportes y métricas
Chat/Soporte    | feature/chat        | Mensajería y foros
UX / QA         | feature/ux          | Diseño y pruebas

───────────────────────────────────────────────
🔄 ACTUALIZAR TU RAMA

Mantén tu rama al día con los cambios de los demás:
    git checkout develop
    git pull
    git checkout feature/<modulo>
    git merge develop
    git push

───────────────────────────────────────────────
⚠️ BUENAS PRÁCTICAS

- No subir node_modules/ ni .env
- Mensajes de commit claros:
      fix(auth): error en login
      feat(cursos): nuevo formulario
- No hacer merge directo a main
- Coordinar cambios grandes con el líder técnico

───────────────────────────────────────────────
🧱 COMANDOS RÁPIDOS

Iniciar backend:
    cd apps/backend
    cp .env.example .env
    npm run dev

Iniciar frontend:
    cd apps/frontend
    npm run dev

Iniciar base de datos (Docker):
    cd infra
    docker compose up -d

───────────────────────────────────────────────
📋 FLUJO GENERAL DE TRABAJO

1. Crear rama → feature/<modulo>
2. Desarrollar código
3. Commit + Push
4. Crear Pull Request hacia develop
5. Esperar revisión y aprobación
6. Merge solo con código estable

───────────────────────────────────────────────
🧩 CONTACTO TÉCNICO
Carlos Uchima – Coordinador de integración
Repositorio: https://github.com/Cursos-online-ucp
───────────────────────────────────────────────
