// src/models/Usuario.ts
import { Sequelize, DataTypes, Model, Optional } from "sequelize";

interface UsuarioAttributes {
  id_usuario: number;
  id_rol?: number; // Asumimos necesario para la lógica de negocio
  nombres: string; // Columna en SQL: nombres
  apellidos: string; // Columna en SQL: apellidos
  email: string;
  password: string; // Columna en SQL: password (almacena el hash)
  estado?: 'activo' | 'inactivo' | 'bloqueado'; // Asumimos necesario para la lógica de negocio
}

interface UsuarioCreationAttributes extends Optional<UsuarioAttributes, "id_usuario"> {}

export class Usuario
  extends Model<UsuarioAttributes, UsuarioCreationAttributes>
  implements UsuarioAttributes
{
  public id_usuario!: number;
  public nombres!: string;
  public apellidos!: string;
  public email!: string;
  public password!: string;
  public id_rol?: number;
  public estado?: 'activo' | 'inactivo' | 'bloqueado';

  static associate(models: any): void {
    this.belongsToMany(models.Chat, { through: models.ParticipanteChat, foreignKey: "id_usuario", otherKey: "id_chat" });
    this.hasMany(models.Mensaje, { foreignKey: "id_usuario" });
  }

  static initModel(sequelize: Sequelize): typeof Usuario {
    Usuario.init(
      {
        id_usuario: {
          type: DataTypes.BIGINT.UNSIGNED, // ✅ Coincide con BIGINT(20) en SQL
          autoIncrement: true,
          primaryKey: true,
        },
        // Agregamos id_rol y estado para el funcionamiento del servidor anterior
        id_rol: { type: DataTypes.INTEGER.UNSIGNED, allowNull: true, defaultValue: 1 }, 
        estado: { type: DataTypes.ENUM("activo", "inactivo", "bloqueado"), defaultValue: "activo", allowNull: true },
        
        nombres: { type: DataTypes.STRING(150), allowNull: false },
        apellidos: { type: DataTypes.STRING(150), allowNull: false },
        email: { type: DataTypes.STRING(200), allowNull: false, unique: true },
        password: { type: DataTypes.STRING(255), allowNull: false }, // Guarda el hash
        // Se ignoran fecha_nacimiento, celular y fecha_creacion para simplificar el backend del chat.
      },
      {
        sequelize,
        tableName: "usuario",
        timestamps: false,
        modelName: "Usuario",
      }
    );
    return Usuario;
  }
}

export default (sequelize: Sequelize): typeof Usuario => Usuario.initModel(sequelize);