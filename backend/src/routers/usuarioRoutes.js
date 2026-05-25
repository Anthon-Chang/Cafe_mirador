import { Router } from "express"
import {
    getProfile,
    completarPerfil,
    registerStaff,
    editStaff,
    deleteStaff,
    getStaff
} from "../controllers/userController.js"

import {
    verificarTokenJWT,
    verificarNivel
} from "../middlewares/JWT.js"

const router = Router()

// Todas las rutas requieren token
router.use(verificarTokenJWT)

// PERFIL (cualquier usuario autenticado)
router.get("/perfil", getProfile)

// COMPLETAR PERFIL (solo cliente)
router.put("/completar-perfil", verificarNivel("cliente"), completarPerfil)

// LISTAR STAFF (administrador+)
router.get("/staff", verificarNivel("administrador"), getStaff)

// CREAR PERSONAL (administrador+)
router.post("/staff", verificarNivel("administrador"), registerStaff)

// Editar usuario (administrador+)
router.put("/staff/:id", verificarNivel("administrador"), editStaff)

// Eliminar usuario (administrador+)
router.delete("/staff/:id", verificarNivel("administrador"), deleteStaff)

export default router