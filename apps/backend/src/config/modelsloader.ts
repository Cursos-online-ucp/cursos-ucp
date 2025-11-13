// src/config/modelsloader.ts

import { Sequelize } from 'sequelize';
import sequelize from './dbInstance';

// 1. Importar Modelos
import { default as initUsuario } from '../models/Usuario';
import { default as initChat } from '../models/Chats';
import { default as initMensaje } from '../models/Mensaje';
import { default as initParticipanteChat } from '../models/ParticipanteChat';

// 2. Inicializar Modelos
const Usuario = initUsuario(sequelize);
const Chat = initChat(sequelize);
const Mensaje = initMensaje(sequelize);
const ParticipanteChat = initParticipanteChat(sequelize);

// 3. Crear el objeto db con todos los modelos
const db: any = {
  sequelize,
  Usuario,
  Chat,
  Mensaje,
  ParticipanteChat,
};

// 4. Ejecutar Asociaciones
Object.values(db).forEach(model => {
  if (typeof (model as any).associate === 'function') {
    (model as any).associate(db);
  }
});

export default db;