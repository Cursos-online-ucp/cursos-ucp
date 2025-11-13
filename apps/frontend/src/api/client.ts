import axios from 'axios'

// Si tienes proxy en Vite:
// const api = axios.create({ baseURL: '/api' })
const api = axios.create({
  baseURL: 'http://localhost:4000/api'
})

export default api
