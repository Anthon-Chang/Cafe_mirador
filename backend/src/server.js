import express from 'express'
import cors from 'cors'
import cloudinary from 'cloudinary' 
import fileUpload from 'express-fileupload'

// Importar rutas
import authRoutes from './routers/authRoutes.js'
import usuarioRoutes from './routers/usuarioRoutes.js'
import productoRoutes from './routers/productoRoutes.js'

// Inicializaciones
const app = express()

// Configuración Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// Middlewares 
app.use(express.json())
app.use(cors())

// Middleware para manejo de archivos
app.use(fileUpload({
    useTempFiles : true,
    tempFileDir : './uploads'
}))

// Variables globales
app.set('port', process.env.PORT || 3000)

// Ruta base
app.get('/', (req, res) => 
    res.send("API Café Mirador funcionando ☕")
)

// Rutas
app.use('/api/auth', authRoutes)
app.use('/api/user', usuarioRoutes)
app.use('/api/productos', productoRoutes)

// Exportar instancia
export default app
