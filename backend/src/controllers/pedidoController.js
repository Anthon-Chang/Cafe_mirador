import Pedido   from "../models/Pedido.js"
import Usuario  from "../models/Usuarios.js"
import mongoose from "mongoose"

// ─── Constante de valor vacío (frontend lo usa cuando el campo queda sin llenar) ──
const VALOR_VACIO = "xxxxxx"
const esVacio = (v) => !v || v.trim() === "" || v.trim() === VALOR_VACIO

// ===============================
// CREAR PEDIDO
// ===============================
const crearPedido = async (req, res) => {
    try {
        const {
            nombreCliente,
            cedula,
            celular,
            direccion,
            email,
            items,
            metodoPago,
        } = req.body

        // ── Validar items ────────────────────────────────────────────────
        if (!items || items.length === 0)
            return res.status(400).json({ msg: "El pedido debe tener al menos un ítem" })

        for (const item of items) {
            if (!mongoose.Types.ObjectId.isValid(item.producto))
                return res.status(400).json({
                    msg: `ID de producto inválido: "${item.producto}". Debe ser un ObjectId de MongoDB (24 caracteres hex)`
                })
            if (!item.nombre || !item.precio || !item.cantidad)
                return res.status(400).json({ msg: "Cada ítem requiere: producto, nombre, precio y cantidad" })
            if (item.precio <= 0 || item.cantidad < 1)
                return res.status(400).json({ msg: "El precio debe ser > 0 y la cantidad >= 1" })
        }

        // ── Calcular subtotales y total ──────────────────────────────────
        const itemsCalculados = items.map(item => ({
            ...item,
            subtotal: item.precio * item.cantidad
        }))
        const total = itemsCalculados.reduce((sum, i) => sum + i.subtotal, 0)

        // ── Gestión del cliente ──────────────────────────────────────────
        // Solo intentamos vincular/crear el cliente si la cédula tiene
        // un valor real (no el placeholder "xxxxxx" ni vacío).
        let clienteId = null

        if (!esVacio(cedula)) {
            const cedulaTrimmed = cedula.trim()

            // 1. Buscar si ya existe un usuario con esa cédula
            let usuario = await Usuario.findOne({ cedula: cedulaTrimmed })

            if (usuario) {
                // 2a. Ya existe → actualizar datos de contacto si llegaron con valor real
                let modificado = false

                if (!esVacio(celular)  && usuario.celular   !== celular.trim())  { usuario.celular   = celular.trim();   modificado = true }
                if (!esVacio(direccion)&& usuario.direccion !== direccion.trim()){ usuario.direccion = direccion.trim(); modificado = true }

                // Email es unique en el modelo; solo actualizamos si no hay conflicto
                if (!esVacio(email)) {
                    const emailTrimmed = email.trim().toLowerCase()
                    if (usuario.email !== emailTrimmed) {
                        const conflicto = await Usuario.findOne({ email: emailTrimmed, _id: { $ne: usuario._id } })
                        if (!conflicto) { usuario.email = emailTrimmed; modificado = true }
                    }
                }

                if (modificado) await usuario.save()

            } else {
                // 2b. No existe → crear el cliente con los datos disponibles.
                // El modelo exige nombre, apellido, email y password.
                // Separamos el nombreCliente en nombre + apellido.
                let nombre   = nombreCliente?.trim() || "Sin nombre"
                let apellido = "—"
                if (!esVacio(nombreCliente)) {
                    const partes = nombreCliente.trim().split(" ")
                    nombre   = partes[0]
                    apellido = partes.slice(1).join(" ") || "—"
                }

                // Generamos un email sintético si no vino uno real,
                // para cumplir el requisito unique del modelo.
                const emailFinal = !esVacio(email)
                    ? email.trim().toLowerCase()
                    : `cliente.${cedulaTrimmed}@mostrador.local`

                // Verificamos que el email sintético o real no exista ya
                const emailOcupado = await Usuario.findOne({ email: emailFinal })

                if (!emailOcupado) {
                    usuario = new Usuario({
                        nombre,
                        apellido,
                        email:         emailFinal,
                        cedula:        cedulaTrimmed,
                        celular:       !esVacio(celular)   ? celular.trim()   : null,
                        direccion:     !esVacio(direccion) ? direccion.trim() : null,
                        password:      `pwd_${cedulaTrimmed}_${Date.now()}`, // hash automático por el pre-save hook
                        roles:         ["cliente"],
                        confirmarEmail:false,
                    })
                    await usuario.save()
                } else {
                    // El email ya existe pero con otra cédula: vinculamos al usuario existente
                    usuario = emailOcupado
                }
            }

            clienteId = usuario._id
        }

        // ── Guardar el pedido ────────────────────────────────────────────
        const pedido = new Pedido({
            // Referencia al documento Usuario (null si es consumidor final)
            cliente:       clienteId,

            // Snapshot histórico: se guarda en el pedido aunque el usuario
            // cambie sus datos después
            nombreCliente: !esVacio(nombreCliente) ? nombreCliente.trim() : "Consumidor Final",
            cedula:        !esVacio(cedula)        ? cedula.trim()        : null,
            celular:       !esVacio(celular)       ? celular.trim()       : null,
            direccion:     !esVacio(direccion)     ? direccion.trim()     : null,
            email:         !esVacio(email)         ? email.trim()         : null,

            items:         itemsCalculados,
            total,
            metodoPago:    metodoPago || "efectivo",
            creadoPor:     req.usuario._id,
        })

        await pedido.save()

        // Emitir evento Socket.io
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
            .populate("cliente",   "nombre apellido cedula email celular")

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
            .populate("cliente",   "nombre apellido cedula email celular")

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

        const inicioDia = new Date(ahora)
        inicioDia.setHours(0, 0, 0, 0)

        const iniciSemana = new Date(ahora)
        const diaSemana = iniciSemana.getDay()
        const diffLunes = (diaSemana === 0 ? -6 : 1 - diaSemana)
        iniciSemana.setDate(iniciSemana.getDate() + diffLunes)
        iniciSemana.setHours(0, 0, 0, 0)

        const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)

        const filtroBase = { estado: "completado" }

        const [dia, semana, mes, activos] = await Promise.all([
            Pedido.aggregate([
                { $match: { ...filtroBase, createdAt: { $gte: inicioDia } } },
                { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } }
            ]),
            Pedido.aggregate([
                { $match: { ...filtroBase, createdAt: { $gte: iniciSemana } } },
                { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } }
            ]),
            Pedido.aggregate([
                { $match: { ...filtroBase, createdAt: { $gte: inicioMes } } },
                { $group: { _id: null, total: { $sum: "$total" }, count: { $sum: 1 } } }
            ]),
            Pedido.countDocuments({ estado: { $in: ["pendiente", "procesando"] } })
        ])

        res.status(200).json({
            ingresosDia:    dia[0]?.total    ?? 0,
            ingresosSemana: semana[0]?.total ?? 0,
            ingresosMes:    mes[0]?.total    ?? 0,
            pedidosDia:     dia[0]?.count    ?? 0,
            pedidosSemana:  semana[0]?.count ?? 0,
            pedidosMes:     mes[0]?.count    ?? 0,
            pedidosActivos: activos
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
        const { nombreCliente, cedula, celular, direccion, email, items } = req.body

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ msg: "ID no válido" })

        const pedido = await Pedido.findById(id)
        if (!pedido)
            return res.status(404).json({ msg: "Pedido no encontrado" })

        if (["completado", "cancelado"].includes(pedido.estado))
            return res.status(400).json({ msg: `No se puede editar un pedido ${pedido.estado}` })

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
            pedido.items  = itemsCalculados
            pedido.total  = itemsCalculados.reduce((sum, i) => sum + i.subtotal, 0)
        }

        // Actualizar snapshot de datos del cliente en el pedido
        if (!esVacio(nombreCliente)) pedido.nombreCliente = nombreCliente.trim()
        if (!esVacio(cedula))        pedido.cedula        = cedula.trim()
        if (!esVacio(celular))       pedido.celular       = celular.trim()
        if (!esVacio(direccion))     pedido.direccion     = direccion.trim()
        if (!esVacio(email))         pedido.email         = email.trim().toLowerCase()

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