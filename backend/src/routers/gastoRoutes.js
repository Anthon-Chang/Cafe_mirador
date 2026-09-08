import express from "express"
import {
    crearGasto,
    obtenerGastos,
    actualizarGasto,
    toggleGasto,
    eliminarGasto,
    obtenerResumenFinanciero,
    obtenerGastosPorCategoria,
} from "../controllers/gastoController.js"

import { verificarTokenJWT, verificarNivel } from "../middlewares/JWT.js"

const router = express.Router()

// Todo lo relacionado a gastos → mínimo administrador (información financiera sensible)
router.use(verificarTokenJWT, verificarNivel("administrador"))

router.get("/resumen",       obtenerResumenFinanciero)
router.get("/por-categoria", obtenerGastosPorCategoria)
router.get("/",              obtenerGastos)
router.post("/",             crearGasto)
router.put("/:id",           actualizarGasto)
router.patch("/:id/toggle",  toggleGasto)
router.delete("/:id",        eliminarGasto)

export default router