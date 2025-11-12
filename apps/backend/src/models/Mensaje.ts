import { DataTypes, Model, Sequelize, Optional } from "sequelize";

interface MensajeAttributes {
  id_mensaje: number;
  id_chat: number;
  id_usuario?: number | null;
  tipo_mensaje: "texto" | "archivo" | "imagen" | "sistema";
  remitente_id?: number | null;
  respuesta_a?: number | null;
  contenido?: string | null;
  estado_entrega?: "enviado" | "entregado" | "leido";
  metadata?: object | null;
  fecha_envio?: Date;
  fecha_actualizacion?: Date | null;
}

interface MensajeCreationAttributes extends Optional<MensajeAttributes, "id_mensaje"> {}

export default class Mensaje
  extends Model<MensajeAttributes, MensajeCreationAttributes>
  implements MensajeAttributes
{
  public id_mensaje!: number;
  public id_chat!: number;
  public id_usuario?: number | null;
  public tipo_mensaje!: "texto" | "archivo" | "imagen" | "sistema";
  public remitente_id?: number | null;
  public respuesta_a?: number | null;
  public contenido?: string | null;
  public estado_entrega?: "enviado" | "entregado" | "leido";
  public metadata?: object | null;
  public fecha_envio?: Date;
  public fecha_actualizacion?: Date | null;

  static initModel(sequelize: Sequelize): void {
    Mensaje.init(
      {
        id_mensaje: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        id_chat: { type: DataTypes.BIGINT, allowNull: false },
        id_usuario: { type: DataTypes.BIGINT, allowNull: true },
        tipo_mensaje: {
          type: DataTypes.ENUM("texto", "archivo", "imagen", "sistema"),
          defaultValue: "texto",
        },
        remitente_id: { type: DataTypes.BIGINT, allowNull: true },
        respuesta_a: { type: DataTypes.BIGINT, allowNull: true },
        contenido: { type: DataTypes.TEXT, allowNull: true },
        estado_entrega: {
          type: DataTypes.ENUM("enviado", "entregado", "leido"),
          defaultValue: "enviado",
        },
        metadata: { type: DataTypes.JSON, allowNull: true },
        fecha_envio: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        fecha_actualizacion: { type: DataTypes.DATE, allowNull: true },
      },
      {
        sequelize,
        tableName: "mensaje",
        timestamps: false,
      }
    );
  }
}
