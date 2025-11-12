import sequelize from "../config/db";
import { Sequelize } from "sequelize";
import {initModels} from "./initModels";

const connectDB = async () => {
    try {
        await sequelize.authenticate();
        console.log("Conexión a la base de datos establecida correctamente.");
    } catch (error) {
        console.error("No se pudo conectar a la base de datos:", error);
    }
};

initModels(sequelize);

export {sequelize, connectDB};