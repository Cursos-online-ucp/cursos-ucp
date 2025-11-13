// src/models/Mensaje.ts
import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface MensajeAttributes {
  id_mensaje: number;
  id_chat: number;
  id_usuario: number; // Remitente
  contenido: string;
  tipo_mensaje: string; // enum('texto','archivo','imagen','sistema') en SQL
  fecha_envio: Date;
}

interface MensajeCreationAttributes
  extends Optional<MensajeAttributes, "id_mensaje" | "fecha_envio"> {}

export class Mensaje
  extends Model<MensajeAttributes, MensajeCreationAttributes>
  implements MensajeAttributes
{
  public id_mensaje!: number;
  public id_chat!: number;
  public id_usuario!: number;
  public contenido!: string;
  public tipo_mensaje!: string;
  public fecha_envio!: Date;

  static associate(models: any): void {
    this.belongsTo(models.Chat, { foreignKey: "id_chat" }); 
    this.belongsTo(models.Usuario, { foreignKey: "id_usuario" }); 
  }

  static initModel(sequelize: Sequelize): typeof Mensaje {
    Mensaje.init(
      {
        id_mensaje: {
          type: DataTypes.BIGINT.UNSIGNED, // ✅ PK BIGINT(20)
          autoIncrement: true,
          primaryKey: true,
        },
        id_chat: {
          type: DataTypes.BIGINT.UNSIGNED, // ✅ FK BIGINT(20)
          allowNull: false,
        },
        id_usuario: {
          type: DataTypes.BIGINT.UNSIGNED, // ✅ FK BIGINT(20)
          allowNull: false,
        },
        contenido: {
          type: DataTypes.TEXT,
          allowNull: true,
        },
        tipo_mensaje: {
          type: DataTypes.ENUM('texto', 'archivo', 'imagen', 'sistema'), // Usamos el ENUM de tu SQL
          allowNull: false,
          defaultValue: "texto",
        },
        fecha_envio: {
          type: DataTypes.DATE,
          allowNull: false,
          defaultValue: DataTypes.NOW,
        },
        // Se ignoran remitente_id, respuesta_a, estado_entrega y metadata para simplificar
      },
      {
        sequelize,
        tableName: "mensaje",
        timestamps: false,
        modelName: "Mensaje",
      }
    );

    return Mensaje;
  }
}

export default (sequelize: Sequelize): typeof Mensaje => Mensaje.initModel(sequelize);