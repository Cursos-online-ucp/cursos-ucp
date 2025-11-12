import { DataTypes, Model, Sequelize, Optional } from "sequelize";

interface ParticipanteChatAttributes {
  id_participantechat: number;
  id_chat: number;
  id_usuario: number;
  fecha_union?: Date;
  rol_miembro?: string | null;
}

interface ParticipanteChatCreationAttributes
  extends Optional<ParticipanteChatAttributes, "id_participantechat"> {}

export default class ParticipanteChat
  extends Model<ParticipanteChatAttributes, ParticipanteChatCreationAttributes>
  implements ParticipanteChatAttributes
{
  public id_participantechat!: number;
  public id_chat!: number;
  public id_usuario!: number;
  public fecha_union?: Date;
  public rol_miembro?: string | null;

  static initModel(sequelize: Sequelize): void {
    ParticipanteChat.init(
      {
        id_participantechat: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
        id_chat: { type: DataTypes.BIGINT, allowNull: false },
        id_usuario: { type: DataTypes.BIGINT, allowNull: false },
        fecha_union: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
        rol_miembro: { type: DataTypes.STRING(50), allowNull: true },
      },
      {
        sequelize,
        tableName: "participantechat",
        timestamps: false,
      }
    );
  }
}
