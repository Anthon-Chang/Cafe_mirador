import express from "express"
import {
    crearPedido,
    obtenerPedidosActivos,
    obtenerTodosPedidos,
    actualizarEstadoPedido,
    actualizarPedido,
    eliminarPedido,
    obtenerEstadisticas
} from "../controllers/pedidoController.js"

import { verificarTokenJWT, verificarNivel } from "../middlewares/JWT.js"

const router = express.Router()

// 📊 Estadísticas del dashboard → mínimo trabajador
router.get(
    "/estadisticas",
    verificarTokenJWT,
    verificarNivel("trabajador"),
    obtenerEstadisticas
)

// 📋 Pedidos activos (pendiente + procesando)
router.get(
    "/activos",
    verificarTokenJWT,
    verificarNivel("trabajador"),
    obtenerPedidosActivos
)

// 📋 Todos los pedidos (con filtro opcional ?estado=completado)
router.get(
    "/",
    verificarTokenJWT,
    verificarNivel("trabajador"),
    obtenerTodosPedidos
)

// ➕ Crear pedido → mínimo trabajador
router.post(
    "/",
    verificarTokenJWT,
    verificarNivel("trabajador"),
    crearPedido
)

// ✏️ Cambiar estado → mínimo trabajador
router.patch(
    "/:id/estado",
    verificarTokenJWT,
    verificarNivel("trabajador"),
    actualizarEstadoPedido
)

// ✏️ Actualizar pedido completo (items, cliente) → mínimo trabajador
router.put(
    "/:id",
    verificarTokenJWT,
    verificarNivel("trabajador"),
    actualizarPedido
)

// 🗑️ Eliminar pedido → mínimo trabajador
router.delete(
    "/:id",
    verificarTokenJWT,
    verificarNivel("trabajador"),
    eliminarPedido
)

export default router