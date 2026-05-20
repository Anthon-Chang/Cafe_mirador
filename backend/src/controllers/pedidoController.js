import Pedido from "../models/Pedido.js"
import mongoose from "mongoose"

// ===============================
// CREAR PEDIDO
// ===============================
const crearPedido = async (req, res) => {
    try {
        const { nombreCliente, items } = req.body

        if (!items || items.length === 0)
            return res.status(400).json({ msg: "El pedido debe tener al menos un ítem" })

        // Validar que cada producto tenga un ObjectId válido
        for (const item of items) {
            if (!mongoose.Types.ObjectId.isValid(item.producto))
                return res.status(400).json({ msg: `ID de producto inválido: "${item.producto}". Debe ser un ObjectId de MongoDB (24 caracteres hex)` })
            if (!item.nombre || !item.precio || !item.cantidad)
                return res.status(400).json({ msg: "Cada ítem requiere: producto, nombre, precio y cantidad" })
            if (item.precio <= 0 || item.cantidad < 1)
                return res.status(400).json({ msg: "El precio debe ser > 0 y la cantidad >= 1" })
        }

        // Calcular subtotales y total
        const itemsCalculados = items.map(item => ({
            ...item,
            subtotal: item.precio * item.cantidad
        }))
        const total = itemsCalculados.reduce((sum, i) => sum + i.subtotal, 0)

        const pedido = new Pedido({
            nombreCliente: nombreCliente || "Cliente mostrador",
            items: itemsCalculados,
            total,
            creadoPor: req.usuario._id
        })

        await pedido.save()

        // Emitir evento Socket.io a todos los clientes conectados
        const io = req.app.get("io")
        if (io) io.emit("nuevoPedido", pedido)

        res.status(201).json({ msg: "Pedido creado", pedido })

    } catch (error) {
        console.error("ERROR CREAR PEDIDO:", error.message, error)
        res.status(500).json({ msg: "❌ Error en el servidor", detalle: error.message })
    }
}

// ===============================
// LISTAR PEDIDOS ACTIVOS
// (pendiente + procesando)
// ===============================
const obtenerPedidosActivos = async (req, res) => {
    try {
        const pedidos = await Pedido.find({
            estado: { $in: ["pendiente", "procesando"] }
        })
            .sort({ createdAt: -1 })
            .populate("creadoPor", "nombre apellido")

        res.status(200).json(pedidos)

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor" })
    }
}

// ===============================
// LISTAR TODOS LOS PEDIDOS
// ===============================
const obtenerTodosPedidos = async (req, res) => {
    try {
        const { estado, limite = 50 } = req.query

        const filtro = estado ? { estado } : {}

        const pedidos = await Pedido.find(filtro)
            .sort({ createdAt: -1 })
            .limit(Number(limite))
            .populate("creadoPor", "nombre apellido")

        res.status(200).json(pedidos)

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor" })
    }
}

// ===============================
// ACTUALIZAR ESTADO PEDIDO
// ===============================
const actualizarEstadoPedido = async (req, res) => {
    try {
        const { id } = req.params
        const { estado } = req.body

        const estadosValidos = ["pendiente", "procesando", "completado", "cancelado"]
        if (!estadosValidos.includes(estado))
            return res.status(400).json({ msg: "Estado no válido" })

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ msg: "ID no válido" })

        const pedido = await Pedido.findByIdAndUpdate(
            id,
            { estado },
            { new: true }
        )

        if (!pedido)
            return res.status(404).json({ msg: "Pedido no encontrado" })

        // Emitir actualización en tiempo real
        const io = req.app.get("io")
        if (io) io.emit("pedidoActualizado", pedido)

        res.status(200).json({ msg: "Estado actualizado", pedido })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor" })
    }
}

