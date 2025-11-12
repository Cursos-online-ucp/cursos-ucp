import { DataTypes, Model, Sequelize } from "sequelize";

export default class Usuario extends Model {
    public id_usuario!: number;
    public nombres!: string;
    public apellidos!: string;
    public email!: string;
    public password!: string;
    public fecha_creacion!: Date;

    static initModel(sequelize: Sequelize): void {
        Usuario.init(
            {
                id_usuario: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true  },
                nombres: { type: DataTypes.STRING(150), allowNull: false },
                apellidos: { type: DataTypes.STRING(150), allowNull: false },
                email: { type: DataTypes.STRING(255), allowNull: false, unique: true },
                password: { type: DataTypes.STRING(255), allowNull: false },
                fecha_creacion: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW },
            },
            {
                sequelize,
                tableName: "usuario",
                timestamps: false,
            }
        );
    }
}