import Gasto, { CATEGORIAS } from "../models/Gasto.js"
import Pedido from "../models/Pedido.js"
import mongoose from "mongoose"

// ─── Helpers de fecha (todo en UTC — evita bugs de zona horaria) ──────────────
const fechaUTC = (input) => {
    const d = input ? new Date(input) : new Date()
    return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}
const finDeDiaUTC  = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 23, 59, 59, 999))
const finDeMesUTC  = (year, month) => new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999))
const finDeAnioUTC = (year) => new Date(Date.UTC(year, 11, 31, 23, 59, 59, 999))

// ─── Genera las ocurrencias (fecha + monto) de un gasto dentro de [desde, hasta] ──
const generarOcurrencias = (gasto, desde, hasta) => {
    const ocurrencias = []

    if (gasto.tipo === "ocasional") {
        const fecha = fechaUTC(gasto.fechaInicio)
        if (fecha >= desde && fecha <= hasta) {
            ocurrencias.push({ fecha, monto: gasto.monto, categoria: gasto.categoria })
        }
        return ocurrencias
    }

    // tipo === "fijo" → una ocurrencia por cada mes activo, en el mismo día de cobro
    // (ajustado si el mes es más corto: ej. día 31 → 28/29/30 en meses cortos)
    const inicioReal = fechaUTC(gasto.fechaInicio)
    const diaCobro    = inicioReal.getUTCDate()
    const limiteFin   = gasto.fechaFin ? fechaUTC(gasto.fechaFin) : hasta

    const inicioCursor = inicioReal > desde ? inicioReal : desde
    let cursorYear  = inicioCursor.getUTCFullYear()
    let cursorMonth = inicioCursor.getUTCMonth()

    // Tope de seguridad para no correr infinito ante datos corruptos
    for (let i = 0; i < 600; i++) {
        const inicioMes = new Date(Date.UTC(cursorYear, cursorMonth, 1))
        if (inicioMes > hasta || inicioMes > limiteFin) break

        const ultimoDiaMes   = new Date(Date.UTC(cursorYear, cursorMonth + 1, 0)).getUTCDate()
        const dia             = Math.min(diaCobro, ultimoDiaMes)
        const fechaOcurrencia = new Date(Date.UTC(cursorYear, cursorMonth, dia))

        if (
            fechaOcurrencia >= desde && fechaOcurrencia <= hasta &&
            fechaOcurrencia >= inicioReal && fechaOcurrencia <= limiteFin
        ) {
            ocurrencias.push({ fecha: fechaOcurrencia, monto: gasto.monto, categoria: gasto.categoria })
        }

        cursorMonth += 1
        if (cursorMonth > 11) { cursorMonth = 0; cursorYear += 1 }
    }

    return ocurrencias
}

const expandirGastos = async (desde, hasta) => {
    const gastos = await Gasto.find({
        fechaInicio: { $lte: hasta },
        $or: [
            { tipo: "ocasional" },
            { tipo: "fijo", fechaFin: null },
            { tipo: "fijo", fechaFin: { $gte: desde } },
        ],
    })

    const ocurrencias = []
    gastos.forEach(g => ocurrencias.push(...generarOcurrencias(g, desde, hasta)))
    return ocurrencias
}

// ===============================
// CREAR GASTO
// ===============================
const crearGasto = async (req, res) => {
    try {
        const { concepto, monto, categoria, tipo, fecha } = req.body

        if (!concepto || !monto || !tipo)
            return res.status(400).json({ msg: "Concepto, monto y tipo son obligatorios" })

        if (Number(monto) <= 0)
            return res.status(400).json({ msg: "El monto debe ser mayor a 0" })

        if (!["fijo", "ocasional"].includes(tipo))
            return res.status(400).json({ msg: "Tipo no válido" })

        if (categoria && !CATEGORIAS.includes(categoria))
            return res.status(400).json({ msg: "Categoría no válida" })

        const nuevoGasto = new Gasto({
            concepto: concepto.trim(),
            monto: Number(monto),
            categoria: categoria || "Otro",
            tipo,
            fechaInicio: fecha ? fechaUTC(fecha) : fechaUTC(),
            creadoPor: req.usuario._id,
        })

        await nuevoGasto.save()

        res.status(201).json({ msg: "Gasto registrado correctamente", gasto: nuevoGasto })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor" })
    }
}

