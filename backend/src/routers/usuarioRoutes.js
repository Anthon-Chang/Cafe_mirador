import { Router } from "express"
import {
    getProfile,
    completarPerfil,
    registerStaff,
    editStaff,
    deleteStaff,
    getStaff,
    buscarPorCedula,
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

// BUSCAR CLIENTE POR CÉDULA (trabajador+ — para autocompletar en caja)
router.get("/buscar/:cedula", verificarNivel("trabajador"), buscarPorCedula)

// LISTAR STAFF (administrador+)
router.get("/staff", verificarNivel("administrador"), getStaff)

// CREAR PERSONAL (administrador+)
router.post("/staff", verificarNivel("administrador"), registerStaff)

// EDITAR STAFF (administrador+)
router.put("/staff/:id", verificarNivel("administrador"), editStaff)

// ELIMINAR STAFF (administrador+)
router.delete("/staff/:id", verificarNivel("administrador"), deleteStaff)

export default router