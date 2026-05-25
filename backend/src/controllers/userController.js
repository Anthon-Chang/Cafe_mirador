import Usuario from "../models/Usuarios.js"
import { sendMailCredenciales } from "../helpers/sendMail.js"

// =====================================
// 1️⃣ PERFIL (usuario autenticado)
// =====================================
const getProfile = (req, res) => {
    res.status(200).json(req.usuario)
}

// =====================================
// 2️⃣ COMPLETAR PERFIL (CLIENTE)
// =====================================
const completarPerfil = async (req, res) => {
    try {
        const { cedula, celular, direccion } = req.body

        if (!cedula || !celular || !direccion)
            return res.status(400).json({
                msg: "Todos los datos de facturación son obligatorios"
            })

        const usuario = await Usuario.findById(req.usuario._id)
        if (!usuario)
            return res.status(404).json({ msg: "Usuario no encontrado" })

        // Validar duplicados
        const cedulaExistente = await Usuario.findOne({ cedula, _id: { $ne: req.usuario._id } })
        if (cedulaExistente)
            return res.status(400).json({ msg: "La cédula ya pertenece a otro usuario" })

        const celularExistente = await Usuario.findOne({ celular, _id: { $ne: req.usuario._id } })
        if (celularExistente)
            return res.status(400).json({ msg: "El celular ya pertenece a otro usuario" })

        // Actualizar datos
        usuario.cedula = cedula
        usuario.celular = celular
        usuario.direccion = direccion

        await usuario.save()

        res.status(200).json({ msg: "Perfil actualizado correctamente" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error al actualizar perfil" })
    }
}

// =====================================
// 3️⃣ REGISTRAR STAFF (ADMIN)
// =====================================
const registerStaff = async (req, res) => {
    try {
        const { nombre, apellido, email, rol, cedula, celular, direccion } = req.body

        // Validar campos obligatorios
        if ([nombre, apellido, email, rol].includes("") || !nombre || !apellido || !email || !rol)
            return res.status(400).json({ msg: "Debes llenar todos los campos obligatorios" })

        // Roles permitidos según quien crea el usuario
        const rolesPermitidos = req.usuarioRol === "superadmin"
            ? ['trabajador', 'supervisor', 'administrador']
            : ['trabajador', 'supervisor']

        if (!rolesPermitidos.includes(rol))
            return res.status(400).json({ msg: "Rol no permitido" })

        // Verificar duplicados
        if (await Usuario.findOne({ email: email.toLowerCase() }))
            return res.status(400).json({ msg: "El email ya se encuentra registrado" })

        if (cedula && await Usuario.findOne({ cedula }))
            return res.status(400).json({ msg: "La cédula ya pertenece a otro usuario" })

        if (celular && await Usuario.findOne({ celular }))
            return res.status(400).json({ msg: "El celular ya pertenece a otro usuario" })

        // Generar contraseña automática
        const generarPassword = () => "STAFF" + Math.random().toString(36).toUpperCase().slice(2, 6)
        const passwordGenerada = generarPassword()

        // Crear nuevo usuario
        const nuevoUsuario = new Usuario({
            nombre,
            apellido,
            email: email.toLowerCase(),
            password: passwordGenerada, // hash automático con pre-hook
            rol,
            confirmarEmail: true,
            cedula,
            celular,
            direccion
        })

        await nuevoUsuario.save()

        // Enviar credenciales al correo del trabajador
        await sendMailCredenciales(email, passwordGenerada, nombre)

        res.status(201).json({
            msg: `${rol} creado correctamente y contraseña enviada al correo`,
            usuario: {
                nombre,
                apellido,
                email,
                rol,
                cedula,
                celular,
                direccion
            }
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

// ===============================
// EDITAR TRABAJADOR (ADMIN)
// ===============================

const editStaff = async (req, res) => {
    try {
        const { id } = req.params // id del usuario a editar
        const { nombre, apellido, rol, cedula, celular, direccion } = req.body

        // Solo permitir roles válidos
        if (rol && !['trabajador', 'supervisor', 'administrador'].includes(rol))
            return res.status(400).json({ msg: "Rol no permitido" })

        const usuario = await Usuario.findById(id)
        if (!usuario)
            return res.status(404).json({ msg: "Usuario no encontrado" })

        // Validaciones de duplicados
        if (cedula && await Usuario.findOne({ cedula, _id: { $ne: id } }))
            return res.status(400).json({ msg: "La cédula ya pertenece a otro usuario" })

        if (celular && await Usuario.findOne({ celular, _id: { $ne: id } }))
            return res.status(400).json({ msg: "El celular ya pertenece a otro usuario" })

        if (nombre) usuario.nombre = nombre
        if (apellido) usuario.apellido = apellido
        if (rol) usuario.rol = rol
        if (cedula) usuario.cedula = cedula
        if (celular) usuario.celular = celular
        if (direccion) usuario.direccion = direccion

        await usuario.save()

        res.status(200).json({ msg: "Usuario actualizado correctamente", usuario })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

// ===============================
// eliminar trabajador (ADMIN)
// ===============================

const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params

        const usuario = await Usuario.findById(id)
        if (!usuario)
            return res.status(404).json({ msg: "Usuario no encontrado" })

        // Evitar borrar superadmins o a sí mismo
        if (usuario.rol === "superadmin")
            return res.status(403).json({ msg: "No puedes eliminar a un superadmin" })

        await usuario.deleteOne()

        res.status(200).json({ msg: "Usuario eliminado correctamente" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

// =====================================
// LISTAR STAFF (ADMIN) - AÑADIDO
// =====================================
export const getStaff = async (req, res) => {
    try {
        const usuarios = await Usuario.find({
            rol: { $in: ['trabajador', 'supervisor', 'administrador'] }
        })
            .select("-password -token -__v")
            .sort({ createdAt: -1 })

        res.status(200).json(usuarios)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}

export {
    getProfile,
    completarPerfil,
    registerStaff,
    editStaff,
    deleteStaff
}