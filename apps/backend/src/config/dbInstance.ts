// src/config/dbInstance.ts
import { Sequelize } from 'sequelize';
import * as dotenv from 'dotenv';
dotenv.config();

// Usaremos el nombre de base de datos 'cursos_ucp' de tu SQL
const sequelize = new Sequelize(
  process.env.DB_NAME || 'cursos_ucp', 
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    logging: false,
    timezone: '-05:00',
    // Añadir dialectOptions para la opción "dateStrings" si usas MySQL/MariaDB.
    dialectOptions: {
      // Esta opción es opcional pero útil para manejo de fechas.
      // dateStrings: true, 
      // typeCast: true, 
    },
  }
);

export default sequelize;