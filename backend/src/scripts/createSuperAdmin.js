import dotenv from 'dotenv'
import connection from '../database.js'
import Usuario from '../models/Usuarios.js'

dotenv.config()

const createSuperAdmin = async () => {
    await connection()

    const exists = await Usuario.findOne({ email: 'cafemirador32@gmail.com' })

    if (exists) {
        console.log('⚠️ El superadmin ya existe')
        process.exit()
    }

    const user = new Usuario({
        nombre: 'Andre',
        apellido: 'Alvarez',
        email: 'cafemirador32@gmail.com',
        password: 'doncafe17',  // ✅ texto plano, el pre-hook lo hash automáticamente
        rol: 'superadmin',
        confirmarEmail: true
    })

    await user.save()

    console.log('✅ Superadmin creado correctamente')
    process.exit()
}

createSuperAdmin()
