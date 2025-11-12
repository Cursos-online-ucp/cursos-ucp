# Módulo de Chat — API Endpoints

Proyecto: Cursos Online UCP  
Equipo: Grupo 3 — Módulo de Chat  
Tecnologías: Node.js + Express + TypeScript + Sequelize + MySQL  
Ubicación: apps/backend

---

## 1. Configuración del entorno

Antes de probar los endpoints, asegúrate de tener tu archivo `.env` configurado correctamente:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=cursosDB
PORT=4000
```

Ejecuta el backend desde la carpeta `apps/backend`:

```bash
npm install
npm run dev
```

Si todo está correcto deberías ver en consola:

```
Conexión con la base de datos exitosa.
REST API funcionando en el puerto 4000
```

---

## 2. Endpoints del Módulo Chat

### Tabla resumen

| Método | Endpoint | Descripción | Ejemplo |
|--------|-----------|-------------|----------|
| `GET` | `/api/chat/usuario/:idUsuario` | Lista todos los chats donde participa un usuario | `/api/chat/usuario/1` |
| `GET` | `/api/chat/:idChat/mensajes` | Devuelve los mensajes de un chat específico | `/api/chat/1/mensajes` |
| `POST` | `/api/chat/mensaje` | Envía un nuevo mensaje | `/api/chat/mensaje` |
| `PUT` | `/api/chat/mensaje/:idMensaje/leido` | Marca un mensaje como leído | `/api/chat/mensaje/3/leido` |

---

## 3. Ejemplos de pruebas (Postman / Thunder Client)

### Obtener todos los chats de un usuario

**Método:** `GET`  
**URL:** `http://localhost:4000/api/chat/usuario/1`

**Respuesta esperada:**
```json
[
  {
    "id_chat": 1,
    "tipo_chat": "grupo",
    "titulo": "Chat de Introducción a Node.js",
    "es_publico": false,
    "fecha_creacion": "2025-11-12T10:00:00.000Z"
  }
]
```

### Obtener mensajes de un chat

**Método:** `GET`  
**URL:** `http://localhost:4000/api/chat/1/mensajes`

**Respuesta esperada:**
```json
[
  {
    "id_mensaje": 1,
    "contenido": "Hola equipo",
    "id_usuario": 2,
    "fecha_envio": "2025-11-12T11:32:00.000Z",
    "estado_entrega": "enviado"
  }
]
```

### Enviar un nuevo mensaje

**Método:** `POST`  
**URL:** `http://localhost:4000/api/chat/mensaje`

**Body (JSON):**
```json
{
  "id_chat": 1,
  "id_usuario": 2,
  "contenido": "Mensaje de prueba",
  "tipo_mensaje": "texto"
}
```

**Respuesta esperada:**
```json
{
  "message": "Mensaje enviado correctamente",
  "data": {
    "id_mensaje": 25,
    "id_chat": 1,
    "id_usuario": 2,
    "contenido": "Mensaje de prueba",
    "tipo_mensaje": "texto",
    "fecha_envio": "2025-11-12T13:45:00.000Z"
  }
}
```

### Marcar un mensaje como leído

**Método:** `PUT`  
**URL:** `http://localhost:4000/api/chat/mensaje/3/leido`

**Respuesta esperada:**
```json
{
  "message": "Mensaje marcado como leído",
  "id_mensaje": 3,
  "estado": "leido"
}
```

---

## 4. Qué validar en las pruebas

| Prueba | Validación esperada |
|--------|----------------------|
| Conexión a BD | Sequelize debe mostrar “Conexión exitosa” |
| GET Chats | Retorna los chats donde participa el usuario |
| GET Mensajes | Devuelve todos los mensajes de un chat |
| POST Mensaje | Inserta correctamente en la tabla `mensaje` |
| PUT Leído | Actualiza `estado_mensaje` a “leido” |
| Errores 500 | No deben ocurrir si los modelos están bien configurados |

---

## 5. Herramientas recomendadas

- Postman o Thunder Client  
- TablePlus o MySQL Workbench para validar inserciones  
- `ts-node-dev` para reinicio automático:

```bash
npm install --save-dev ts-node-dev
```

En `package.json`:

```json
"scripts": {
  "dev": "ts-node-dev --respawn src/index.ts"
}
```

---

## 6. Buenas prácticas durante desarrollo

- No usar `sequelize.sync({ force: true })` (borrará datos reales).  
- Verificar las claves foráneas antes de hacer inserts manuales.  
- Probar primero los `GET` antes de los `POST`.  
- Documentar cada cambio de endpoint en este archivo.  

---

## 7. Resultado esperado final

Al completar las pruebas:
- Todos los endpoints deben responder con código `200`.
- Los datos deben reflejarse en las tablas `chat`, `mensaje`, `estado_mensaje`.
- El servidor debe mostrar:

```
Conexión con la base de datos exitosa.
REST API funcionando en el puerto 4000
```

El módulo de Chat estará listo para integrarse al frontend (React + Tailwind + TypeScript).

---

Desarrolladores:
- Base de Datos: Jhon Anderson Montoya  
- Backend: Juan David “El Bro”  
- Frontend: Juan Pablo Jimenez
