import { Sequelize } from "sequelize-typescript";
import dotenv from 'dotenv'
import Curso from "../models/Curso.models";
dotenv.config()



const db = new Sequelize(process.env.DATABASE_URL!, {
    models: [Curso],            // registra modelos
    logging: false
})

export default db