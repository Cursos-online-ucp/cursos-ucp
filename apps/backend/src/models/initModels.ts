import { Sequelize } from "sequelize";
import Usuario from "./Usuario";
import Chat from "./chat";
import ParticipanteChat from "./ParticipanteChat";
import Mensaje from "./Mensaje";
import AdjuntoMensaje from "./AdjuntoMensaje";
import EstadoMensaje from "./EstadoMensaje";

export const initModels = (sequelize: Sequelize) => {
    Usuario.initModel(sequelize);
    Chat.initModel(sequelize);
    ParticipanteChat.initModel(sequelize);
    Mensaje.initModel(sequelize);
    AdjuntoMensaje.initModel(sequelize);
    EstadoMensaje.initModel(sequelize);

    Chat.belongsTo(Usuario, { foreignKey: "creado_por", as: "creador" });
    Chat.hasMany(ParticipanteChat, {foreignKey: "id_chat", as: "participantes" });
    Chat.hasMany(Mensaje, {foreignKey: "id_chat", as: "mensajes" });

    ParticipanteChat.belongsTo(Chat, { foreignKey: "id_chat", as: "chat" });
    ParticipanteChat.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });

    Mensaje.belongsTo(Chat, { foreignKey: "id_chat", as: "chat" });
    Mensaje.belongsTo(Usuario, { foreignKey: "id_usuario", as: "usuario" });
    Mensaje.hasMany(AdjuntoMensaje, { foreignKey: "id_mensaje", as: "adjuntos" });
    Mensaje.hasMany(EstadoMensaje, { foreignKey: "id_mensaje", as: "estados" });
};