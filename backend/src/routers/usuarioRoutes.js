import { Router } from "express"
import {
    getProfile,
    completarPerfil,
    registerStaff,
    editStaff,
    deleteStaff
} from "../controllers/userController.js"

import {
    verificarTokenJWT,
    verificarNivel
} from "../middlewares/JWT.js"

const router = Router()

// ======================================
// TODAS LAS RUTAS REQUIEREN TOKEN
// ======================================
router.use(verificarTokenJWT)

// ======================================
// PERFIL (cualquier usuario autenticado)
// ======================================
router.get("/perfil", getProfile)

// ======================================
// COMPLETAR PERFIL (solo cliente)
// ======================================
router.put(
    "/completar-perfil",
    verificarNivel("cliente"), 
    completarPerfil
)

// ======================================
// CREAR PERSONAL (desde administrador hacia arriba)
// administrador y superadmin
// ======================================
router.post(
    "/staff",
    verificarNivel("administrador"),
    registerStaff
)

// Editar usuario (solo admin o superadmin)
router.put("/staff/:id", verificarNivel("administrador"), editStaff)

// Eliminar usuario (solo admin o superadmin)
router.delete("/staff/:id", verificarNivel("administrador"), deleteStaff)

export default router
