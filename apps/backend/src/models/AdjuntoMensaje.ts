import { DataTypes, Model, Sequelize, Optional } from "sequelize";

interface AdjuntoMensajeAttributes {
  id_adjunto: number;
  id_mensaje: number;
  nombre_archivo?: string | null;
  url_archivo: string;
  tipo_contenido?: string | null;
  peso_bytes?: number | null;
  fecha_subida?: Date;
}

interface AdjuntoMensajeCreationAttributes extends Optional<AdjuntoMensajeAttributes, "id_adjunto"> {}

export default class AdjuntoMensaje
  extends Model<AdjuntoMensajeAttributes, AdjuntoMensajeCreationAttributes>
  implements AdjuntoMensajeAttributes
{
  public id_adjunto!: number;
  public id_mensaje!: number;
  public nombre_archivo?: string | null;
  public url_archivo!: string;
  public tipo_contenido?: string | null;
  public peso_bytes?: number | null;
  public fecha_subida?: Date;

  static initModel(sequelize: Sequelize): void {
    AdjuntoMensaje.init(
      {
        id_adjunto: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        id_mensaje: { type: DataTypes.BIGINT, allowNull: false },
        nombre_archivo: { type: DataTypes.STRING(255), allowNull: true },
        url_archivo: { type: DataTypes.STRING(512), allowNull: false },
        tipo_contenido: { type: DataTypes.STRING(100), allowNull: true },
        peso_bytes: { type: DataTypes.BIGINT, allowNull: true },
        fecha_subida: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
      },
      {
        sequelize,
        tableName: "adjunto_mensaje",
        timestamps: false,
      }
    );
  }
}
