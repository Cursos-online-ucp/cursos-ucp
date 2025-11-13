// src/models/Chat.ts
import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface ChatAttributes {
  id_chat: number;
  tipo_chat: 'privado' | 'grupo';
  titulo: string | null;
  creado_por: number | null; // FK BIGINT
}

interface ChatCreationAttributes extends Optional<ChatAttributes, "id_chat"> {}

export class Chat
  extends Model<ChatAttributes, ChatCreationAttributes>
  implements ChatAttributes
{
  public id_chat!: number;
  public tipo_chat!: 'privado' | 'grupo';
  public titulo!: string | null;
  public creado_por!: number | null;

  static associate(models: any): void {
    this.belongsToMany(models.Usuario, { through: models.ParticipanteChat, foreignKey: "id_chat", otherKey: "id_usuario" });
    this.hasMany(models.Mensaje, { foreignKey: "id_chat" });
    this.belongsTo(models.Usuario, { foreignKey: "creado_por", as: 'Creador' });
  }

  static initModel(sequelize: Sequelize): typeof Chat {
    Chat.init(
      {
        id_chat: {
          type: DataTypes.BIGINT.UNSIGNED, // ✅ PK BIGINT(20)
          autoIncrement: true,
          primaryKey: true,
        },
        tipo_chat: {
          type: DataTypes.ENUM('privado', 'grupo'),
          defaultValue: 'privado',
          allowNull: false,
        },
        titulo: {
          type: DataTypes.STRING(200),
          allowNull: true,
        },
        creado_por: {
          type: DataTypes.BIGINT.UNSIGNED, // ✅ FK BIGINT(20)
          allowNull: true,
        },
        // Se omiten es_publico, fecha_creacion y fecha_actualizacion para simplificar
      },
      {
        sequelize,
        tableName: "chat",
        timestamps: false,
        modelName: "Chat",
      }
    );
    return Chat;
  }
}

export default (sequelize: Sequelize): typeof Chat => Chat.initModel(sequelize);