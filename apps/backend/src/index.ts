
import server from './server'
import { connectDB } from "./models";
import dotenv from "dotenv";

dotenv.config();

const port = process.env.PORT || 3000

const startServer = async () => {
  try {
    await connectDB(); // 🔌 se conecta a MySQL
    server.listen(port, () => {
      console.log(`REST API funcionando en el puerto ${port}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor o conectar a la BD:", error);
  }
};

startServer();
