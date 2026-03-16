import { Router } from "express"
import {
    registerPublic,
    confirmEmail,
    login,
    recoverPassword,
    newPassword
} from "../controllers/authController.js"

const router = Router()

// ===============================
// REGISTRO PUBLICO (cliente)
// ===============================
router.post("/registro", registerPublic)

// ===============================
// CONFIRMAR EMAIL
// ===============================
router.get("/confirmar/:token", confirmEmail)

// ===============================
// LOGIN
// ===============================
router.post("/login", login)

// ===============================
// RECUPERAR PASSWORD
// ===============================
router.post("/recuperar-password", recoverPassword)

// ===============================
// NUEVO PASSWORD
// ===============================
router.post("/nuevo-password/:token", newPassword)

export default router