// ===============================
// LISTAR GASTOS
// ===============================
const obtenerGastos = async (req, res) => {
    try {
        const { tipo } = req.query
        const filtro = tipo ? { tipo } : {}

        const gastos = await Gasto.find(filtro)
            .sort({ activo: -1, fechaInicio: -1 })
            .populate("creadoPor", "nombre apellido")

        res.status(200).json(gastos)

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor" })
    }
}

// ===============================
// ACTUALIZAR GASTO
// ===============================
const actualizarGasto = async (req, res) => {
    try {
        const { id } = req.params
        const { concepto, monto, categoria, fecha } = req.body

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ msg: "ID no válido" })

        const gasto = await Gasto.findById(id)
        if (!gasto)
            return res.status(404).json({ msg: "Gasto no encontrado" })

        if (monto !== undefined && Number(monto) <= 0)
            return res.status(400).json({ msg: "El monto debe ser mayor a 0" })

        if (categoria && !CATEGORIAS.includes(categoria))
            return res.status(400).json({ msg: "Categoría no válida" })

        if (concepto?.trim())    gasto.concepto    = concepto.trim()
        if (monto !== undefined) gasto.monto       = Number(monto)
        if (categoria)           gasto.categoria   = categoria
        if (fecha)               gasto.fechaInicio = fechaUTC(fecha)

        await gasto.save()

        res.status(200).json({ msg: "Gasto actualizado correctamente", gasto })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor" })
    }
}

// ===============================
// ACTIVAR / DESACTIVAR GASTO FIJO
// ===============================
const toggleGasto = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ msg: "ID no válido" })

        const gasto = await Gasto.findById(id)
        if (!gasto)
            return res.status(404).json({ msg: "Gasto no encontrado" })

        if (gasto.tipo !== "fijo")
            return res.status(400).json({ msg: "Solo los gastos fijos se pueden activar/desactivar" })

        if (gasto.activo) {
            gasto.activo = false
            gasto.fechaFin = fechaUTC()
        } else {
            gasto.activo = true
            gasto.fechaFin = null
        }

        await gasto.save()

        res.status(200).json({
            msg: gasto.activo ? "Gasto reactivado" : "Gasto desactivado. Dejará de repetirse desde este mes.",
            gasto,
        })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor" })
    }
}

// ===============================
// ELIMINAR GASTO
// ===============================
const eliminarGasto = async (req, res) => {
    try {
        const { id } = req.params

        if (!mongoose.Types.ObjectId.isValid(id))
            return res.status(400).json({ msg: "ID no válido" })

        const gasto = await Gasto.findByIdAndDelete(id)
        if (!gasto)
            return res.status(404).json({ msg: "Gasto no encontrado" })

        res.status(200).json({ msg: "Gasto eliminado correctamente" })

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor" })
    }
}

