// backend/src/controllers/userController.js
import Usuario from "../models/Usuarios.js"
import { v2 as cloudinary } from "cloudinary"
import { sendMailCredenciales } from "../helpers/sendMail.js"
import { subirBase64ConIdCloudinary } from "../helpers/uploadCloudinary.js"

const ROLES_STAFF = ['trabajador', 'supervisor', 'administrador']
const JERARQUIA   = ['cliente', 'trabajador', 'supervisor', 'administrador', 'superadmin']

// =====================================
// 1️⃣ PERFIL (usuario autenticado)
// =====================================
const getProfile = (req, res) => {
    res.status(200).json(req.usuario)
}

// =====================================
// 🆕 ACTUALIZAR MI PROPIO PERFIL
// =====================================
const actualizarPerfilPropio = async (req, res) => {
    try {
        const { nombre, apellido, celular, direccion, avatarBase64 } = req.body

        const usuario = await Usuario.findById(req.usuario._id)
        if (!usuario)
            return res.status(404).json({ msg: "Usuario no encontrado" })

        if (celular && await Usuario.findOne({ celular, _id: { $ne: usuario._id } }))
            return res.status(400).json({ msg: "El celular ya pertenece a otro usuario" })

        if (nombre?.trim())    usuario.nombre    = nombre.trim()
        if (apellido?.trim())  usuario.apellido  = apellido.trim()
        if (celular?.trim())   usuario.celular   = celular.trim()
        if (direccion?.trim()) usuario.direccion = direccion.trim()

        if (avatarBase64) {
            if (usuario.avatarID) {
                await cloudinary.uploader.destroy(usuario.avatarID)
            }
            const { secure_url, public_id } = await subirBase64ConIdCloudinary(avatarBase64, "Perfiles")
            usuario.avatar   = secure_url
            usuario.avatarID = public_id
        }

        await usuario.save()

        res.status(200).json({
            msg: "Perfil actualizado correctamente",
            usuario: {
                _id:       usuario._id,
                nombre:    usuario.nombre,
                apellido:  usuario.apellido,
                email:     usuario.email,
                rol:       usuario.rol,
                roles:     usuario.roles,
                cedula:    usuario.cedula,
                celular:   usuario.celular,
                direccion: usuario.direccion,
                avatar:    usuario.avatar,
                createdAt: usuario.createdAt,
            }
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error al actualizar el perfil" })
    }
}

// =====================================
// 🆕 CAMBIAR MI CONTRASEÑA
// =====================================
const cambiarPassword = async (req, res) => {
    try {
        const { passwordActual, passwordNueva, confirmarPassword } = req.body

        if (!passwordActual || !passwordNueva || !confirmarPassword)
            return res.status(400).json({ msg: "Debes llenar todos los campos" })

        if (passwordNueva !== confirmarPassword)
            return res.status(400).json({ msg: "Las contraseñas nuevas no coinciden" })

        if (passwordNueva.length < 6)
            return res.status(400).json({ msg: "La nueva contraseña debe tener al menos 6 caracteres" })

        const usuario = await Usuario.findById(req.usuario._id)
        if (!usuario)
            return res.status(404).json({ msg: "Usuario no encontrado" })

        const passwordCorrecto = await usuario.matchPassword(passwordActual)
        if (!passwordCorrecto)
            return res.status(401).json({ msg: "La contraseña actual es incorrecta" })

        usuario.password = passwordNueva
        await usuario.save()

        res.status(200).json({ msg: "Contraseña actualizada correctamente" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error al cambiar la contraseña" })
    }
}

// =====================================
// 2️⃣ COMPLETAR PERFIL (CLIENTE)
// =====================================
const completarPerfil = async (req, res) => {
    try {
        const { cedula, celular, direccion } = req.body

        if (!cedula || !celular || !direccion)
            return res.status(400).json({ msg: "Todos los datos de facturación son obligatorios" })

        const usuario = await Usuario.findById(req.usuario._id)
        if (!usuario)
            return res.status(404).json({ msg: "Usuario no encontrado" })

        if (await Usuario.findOne({ cedula, _id: { $ne: req.usuario._id } }))
            return res.status(400).json({ msg: "La cédula ya pertenece a otro usuario" })

        if (await Usuario.findOne({ celular, _id: { $ne: req.usuario._id } }))
            return res.status(400).json({ msg: "El celular ya pertenece a otro usuario" })

        usuario.cedula    = cedula
        usuario.celular   = celular
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

        if (!nombre || !apellido || !email || !rol)
            return res.status(400).json({ msg: "Debes llenar todos los campos obligatorios" })

        const rolesPermitidos = req.usuarioRol === "superadmin"
            ? ['trabajador', 'supervisor', 'administrador']
            : ['trabajador', 'supervisor']

        if (!rolesPermitidos.includes(rol))
            return res.status(400).json({ msg: "Rol no permitido" })

        if (cedula && await Usuario.findOne({ cedula }))
            return res.status(400).json({ msg: "La cédula ya pertenece a otro usuario" })

        if (celular && await Usuario.findOne({ celular }))
            return res.status(400).json({ msg: "El celular ya pertenece a otro usuario" })

        const usuarioExistente = await Usuario.findOne({ email: email.toLowerCase() })

        if (usuarioExistente) {
            if (ROLES_STAFF.some(r => (usuarioExistente.roles ?? []).includes(r)))
                return res.status(400).json({
                    msg: "Este usuario ya tiene un rol de trabajador asignado"
                })

            const rolesActualizados = [...new Set([...(usuarioExistente.roles ?? ['cliente']), rol])]
            usuarioExistente.roles = rolesActualizados

            if (cedula)    usuarioExistente.cedula    = cedula
            if (celular)   usuarioExistente.celular   = celular
            if (direccion) usuarioExistente.direccion = direccion

            await usuarioExistente.save()

            return res.status(200).json({
                msg: `Rol de ${rol} agregado al cliente existente`,
                usuario: {
                    _id:       usuarioExistente._id,
                    nombre:    usuarioExistente.nombre,
                    apellido:  usuarioExistente.apellido,
                    email:     usuarioExistente.email,
                    roles:     usuarioExistente.roles,
                    rol:       usuarioExistente.rol,
                    cedula:    usuarioExistente.cedula,
                    celular:   usuarioExistente.celular,
                    direccion: usuarioExistente.direccion,
                }
            })
        }

        const generarPassword = () => "STAFF" + Math.random().toString(36).toUpperCase().slice(2, 6)
        const passwordGenerada = generarPassword()

        const nuevoUsuario = new Usuario({
            nombre,
            apellido,
            email: email.toLowerCase(),
            password: passwordGenerada,
            roles: ['cliente', rol],
            confirmarEmail: true,
            cedula,
            celular,
            direccion
        })

        await nuevoUsuario.save()
        await sendMailCredenciales(email, passwordGenerada, nombre)

        res.status(201).json({
            msg: `${rol} creado correctamente y contraseña enviada al correo`,
            usuario: {
                _id:       nuevoUsuario._id,
                nombre,
                apellido,
                email,
                roles:     nuevoUsuario.roles,
                rol:       nuevoUsuario.rol,
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

// =====================================
// 4️⃣ EDITAR STAFF (ADMIN)
// =====================================
const editStaff = async (req, res) => {
    try {
        const { id } = req.params
        const { nombre, apellido, roles, cedula, celular, direccion } = req.body

        const usuario = await Usuario.findById(id)
        if (!usuario)
            return res.status(404).json({ msg: "Usuario no encontrado" })

        if (roles) {
            const rolesValidos = ['cliente', 'trabajador', 'supervisor', 'administrador']
            if (!Array.isArray(roles) || !roles.every(r => rolesValidos.includes(r)))
                return res.status(400).json({ msg: "Roles no válidos" })
        }

        if (cedula && await Usuario.findOne({ cedula, _id: { $ne: id } }))
            return res.status(400).json({ msg: "La cédula ya pertenece a otro usuario" })

        if (celular && await Usuario.findOne({ celular, _id: { $ne: id } }))
            return res.status(400).json({ msg: "El celular ya pertenece a otro usuario" })

        if (nombre)    usuario.nombre    = nombre
        if (apellido)  usuario.apellido  = apellido
        if (roles)     usuario.roles     = [...new Set(roles)]
        if (cedula)    usuario.cedula    = cedula
        if (celular)   usuario.celular   = celular
        if (direccion) usuario.direccion = direccion

        await usuario.save()

        res.status(200).json({ msg: "Usuario actualizado correctamente", usuario })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

// =====================================
// 5️⃣ ELIMINAR STAFF (ADMIN)
// =====================================
const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params

        const usuario = await Usuario.findById(id)
        if (!usuario)
            return res.status(404).json({ msg: "Usuario no encontrado" })

        if (usuario.rol === "superadmin")
            return res.status(403).json({ msg: "No puedes eliminar a un superadmin" })

        const tieneRolCliente = (usuario.roles ?? []).includes('cliente')
        const rolesStaff      = (usuario.roles ?? []).filter(r => ROLES_STAFF.includes(r))

        if (tieneRolCliente && rolesStaff.length > 0) {
            usuario.roles = ['cliente']
            await usuario.save()
            return res.status(200).json({
                msg: "Roles de staff eliminados. El usuario conserva su cuenta como cliente.",
                usuario
            })
        }

        await usuario.deleteOne()
        res.status(200).json({ msg: "Usuario eliminado correctamente" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `❌ Error en el servidor - ${error}` })
    }
}

// =====================================
// 6️⃣ LISTAR STAFF (ADMIN)
// =====================================
export const getStaff = async (req, res) => {
    try {
        const usuarios = await Usuario.find({
            roles: { $in: ROLES_STAFF }
        })
            .select("-password -token -__v")
            .sort({ createdAt: -1 })

        res.status(200).json(usuarios)
    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: `Error en el servidor - ${error}` })
    }
}

// =====================================
// 7️⃣ BUSCAR CLIENTE POR CÉDULA (CAJERO)
// =====================================
const buscarPorCedula = async (req, res) => {
    try {
        const { cedula } = req.params

        if (!cedula?.trim())
            return res.status(400).json({ msg: "Cédula requerida" })

        const usuario = await Usuario.findOne({ cedula: cedula.trim() })
            .select("nombre apellido cedula celular direccion email")

        if (!usuario)
            return res.status(404).json({ msg: "Cliente no encontrado" })

        res.status(200).json(usuario)

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "Error al buscar cliente" })
    }
}

export {
    getProfile,
    actualizarPerfilPropio,
    cambiarPassword,
    completarPerfil,
    registerStaff,
    editStaff,
    deleteStaff,
    buscarPorCedula,
}