// ===============================
// ESTADÍSTICAS DEL DASHBOARD
// ===============================
const obtenerEstadisticas = async (req, res) => {
    try {
        const ahora = new Date()

        // Inicio del día actual (medianoche local)
        const inicioDia = new Date(ahora)
        inicioDia.setHours(0, 0, 0, 0)

        // Inicio de la semana (lunes)
        const iniciSemana = new Date(ahora)
        const diaSemana = iniciSemana.getDay()           // 0=dom, 1=lun…
        const diffLunes = (diaSemana === 0 ? -6 : 1 - diaSemana)
        iniciSemana.setDate(iniciSemana.getDate() + diffLunes)
        iniciSemana.setHours(0, 0, 0, 0)

        // Inicio del mes
        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)

        // Solo pedidos completados para ingresos
        const filtroBase = { estado: "completado" }

        const [dia, semana, mes, activos] = await Promise.all([
            // Ingresos del día
            Pedido.aggregate([
                { $match: { ...filtroBase, createdAt: { $gte: inicioDia } } },
                { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } }
            ]),
            // Ingresos de la semana
            Pedido.aggregate([
                { $match: { ...filtroBase, createdAt: { $gte: iniciSemana } } },
                { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } }
            ]),
            // Ingresos del mes
            Pedido.aggregate([
                { $match: { ...filtroBase, createdAt: { $gte: inicioMes } } },
                { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } }
            ]),
            // Pedidos activos (pendiente + procesando)
            Pedido.countDocuments({ estado: { $in: ["pendiente", "procesando"] } })
        ])

        res.status(200).json({
            ingresosDia:     dia[0]?.total     ?? 0,
            ingresosSemana:  semana[0]?.total  ?? 0,
            ingresosMes:     mes[0]?.total     ?? 0,
            pedidosDia:      dia[0]?.count     ?? 0,
            pedidosSemana:   semana[0]?.count  ?? 0,
            pedidosMes:      mes[0]?.count     ?? 0,
            pedidosActivos:  activos
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor" })
    }
}


// ===============================
// ACTUALIZAR PEDIDO COMPLETO
// ===============================
const actualizarPedido = async (req, res) => {
    try {
        const { id } = req.params
        const { nombreCliente, items } = req.body

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ msg: "ID no válido" })

        const pedido = await Pedido.findById(id)
        if (!pedido)
            return res.status(404).json({ msg: "Pedido no encontrado" })

        if (["completado", "cancelado"].includes(pedido.estado))
            return res.status(400).json({ msg: `No se puede editar un pedido ${pedido.estado}` })

        // Si envían items, recalcular subtotales y total
        if (items && items.length > 0) {
            for (const item of items) {
                if (!mongoose.Types.ObjectId.isValid(item.producto))
                    return res.status(400).json({ msg: `ID de producto inválido: "${item.producto}"` })
                if (!item.nombre || !item.precio || !item.cantidad)
                    return res.status(400).json({ msg: "Cada ítem requiere: producto, nombre, precio y cantidad" })
                if (item.precio <= 0 || item.cantidad < 1)
                    return res.status(400).json({ msg: "El precio debe ser > 0 y la cantidad >= 1" })
            }

            const itemsCalculados = items.map(item => ({
                ...item,
                subtotal: item.precio * item.cantidad
            }))
            const total = itemsCalculados.reduce((sum, i) => sum + i.subtotal, 0)

            pedido.items = itemsCalculados
            pedido.total = total
        }

        if (nombreCliente) pedido.nombreCliente = nombreCliente

        await pedido.save()

        const io = req.app.get("io")
        if (io) io.emit("pedidoActualizado", pedido)

        res.status(200).json({ msg: "Pedido actualizado", pedido })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor", detalle: error.message })
    }
}

// ===============================
// ELIMINAR PEDIDO
// ===============================
const eliminarPedido = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ msg: "ID no válido" })

        const pedido = await Pedido.findByIdAndDelete(id)

        if (!pedido)
            return res.status(404).json({ msg: "Pedido no encontrado" })

        const io = req.app.get("io")
        if (io) io.emit("pedidoEliminado", { _id: id })

        res.status(200).json({ msg: `Pedido #${pedido.numeroPedido} eliminado correctamente` })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor", detalle: error.message })
    }
}

export {
    crearPedido,
    obtenerPedidosActivos,
    obtenerTodosPedidos,
    actualizarEstadoPedido,
    actualizarPedido,
    eliminarPedido,
    obtenerEstadisticas
}