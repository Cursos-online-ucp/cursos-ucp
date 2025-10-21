import  express  from "express";
import db from "./config/db";

//conectar db

async function connectDB() {
    try {
        await db.authenticate()
        db.sync()
        console.log('conexion exitosa a DB');
        
    } catch (error) {
        console.log(error);
        console.log('Error a conectar a base de datos');
        
        
    }
}

connectDB()

const app = express()

export default app