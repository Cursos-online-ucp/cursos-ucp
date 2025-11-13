// src/models/ParticipanteChat.ts

import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface ParticipanteChatAttributes {
  id_participantechat: number; // PK de la tabla
  id_chat: number; // FK BIGINT
  id_usuario: number; // FK BIGINT
}

interface ParticipanteChatCreationAttributes
  extends Optional<ParticipanteChatAttributes, "id_participantechat"> {}

export class ParticipanteChat
  extends Model<ParticipanteChatAttributes, ParticipanteChatCreationAttributes>
  implements ParticipanteChatAttributes
{
  public id_participantechat!: number;
  public id_chat!: number;
  public id_usuario!: number;
  // Se omiten fecha_union y rol_miembro para simplificar el modelo base

  static associate(models: any): void {
    // La asociación Many-to-Many se define en Chat y Usuario
  }

  static initModel(sequelize: Sequelize): typeof ParticipanteChat {
    ParticipanteChat.init(
      {
        id_participantechat: {
          type: DataTypes.BIGINT.UNSIGNED, // ✅ PK BIGINT(20)
          autoIncrement: true,
          primaryKey: true,
        },
        id_chat: {
          type: DataTypes.BIGINT.UNSIGNED, // ✅ FK BIGINT(20)
          allowNull: false,
          unique: 'uk_chat_usuario', // Clave compuesta de unicidad
        },
        id_usuario: {
          type: DataTypes.BIGINT.UNSIGNED, // ✅ FK BIGINT(20)
          allowNull: false,
          unique: 'uk_chat_usuario', // Clave compuesta de unicidad
        },
      },
      {
        sequelize,
        tableName: "participantechat",
        timestamps: false,
        modelName: "ParticipanteChat",
      }
    );

    return ParticipanteChat;
  }
}

export default (sequelize: Sequelize): typeof ParticipanteChat => ParticipanteChat.initModel(sequelize);