import express from "express"
import {
    crearProducto,
    obtenerProductos,
    detalleProducto,
    actualizarProducto,
    eliminarProducto
} from "../controllers/productoController.js"

import { verificarTokenJWT, verificarNivel } from "../middlewares/JWT.js"

const router = express.Router()

// 🔎 VISUALIZAR → mínimo trabajador
router.get(
    "/",
    verificarTokenJWT,
    verificarNivel("trabajador"),
    obtenerProductos
)

router.get(
    "/:id",
    verificarTokenJWT,
    verificarNivel("trabajador"),
    detalleProducto
)

// 🔐 CRUD → mínimo supervisor
router.post(
    "/",
    verificarTokenJWT,
    verificarNivel("supervisor"),
    crearProducto
)

router.put(
    "/:id",
    verificarTokenJWT,
    verificarNivel("supervisor"),
    actualizarProducto
)

router.delete(
    "/:id",
    verificarTokenJWT,
    verificarNivel("supervisor"),
    eliminarProducto
)

export default router