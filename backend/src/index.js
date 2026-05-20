import dotenv from 'dotenv'
dotenv.config()

import httpServer from './server.js'
import connection from './database.js'

const PORT = process.env.PORT || 3000

connection()

httpServer.listen(PORT, () => {
    console.log(`Server ok en http://localhost:${PORT}`)
})