// ===============================
// RESUMEN FINANCIERO — Ingresos vs Gastos vs Ganancia
// GET /api/gastos/resumen?periodo=dia|semana|mes|anio
// ===============================
const obtenerResumenFinanciero = async (req, res) => {
    try {
        const periodo = ["dia", "semana", "mes", "anio"].includes(req.query.periodo)
            ? req.query.periodo
            : "dia"

        const hoy = fechaUTC()

        let desde, hasta, totalBuckets, claveDe, labelDe, siguienteBucket, bucketDeFecha

        if (periodo === "dia") {
            hasta = finDeDiaUTC(hoy)
            desde = new Date(hasta)
            desde.setUTCDate(desde.getUTCDate() - 29)
            desde.setUTCHours(0, 0, 0, 0)

            totalBuckets    = 30
            claveDe         = (d) => d.toISOString().slice(0, 10)
            labelDe         = (d) => d.toLocaleDateString("es-EC", { day: "2-digit", month: "short", timeZone: "UTC" })
            siguienteBucket = (d) => { const n = new Date(d); n.setUTCDate(n.getUTCDate() + 1); return n }
            bucketDeFecha   = (fecha) => claveDe(fecha)

        } else if (periodo === "semana") {
            const diaSemana   = hoy.getUTCDay()
            const diffLunes   = (diaSemana === 0 ? -6 : 1 - diaSemana)
            const lunesActual = new Date(hoy)
            lunesActual.setUTCDate(lunesActual.getUTCDate() + diffLunes)

            const domingoActual = new Date(lunesActual)
            domingoActual.setUTCDate(domingoActual.getUTCDate() + 6)
            hasta = finDeDiaUTC(domingoActual)

            desde = new Date(lunesActual)
            desde.setUTCDate(desde.getUTCDate() - 7 * 11)

            totalBuckets    = 12
            claveDe         = (d) => d.toISOString().slice(0, 10)
            labelDe         = (d) => d.toLocaleDateString("es-EC", { day: "2-digit", month: "short", timeZone: "UTC" })
            siguienteBucket = (d) => { const n = new Date(d); n.setUTCDate(n.getUTCDate() + 7); return n }
            bucketDeFecha   = (fecha) => {
                const d = new Date(fecha)
                const dow = d.getUTCDay()
                d.setUTCDate(d.getUTCDate() + (dow === 0 ? -6 : 1 - dow))
                d.setUTCHours(0, 0, 0, 0)
                return claveDe(d)
            }

        } else if (periodo === "mes") {
            desde = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth() - 11, 1))
            hasta = finDeMesUTC(hoy.getUTCFullYear(), hoy.getUTCMonth())

            totalBuckets    = 12
            claveDe         = (d) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`
            labelDe         = (d) => d.toLocaleDateString("es-EC", { month: "short", year: "2-digit", timeZone: "UTC" })
            siguienteBucket = (d) => new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))
            bucketDeFecha   = (fecha) => claveDe(fecha)

        } else {
            desde = new Date(Date.UTC(hoy.getUTCFullYear() - 4, 0, 1))
            hasta = finDeAnioUTC(hoy.getUTCFullYear())

            totalBuckets    = 5
            claveDe         = (d) => `${d.getUTCFullYear()}`
            labelDe         = (d) => `${d.getUTCFullYear()}`
            siguienteBucket = (d) => new Date(Date.UTC(d.getUTCFullYear() + 1, 0, 1))
            bucketDeFecha   = (fecha) => claveDe(fecha)
        }

        const filas = []
        let cursor = new Date(desde)
        for (let i = 0; i < totalBuckets; i++) {
            filas.push({ clave: claveDe(cursor), label: labelDe(cursor), ingresos: 0, gastos: 0 })
            cursor = siguienteBucket(cursor)
        }
        const indiceClave = {}
        filas.forEach((f, i) => { indiceClave[f.clave] = i })

        const pedidos = await Pedido.find({
            estado: "completado",
            createdAt: { $gte: desde, $lte: hasta },
        }).select("total createdAt")

        pedidos.forEach(p => {
            const idx = indiceClave[bucketDeFecha(p.createdAt)]
            if (idx !== undefined) filas[idx].ingresos += p.total
        })

        const ocurrencias = await expandirGastos(desde, hasta)
        ocurrencias.forEach(o => {
            const idx = indiceClave[bucketDeFecha(o.fecha)]
            if (idx !== undefined) filas[idx].gastos += o.monto
        })

        const datos = filas.map(f => ({
            label:    f.label,
            ingresos: Math.round(f.ingresos * 100) / 100,
            gastos:   Math.round(f.gastos * 100) / 100,
            ganancia: Math.round((f.ingresos - f.gastos) * 100) / 100,
        }))

        res.status(200).json({ periodo, datos })

    } catch (error) {
        console.error("ERROR RESUMEN FINANCIERO:", error)
        res.status(500).json({ msg: "❌ Error en el servidor", detalle: error.message })
    }
}

// ===============================
// GASTOS POR CATEGORÍA (mes actual)
// ===============================
const obtenerGastosPorCategoria = async (req, res) => {
    try {
        const hoy   = fechaUTC()
        const desde = new Date(Date.UTC(hoy.getUTCFullYear(), hoy.getUTCMonth(), 1))
        const hasta = finDeMesUTC(hoy.getUTCFullYear(), hoy.getUTCMonth())

        const ocurrencias = await expandirGastos(desde, hasta)

        const porCategoria = {}
        ocurrencias.forEach(o => {
            porCategoria[o.categoria] = (porCategoria[o.categoria] ?? 0) + o.monto
        })

        const resultado = Object.entries(porCategoria)
            .map(([categoria, total]) => ({ categoria, total: Math.round(total * 100) / 100 }))
            .sort((a, b) => b.total - a.total)

        res.status(200).json(resultado)

    } catch (error) {
        console.error(error)
        res.status(500).json({ msg: "❌ Error en el servidor" })
    }
}

export {
    crearGasto,
    obtenerGastos,
    actualizarGasto,
    toggleGasto,
    eliminarGasto,
    obtenerResumenFinanciero,
    obtenerGastosPorCategoria,
}