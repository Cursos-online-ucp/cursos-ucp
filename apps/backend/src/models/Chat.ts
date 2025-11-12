import { DataTypes, Model, Sequelize, Optional } from "sequelize";

interface ChatAttributes {
  id_chat: number;
  tipo_chat: "privado" | "grupo";
  titulo?: string | null;
  creado_por?: number | null;
  es_publico?: boolean;
  fecha_creacion?: Date;
  fecha_actualizacion?: Date | null;
}

interface ChatCreationAttributes extends Optional<ChatAttributes, "id_chat"> {}

export default class Chat
  extends Model<ChatAttributes, ChatCreationAttributes>
  implements ChatAttributes
{
  public id_chat!: number;
  public tipo_chat!: "privado" | "grupo";
  public titulo?: string | null;
  public creado_por?: number | null;
  public es_publico?: boolean;
  public fecha_creacion?: Date;
  public fecha_actualizacion?: Date | null;

  static initModel(sequelize: Sequelize): void {
    Chat.init(
      {
        id_chat: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        tipo_chat: {
          type: DataTypes.ENUM("privado", "grupo"),
          allowNull: false,
          defaultValue: "privado",
        },
        titulo: { type: DataTypes.STRING(200), allowNull: true },
        creado_por: { type: DataTypes.BIGINT, allowNull: true },
        es_publico: { type: DataTypes.BOOLEAN, defaultValue: false },
        fecha_creacion: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        fecha_actualizacion: { type: DataTypes.DATE, allowNull: true },
      },
      {
        sequelize,
        tableName: "chat",
        timestamps: false,
      }
    );
  }
}
