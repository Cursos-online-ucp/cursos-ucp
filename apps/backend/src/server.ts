import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import path from 'path'
import db from './config/db'
import router from './router'

dotenv.config()

// Conectar DB
async function connectDB() {
  try {
    await db.authenticate()
    await db.sync()
    console.log('conexion exitosa a DB')
  } catch (error) {
    console.log(error)
    console.log('Error a conectar a base de datos')
  }
}

connectDB()

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ⬇️ MUY IMPORTANTE: esto VA ANTES de app.use('/api', router)
const uploadsPath = path.join(__dirname, '..', 'uploads')
console.log('Sirviendo /api/uploads desde:', uploadsPath)

app.use('/api/uploads', express.static(uploadsPath))

// Rutas API
app.use('/api', router)

export default app
