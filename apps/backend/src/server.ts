// src/server.ts
import express, { Request, Response } from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import bcrypt from "bcryptjs";
import { Op } from "sequelize";
import sequelize from "./config/dbInstance";
import db from "./config/modelsloader"; // Carga todos los modelos y relaciones

// --- Inicialización y Configuración ---
const app = express();
// Usamos el puerto 4001, o el que esté definido en .env
const PORT = process.env.PORT || 4001; 
const httpServer = createServer(app);
const database: any = db; // Acceso a los modelos

const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});

app.use(express.json());
console.log("DB keys:", Object.keys(database || {}));

// --- Middleware de Autenticación (Mock) ---
const auth = (req: Request, res: Response, next: Function) => {
  // Simulación: permite el paso a todas las rutas.
  next(); 
};

// --- RUTAS DE CHAT (API REST) ---

/**
 * RUTA: POST /api/chat/create-or-get
 * Propósito: Busca o crea un chat privado entre dos usuarios.
 * REQUERIDO: userIds (Array de dos BIGINTs)
 */
app.post("/api/chat/create-or-get", auth, async (req: Request, res: Response) => {
  const { userIds } = req.body;
  if (!Array.isArray(userIds) || userIds.length !== 2) return res.status(400).json({ error: "Se requieren exactamente 2 userIds (BIGINT)." });

  // Ordenar IDs para estandarizar la búsqueda
  const [userId1, userId2] = userIds.sort((a: number, b: number) => a - b);

  try {
    // 1. Buscar chats del Usuario 1 y ver si el Usuario 2 también participa
    const chatsUser1 = await database.ParticipanteChat.findAll({
      where: { id_usuario: userId1 },
      attributes: ["id_chat"],
    });
    const chatIdsUser1 = chatsUser1.map((uc: any) => uc.id_chat);

    const participanteExistente = await database.ParticipanteChat.findOne({
      where: { 
        id_usuario: userId2, 
        id_chat: { [Op.in]: chatIdsUser1 } 
      },
      include: [{ 
        model: database.Chat, 
        where: { tipo_chat: 'privado' } 
      }]
    });

    if (participanteExistente) {
      return res.json({ id_chat: participanteExistente.id_chat, nuevo: false });
    }

    // 3. Si no existe, crear un nuevo chat privado
    const nuevoChat = await database.Chat.create({ 
      tipo_chat: "privado", 
      titulo: null, 
      creado_por: userId1 
    });

    // 4. Agregar a ambos usuarios a la tabla ParticipanteChat
    await database.ParticipanteChat.bulkCreate([
      { id_chat: nuevoChat.id_chat, id_usuario: userId1 },
      { id_chat: nuevoChat.id_chat, id_usuario: userId2 },
    ]);

    return res.status(201).json({ id_chat: nuevoChat.id_chat, nuevo: true, mensaje: "Chat privado creado." });
  } catch (err) {
    console.error("❌ Error create-or-get chat:", err);
    return res.status(500).json({ error: "Fallo al procesar chat." });
  }
});

// --- LÓGICA DE SOCKET.IO ---
io.on("connection", (socket: Socket) => {
  console.log(`[Socket] Cliente conectado: ${socket.id}`);

  /**    
   * Evento: 'join_chat' (Frontend -> Backend)
   */
  socket.on("join_chat", async (id_chat: number) => {
    try {
      const room = id_chat.toString();
      socket.join(room);
      console.log(`Usuario ${socket.id} se unió a la sala: ${room}`);

      // Cargar historial de mensajes con el nombre del remitente
      const mensajes: any[] = await database.Mensaje.findAll({
        where: { id_chat },
        order: [["fecha_envio", "ASC"]],
        include: [{ model: database.Usuario, attributes: ["id_usuario", "nombres", "apellidos", "email"] }],
        limit: 50,
      });

      socket.emit("chat_history", mensajes.map((m: any) => m.toJSON()));
    } catch (err) {
      console.error("❌ Error join_chat:", err);
      socket.emit("chat_error", "No se pudo cargar historial.");
    }
  });

  /**
   * Evento: 'send_message' (Frontend -> Backend)
   */
  socket.on("send_message", async (data: any) => {
    const { id_chat, id_usuario, contenido } = data;
    try {
      const nuevoMensaje = await database.Mensaje.create({
        id_chat,
        id_usuario,
        contenido,
        tipo_mensaje: "texto",
        fecha_envio: new Date(),
      });
      
      // Obtener el objeto completo (incluyendo el Usuario asociado) para emitir
      const mensajeCompleto = await database.Mensaje.findByPk(nuevoMensaje.id_mensaje, {
        include: [{ model: database.Usuario, attributes: ["id_usuario", "nombres", "apellidos", "email"] }]
      });

      // Emitir a todos los clientes en la sala del chat (Backend -> Frontend)
      io.to(id_chat.toString()).emit("receive_message", mensajeCompleto.toJSON());
    } catch (err) {
      console.error("❌ Error send_message:", err);
      socket.emit("message_error", "Fallo al enviar mensaje.");
    }
  });

  socket.on("disconnect", () => console.log(`[Socket] Cliente desconectado: ${socket.id}`));
});

// --- RUTA DE REGISTRO (Mínima, SOLO para crear usuarios de prueba) ---
app.post("/api/auth/register", async (req: Request, res: Response) => {
  const { nombres, apellidos, email, password } = req.body;
  if (!nombres || !email || !password) return res.status(400).json({ error: "Faltan campos." });

  try {
    const existingUser = await database.Usuario.findOne({ where: { email } });
    if (existingUser) return res.status(409).json({ error: "Email ya registrado." });

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    await database.Usuario.create({ 
      nombres, 
      apellidos: apellidos || '', 
      email, 
      password: password_hash, 
      id_rol: 1, 
      estado: "activo" 
    });
    return res.status(201).json({ mensaje: "Usuario creado." });
  } catch (err) {
    console.error("❌ Error al registrar:", err);
    return res.status(500).json({ error: "Fallo interno." });
  }
});

// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor Backend del Chat Funcionando!');
});


// --- Conexión a DB y Sincronización (Parte CRÍTICA) ---
async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("DB ok");
    
    // PASO CRÍTICO: Desactiva la verificación de FKs.
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0", { raw: true }); 
    
    // Sincronización explícita: (DROP IF EXISTS + CREATE TABLE)
    // Esto fuerza a recrear estas 4 tablas con el tipo BIGINT.UNSIGNED.
    await database.Usuario.sync({ force: true }); 
    await database.Chat.sync({ force: true });
    await database.Mensaje.sync({ force: true });
    await database.ParticipanteChat.sync({ force: true });
    
    // Reactiva la verificación de FKs
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 1", { raw: true });

    console.log("✅ Tablas de CHAT sincronizadas (FORZADO - Uso solo en desarrollo)");

    if (!httpServer.listening) {
      httpServer.listen(PORT, () => console.log(`🚀 Server on ${PORT}`));
    }
  } catch (err: any) {
    console.error("❌ connectDB error:", err.name, err.message);
    console.error("❌ Error SQL:", err.original?.sqlMessage || err.sqlMessage);
    process.exit(1);
  }
}

connectDB();

export { io };
export default httpServer;