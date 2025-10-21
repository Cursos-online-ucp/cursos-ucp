
import server from './server'

const port = process.env.PORT || 4000

server.listen( port, () => {
    console.log(`RES API Funcionando en el puerto ${port}`);
    
})
