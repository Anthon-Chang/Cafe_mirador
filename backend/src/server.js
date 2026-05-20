import express from 'express'
import cors from 'cors'
import cloudinary from 'cloudinary'
import fileUpload from 'express-fileupload'
import { createServer } from 'http'
import { Server } from 'socket.io'

// Importar rutas
import authRoutes from './routers/authRoutes.js'
import usuarioRoutes from './routers/usuarioRoutes.js'
import productoRoutes from './routers/productoRoutes.js'
import pedidoRoutes from './routers/pedidoRoutes.js'

// Inicializaciones
const app = express()
const httpServer = createServer(app)

// CORS origin sin barra final (evita el error de preflight)
const FRONTEND_ORIGIN = (process.env.URL_FRONTEND || "http://localhost:5173").replace(/\/+$/, "")

// ── Socket.io ────────────────────────────────────────────────────
const io = new Server(httpServer, {
    cors: {
        origin: FRONTEND_ORIGIN,
        methods: ["GET", "POST", "PATCH"]
    }
})

io.on("connection", (socket) => {
    console.log("🔌 Cliente conectado:", socket.id)
    socket.on("disconnect", () => {
        console.log("❌ Cliente desconectado:", socket.id)
    })
})

app.set("io", io)

// ── Configuración Cloudinary ─────────────────────────────────────
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:    process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})

// ── Middlewares ──────────────────────────────────────────────────
app.use(express.json())
app.use(cors({ origin: FRONTEND_ORIGIN }))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: './uploads'
}))

// ── Variables globales ───────────────────────────────────────────
app.set('port', process.env.PORT || 3000)

// ── Ruta base ────────────────────────────────────────────────────
app.get('/', (req, res) =>
    res.send("API Café Mirador funcionando ☕")
)

// ── Rutas ────────────────────────────────────────────────────────
app.use('/api/auth',      authRoutes)
app.use('/api/user',      usuarioRoutes)
app.use('/api/productos', productoRoutes)
app.use('/api/pedidos',   pedidoRoutes)

export { httpServer as default, app }