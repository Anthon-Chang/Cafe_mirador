import jwt from "jsonwebtoken"
import Usuario from "../models/Usuarios.js"

// =====================================================
// 📌 JERARQUÍA DE ROLES
// =====================================================
const jerarquiaRoles = {
    cliente: 1,
    trabajador: 2,
    supervisor: 3,
    administrador: 4,
    superadmin: 5
}

// =====================================================
// 📌 CREAR TOKEN
// =====================================================
const crearTokenJWT = (id, rol) => {
    return jwt.sign(
        { id, rol },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    )
}

// =====================================================
// 📌 VERIFICAR TOKEN (Autenticación)
// =====================================================
const verificarTokenJWT = async (req, res, next) => {
    const { authorization } = req.headers

    if (!authorization || !authorization.startsWith("Bearer "))
        return res.status(401).json({
            msg: "Acceso denegado: token no proporcionado"
        })

    try {
        const token = authorization.split(" ")[1]

        const { id, rol } = jwt.verify(
            token,
            process.env.JWT_SECRET
        )

        const usuarioBDD = await Usuario.findById(id)
            .lean()
            .select("-password -token")

        if (!usuarioBDD)
            return res.status(401).json({
                msg: "Usuario no encontrado"
            })

        if (!usuarioBDD.status)
            return res.status(403).json({
                msg: "Usuario inactivo"
            })

        // Adjuntar usuario al request
        req.usuario = usuarioBDD
        req.usuarioRol = rol

        next()

    } catch (error) {
        return res.status(401).json({
            msg: "Token inválido o expirado"
        })
    }
}

// =====================================================
// 📌 VERIFICAR ROLES ESPECÍFICOS
// =====================================================
const verificarRoles = (...rolesPermitidos) => {
    return (req, res, next) => {

        if (!req.usuarioRol)
            return res.status(403).json({
                msg: "No autorizado"
            })

        if (!rolesPermitidos.includes(req.usuarioRol))
            return res.status(403).json({
                msg: "No tienes permisos para realizar esta acción"
            })

        next()
    }
}

// =====================================================
// 📌 VERIFICACIÓN JERÁRQUICA (RECOMENDADO)
// =====================================================
const verificarNivel = (rolMinimo) => {
    return (req, res, next) => {

        if (!req.usuarioRol)
            return res.status(403).json({
                msg: "No autorizado"
            })

        const nivelUsuario = jerarquiaRoles[req.usuarioRol]
        const nivelRequerido = jerarquiaRoles[rolMinimo]

        if (!nivelUsuario || nivelUsuario < nivelRequerido)
            return res.status(403).json({
                msg: "No tienes permisos suficientes"
            })

        next()
    }
}

export {
    crearTokenJWT,
    verificarTokenJWT,
    verificarRoles,
    verificarNivel
}
