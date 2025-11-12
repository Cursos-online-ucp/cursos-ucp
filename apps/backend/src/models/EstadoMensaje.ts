import { DataTypes, Model, Sequelize, Optional } from "sequelize";

interface EstadoMensajeAttributes {
  id_estado: number;
  id_mensaje: number;
  id_usuario: number;
  estado: "enviado" | "entregado" | "leido";
  fecha_estado?: Date;
}

interface EstadoMensajeCreationAttributes extends Optional<EstadoMensajeAttributes, "id_estado"> {}

export default class EstadoMensaje
  extends Model<EstadoMensajeAttributes, EstadoMensajeCreationAttributes>
  implements EstadoMensajeAttributes
{
  public id_estado!: number;
  public id_mensaje!: number;
  public id_usuario!: number;
  public estado!: "enviado" | "entregado" | "leido";
  public fecha_estado?: Date;

  static initModel(sequelize: Sequelize): void {
    EstadoMensaje.init(
      {
        id_estado: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        id_mensaje: { type: DataTypes.BIGINT, allowNull: false },
        id_usuario: { type: DataTypes.BIGINT, allowNull: false },
        estado: {
          type: DataTypes.ENUM("enviado", "entregado", "leido"),
          defaultValue: "enviado",
        },
        fecha_estado: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      },
      {
        sequelize,
        tableName: "estado_mensaje",
        timestamps: false,
      }
    );
  }
}
