import Usuario from "../models/Usuarios.js"
import { crearTokenJWT } from "../middlewares/JWT.js"
import { sendMailToRegister, sendMailToRecoveryPassword } from "../helpers/sendMail.js"

// =====================================
// 1️⃣ REGISTRO PÚBLICO (CLIENTE MANUAL)
// =====================================
const registerPublic = async (req, res) => {
    try {
        const { nombre, apellido, email, password, cedula, celular, direccion } = req.body

        // Validar campos obligatorios
        if (!nombre || !apellido || !email || !password || !cedula || !celular || !direccion)
            return res.status(400).json({ msg: "Todos los campos son obligatorios" })

        // Verificar email duplicado
        const existeEmail = await Usuario.findOne({ email: email.toLowerCase() })
        if (existeEmail)
            return res.status(400).json({ msg: "El email ya está registrado" })

        // Verificar cédula duplicada
        const existeCedula = await Usuario.findOne({ cedula })
        if (existeCedula)
            return res.status(400).json({ msg: "La cédula ya está registrada" })

        const nuevoUsuario = new Usuario({
            nombre,
            apellido,
            email:    email.toLowerCase(),
            password,
            cedula,
            celular,
            direccion,
            rol: "cliente"
        })

        const token = nuevoUsuario.generarToken()

        await nuevoUsuario.save()
        await sendMailToRegister(email, token, nuevoUsuario.nombre)

        res.status(201).json({ msg: "Revisa tu correo para confirmar tu cuenta" })

    } catch (error) {
        console.log("ERROR REAL:", error)
        res.status(500).json({ msg: `Error del servidor - ${error.message}` })
    }
}

// =====================================
// 2️⃣ CONFIRMAR EMAIL
// =====================================
const confirmEmail = async (req, res) => {
    try {
        const { token } = req.params

        const usuario = await Usuario.findOne({ token })

        if (!usuario)
            return res.status(404).json({ msg: "Token inválido o ya confirmado" })

        usuario.confirmarEmail = true
        usuario.token = null

        await usuario.save()

        res.status(200).json({ msg: "Cuenta confirmada correctamente" })

    } catch (error) {
        res.status(500).json({ msg: "Error al confirmar cuenta" })
    }
}

// =====================================
// 3️⃣ LOGIN
// =====================================
const login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password)
            return res.status(400).json({ msg: "Email y password obligatorios" })

        const usuario = await Usuario.findOne({ email: email.toLowerCase() })

        if (!usuario)
            return res.status(404).json({ msg: "Usuario no registrado" })

        if (!usuario.confirmarEmail)
            return res.status(403).json({ msg: "Debes confirmar tu cuenta" })

        if (!usuario.status)
            return res.status(403).json({ msg: "Usuario deshabilitado" })

        const passwordCorrecto = await usuario.matchPassword(password)
        if (!passwordCorrecto)
            return res.status(401).json({ msg: "Password incorrecto" })

        const token = crearTokenJWT(usuario._id, usuario.rol)

        // perfilIncompleto solo aplica para usuarios que entraron con Google
        const perfilIncompleto = !usuario.cedula || !usuario.celular || !usuario.direccion

        res.status(200).json({
            token,
            usuario: {
                _id:             usuario._id,
                nombre:          usuario.nombre,
                apellido:        usuario.apellido,
                email:           usuario.email,
                rol:             usuario.rol,
                perfilIncompleto
            }
        })

    } catch (error) {
        res.status(500).json({ msg: "Error en login" })
    }
}

// =====================================
// 4️⃣ RECUPERAR PASSWORD
// =====================================
const recoverPassword = async (req, res) => {
    try {
        const { email } = req.body

        if (!email)
            return res.status(400).json({ msg: "Debes ingresar un email" })

        const usuario = await Usuario.findOne({ email: email.toLowerCase() })

        if (!usuario)
            return res.status(404).json({ msg: "Usuario no encontrado" })

        const token = usuario.generarToken()

        await usuario.save()
        await sendMailToRecoveryPassword(email, token)

        res.status(200).json({ msg: "Revisa tu correo para restablecer tu contraseña" })

    } catch (error) {
        res.status(500).json({ msg: "Error al recuperar contraseña" })
    }
}

// =====================================
// 5️⃣ NUEVO PASSWORD
// =====================================
const newPassword = async (req, res) => {
    try {
        const { token } = req.params
        const { password, confirmPassword } = req.body

        if (!password || !confirmPassword)
            return res.status(400).json({ msg: "Debes llenar todos los campos" })

        if (password !== confirmPassword)
            return res.status(400).json({ msg: "Las contraseñas no coinciden" })

        const usuario = await Usuario.findOne({ token })

        if (!usuario)
            return res.status(404).json({ msg: "Token inválido" })

        usuario.password = password
        usuario.token = null

        await usuario.save()

        res.status(200).json({ msg: "Contraseña actualizada correctamente" })

    } catch (error) {
        res.status(500).json({ msg: "Error al actualizar contraseña" })
    }
}

export {
    registerPublic,
    confirmEmail,
    login,
    recoverPassword,
    newPassword
}