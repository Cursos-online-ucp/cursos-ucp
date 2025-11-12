import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv'

dotenv.config()

const sequelize = new Sequelize(
    process.env.DB_NAME as string,
    process.env.DB_USER as string,
    process.env.DB_PASSWORD as string,
    {
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT) || 3306,
        dialect: "mysql",
        logging: process.env.DB_LOGGING === 'true' ? console.log : false,
        define: {
            timestamps: true,
            freezeTableName: true,
        },
    }
);

export default sequelize;