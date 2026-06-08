import PropTypes                              from "prop-types"
import { useState, useEffect, useCallback }  from "react"
import {
    FiSearch, FiEye, FiEdit2, FiTrash2, FiPlus,
    FiCheckCircle, FiRefreshCw, FiAlertCircle,
    FiShoppingBag, FiClock, FiX, FiMinus,
    FiDollarSign, FiCoffee, FiChevronDown, FiChevronUp,
    FiUser, FiHash, FiPhone, FiMapPin, FiMail
} from "react-icons/fi"
import { pedidosService }  from "../../services/pedidosService"
import { useProductos }    from "../../hooks/useProductos"
import { apiFetch }        from "../../services/api"
import { formatMoney }     from "../../utils/formatters"
import { Toast }           from "../../components/ui/Toast"
import { ConfirmModal }    from "../../components/ui/ConfirmModal"

// ─── Utilidades ──────────────────────────────────────────────────────────────
const formatFecha = (iso) => {
    if (!iso) return "—"
    const d = new Date(iso)
    const hoy = new Date()
    const esHoy = d.toDateString() === hoy.toDateString()
    const hora  = d.toLocaleTimeString("es-EC", { hour: "2-digit", minute: "2-digit" })
    return esHoy ? `Hoy, ${hora}` : d.toLocaleDateString("es-EC", { day: "2-digit", month: "short" }) + ` ${hora}`
}

const esAntiguo = (iso) => {
    if (!iso) return false
    return (Date.now() - new Date(iso).getTime()) > 2 * 60 * 60 * 1000  // > 2 horas
}

const resumenItems = (items = []) =>
    items.map(i => `${i.cantidad}x ${i.nombre}`).join(", ")

// ─── Badge de estado ─────────────────────────────────────────────────────────
function EstadoBadge({ estado }) {
    const cfg = {
        pendiente:  { cls: "bg-amber-50 text-amber-600 border-amber-200",   label: "Pendiente"  },
        procesando: { cls: "bg-primary/10 text-primary border-primary/20",  label: "Procesando" },
        completado: { cls: "bg-green-50 text-green-600 border-green-200",   label: "Completado" },
        cancelado:  { cls: "bg-red-50 text-red-500 border-red-200",         label: "Cancelado"  },
    }
    const { cls, label } = cfg[estado] ?? cfg.pendiente
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs
                          font-sans font-bold border ${cls}`}>
            {label}
        </span>
    )
}
EstadoBadge.propTypes = { estado: PropTypes.string.isRequired }

// ─── Modal: Ver detalle ───────────────────────────────────────────────────────
function ModalDetalle({ pedido, onClose }) {
    if (!pedido) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg
                            max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#dbe6e6]">
                    <div>
                        <h3 className="font-sans font-extrabold text-lg text-slate-800">
                            Pedido #{pedido.numeroPedido}
                        </h3>
                        <p className="font-sans text-xs text-slate-400 mt-0.5">
                            {pedido.nombreCliente} · {formatFecha(pedido.createdAt)}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <EstadoBadge estado={pedido.estado} />
                        <button onClick={onClose}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg
                                       hover:bg-slate-100 transition-colors">
                            <FiX />
                        </button>
                    </div>
                </div>

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
                    {pedido.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between py-3
                                                   border-b border-slate-100 last:border-0">
                            <div>
                                <p className="font-sans font-semibold text-sm text-slate-800">
                                    {item.nombre}
                                </p>
                                <p className="font-sans text-xs text-slate-400 mt-0.5">
                                    {formatMoney(item.precio)} × {item.cantidad}
                                </p>
                            </div>
                            <span className="font-sans font-bold text-sm text-slate-800">
                                {formatMoney(item.precio * item.cantidad)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Footer total */}
                <div className="px-6 py-4 bg-[#f5f8f8] border-t border-[#dbe6e6]
                                flex justify-between items-center">
                    <span className="font-sans font-bold text-slate-800">Total</span>
                    <span className="font-sans text-2xl font-black text-primary">
                        {formatMoney(pedido.total)}
                    </span>
                </div>
            </div>
        </div>
    )
}
ModalDetalle.propTypes = {
    pedido:  PropTypes.object,
    onClose: PropTypes.func.isRequired,
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
// Detecta si un campo tiene datos reales (no vacío ni "xxxxxx")
const tieneData = (v) => v && v.trim() !== "" && v.trim() !== "xxxxxx"

// ─── Modal: Editar pedido (productos + datos del cliente) ────────────────────
function ModalEditar({ pedido, onClose, onGuardar, guardando }) {
    // ── Estado productos ──────────────────────────────────────────────────
    const [items,           setItems]           = useState(pedido?.items?.map(i => ({ ...i })) ?? [])
    const [mostrarCatalogo, setMostrarCatalogo] = useState(false)
    const [busqProd,        setBusqProd]        = useState("")

    // ── Estado cliente ────────────────────────────────────────────────────
    const yaConDatos = tieneData(pedido?.nombreCliente)
    const [conDatos,   setConDatos]   = useState(yaConDatos)
    const [nombre,     setNombre]     = useState(tieneData(pedido?.nombreCliente) ? pedido.nombreCliente : "")
    const [cedula,     setCedula]     = useState(tieneData(pedido?.cedula)        ? pedido.cedula        : "")
    const [telefono,   setTelefono]   = useState(tieneData(pedido?.celular)       ? pedido.celular       : "")
    const [direccion,  setDireccion]  = useState(tieneData(pedido?.direccion)     ? pedido.direccion     : "")
    const [email,      setEmail]      = useState(tieneData(pedido?.email)         ? pedido.email         : "")

    // ── Autocompletado por cédula ─────────────────────────────────────────
    const [buscandoCedula,     setBuscandoCedula]     = useState(false)
    const [cedulaEncontrada,   setCedulaEncontrada]   = useState(false)
    const [cedulaNoEncontrada, setCedulaNoEncontrada] = useState(false)

    const buscarPorCedula = async () => {
        const c = cedula.trim()
        if (!c) return
        try {
            setBuscandoCedula(true)
            setCedulaEncontrada(false)
            setCedulaNoEncontrada(false)
            const usuario = await apiFetch(`/api/user/buscar/${c}`)
            setNombre(`${usuario.nombre} ${usuario.apellido}`)
            setTelefono(usuario.celular   ?? "")
            setDireccion(usuario.direccion ?? "")
            setEmail(usuario.email        ?? "")
            setCedulaEncontrada(true)
            setConDatos(true)
        } catch {
            setCedulaNoEncontrada(true)   // ← activa el feedback de no encontrado
        } finally {
            setBuscandoCedula(false)
        }
    }

    const handleCedulaKeyDown = (e) => {
        if (e.key === "Enter") { e.preventDefault(); buscarPorCedula() }
    }
    const handleCedulaChange = (e) => {
        setCedula(e.target.value)
        setCedulaEncontrada(false)
        setCedulaNoEncontrada(false)   // resetea al escribir de nuevo
    }

    const { productos, loading: loadingProds } = useProductos()

    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(busqProd.toLowerCase()) &&
        !items.some(i => String(i.producto) === String(p._id))
    )

    // ── Handlers productos ────────────────────────────────────────────────
    const cambiarCantidad = (idx, delta) =>
        setItems(prev => prev.map((item, i) => {
            if (i !== idx) return item
            const nueva = item.cantidad + delta
            return nueva < 1 ? item : { ...item, cantidad: nueva }
        }))

    const eliminarItem = (idx) => setItems(prev => prev.filter((_, i) => i !== idx))

    const agregarProducto = (prod) => {
        setItems(prev => [...prev, {
            producto: prod._id,
            nombre:   prod.nombre,
            precio:   prod.precio,
            cantidad: 1,
            subtotal: prod.precio,
        }])
        setBusqProd("")
        setMostrarCatalogo(false)
    }

    // ── Guardar: construye payload completo ───────────────────────────────
    const handleGuardar = () => {
        const clientePayload = conDatos
            ? {
                nombreCliente: nombre.trim()   || "xxxxxx",
                cedula:        cedula.trim()    || "xxxxxx",
                celular:       telefono.trim()  || "xxxxxx",
                direccion:     direccion.trim() || "xxxxxx",
                email:         email.trim()     || "xxxxxx",
              }
            : {
                nombreCliente: "xxxxxx",
                cedula:        "xxxxxx",
                celular:       "xxxxxx",
                direccion:     "xxxxxx",
                email:         "xxxxxx",
              }
        onGuardar(pedido._id, items, clientePayload)
    }

    const total = items.reduce((a, i) => a + i.precio * i.cantidad, 0)

    if (!pedido) return null
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative z-10 bg-white rounded-2xl shadow-2xl w-full max-w-lg
                            max-h-[90vh] flex flex-col overflow-hidden">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-[#dbe6e6]">
                    <div>
                        <h3 className="font-sans font-extrabold text-lg text-slate-800">
                            Editar Pedido #{pedido.numeroPedido}
                        </h3>
                        <p className="font-sans text-xs text-slate-400 mt-0.5">
                            Modifica productos y datos del cliente
                        </p>
                    </div>
                    <button onClick={onClose}
                        className="text-slate-400 hover:text-slate-600 p-1 rounded-lg
                                   hover:bg-slate-100 transition-colors">
                        <FiX />
                    </button>
                </div>

                {/* Cuerpo scrollable */}
                <div className="flex-1 overflow-y-auto">

                    {/* ── Sección: Datos del Cliente ── */}
                    <div className="px-6 pt-5 pb-4 border-b border-[#dbe6e6]">

                        {/* Toggle */}
                        <button
                            onClick={() => setConDatos(v => !v)}
                            className="w-full flex items-center justify-between group"
                        >
                            <div className="flex items-center gap-2.5">
                                <FiUser className={`text-base transition-colors
                                    ${conDatos ? "text-primary" : "text-slate-400"}`} />
                                <span className="font-sans font-semibold text-sm text-slate-700">
                                    Facturar con datos del cliente
                                </span>
                            </div>
                            <div className={`relative w-11 h-6 rounded-full transition-colors duration-200
                                            ${conDatos ? "bg-primary" : "bg-slate-200"}`}>
                                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow
                                                transition-all duration-200
                                                ${conDatos ? "left-[22px]" : "left-0.5"}`} />
                            </div>
                        </button>

                        {/* Campos — animados con max-height */}
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out
                                        ${conDatos ? "max-h-[600px] mt-4 opacity-100" : "max-h-0 opacity-0"}`}>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                {/* Cédula / RUC — PRIMERO para permitir autocompletado */}
                                <label className="flex flex-col gap-1 sm:col-span-2">
                                    <span className="font-sans text-xs font-semibold text-slate-500
                                                     uppercase tracking-wider flex items-center gap-2">
                                        Cédula / RUC
                                        {cedulaEncontrada && (
                                            <span className="inline-flex items-center gap-1 text-xs font-sans
                                                             font-semibold text-green-600 bg-green-50
                                                             border border-green-200 px-2 py-0.5 rounded-full
                                                             normal-case tracking-normal">
                                                <FiCheckCircle className="text-xs" /> Cliente encontrado
                                            </span>
                                        )}
                                        {cedulaNoEncontrada && (
                                            <span className="inline-flex items-center gap-1 text-xs font-sans
                                                             font-semibold text-red-500 bg-red-50
                                                             border border-red-200 px-2 py-0.5 rounded-full
                                                             normal-case tracking-normal">
                                                <FiAlertCircle className="text-xs" /> Cliente no encontrado
                                            </span>
                                        )}
                                    </span>
                                    <div className="relative">
                                        <FiHash className="absolute left-3 top-1/2 -translate-y-1/2
                                                           text-slate-400 text-sm" />
                                        <input
                                            type="text"
                                            value={cedula}
                                            onChange={handleCedulaChange}
                                            onKeyDown={handleCedulaKeyDown}
                                            placeholder="1712345678 — Enter para buscar"
                                            className={`w-full pl-9 pr-9 h-10 rounded-xl border font-sans
                                                       text-sm text-slate-800 placeholder-slate-400
                                                       focus:outline-none focus:ring-2 transition-all
                                                       ${cedulaEncontrada
                                                           ? "border-green-300 focus:ring-green-200 focus:border-green-400"
                                                           : cedulaNoEncontrada
                                                               ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                                                               : "border-[#dbe6e6] focus:ring-primary/25 focus:border-primary"
                                                       }`}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                            {buscandoCedula
                                                ? <FiRefreshCw className="text-slate-400 animate-spin text-sm" />
                                                : cedulaEncontrada
                                                    ? <FiCheckCircle className="text-green-500 text-sm" />
                                                    : cedulaNoEncontrada
                                                        ? <FiAlertCircle className="text-red-400 text-sm" />
                                                        : null
                                            }
                                        </div>
                                    </div>
                                    <p className="font-sans text-xs text-slate-400">
                                        Presiona{" "}
                                        <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border
                                                        border-slate-200 font-sans text-xs text-slate-500">
                                            Enter
                                        </kbd>
                                        {" "}para autocompletar si el cliente ya está registrado
                                    </p>
                                </label>

                                {/* Nombre / Razón Social */}
                                <label className="flex flex-col gap-1 sm:col-span-2">
                                    <span className="font-sans text-xs font-semibold text-slate-500
                                                     uppercase tracking-wider">
                                        Nombre / Razón Social
                                    </span>
                                    <div className="relative">
                                        <FiUser className="absolute left-3 top-1/2 -translate-y-1/2
                                                           text-slate-400 text-sm" />
                                        <input
                                            type="text"
                                            value={nombre}
                                            onChange={e => setNombre(e.target.value)}
                                            placeholder="Juan Pérez"
                                            className="w-full pl-9 pr-3 h-10 rounded-xl border border-[#dbe6e6]
                                                       font-sans text-sm text-slate-800 placeholder-slate-400
                                                       focus:outline-none focus:ring-2 focus:ring-primary/25
                                                       focus:border-primary transition-all"
                                        />
                                    </div>
                                </label>

                                {/* Teléfono */}
                                <label className="flex flex-col gap-1">
                                    <span className="font-sans text-xs font-semibold text-slate-500
                                                     uppercase tracking-wider">
                                        Teléfono
                                    </span>
                                    <div className="relative">
                                        <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2
                                                            text-slate-400 text-sm" />
                                        <input
                                            type="tel"
                                            value={telefono}
                                            onChange={e => setTelefono(e.target.value)}
                                            placeholder="+593 99 000 0000"
                                            className="w-full pl-9 pr-3 h-10 rounded-xl border border-[#dbe6e6]
                                                       font-sans text-sm text-slate-800 placeholder-slate-400
                                                       focus:outline-none focus:ring-2 focus:ring-primary/25
                                                       focus:border-primary transition-all"
                                        />
                                    </div>
                                </label>

                                {/* Email */}
                                <label className="flex flex-col gap-1">
                                    <span className="font-sans text-xs font-semibold text-slate-500
                                                     uppercase tracking-wider">
                                        Email
                                    </span>
                                    <div className="relative">
                                        <FiMail className="absolute left-3 top-1/2 -translate-y-1/2
                                                           text-slate-400 text-sm" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={e => setEmail(e.target.value)}
                                            placeholder="correo@ejemplo.com"
                                            className="w-full pl-9 pr-3 h-10 rounded-xl border border-[#dbe6e6]
                                                       font-sans text-sm text-slate-800 placeholder-slate-400
                                                       focus:outline-none focus:ring-2 focus:ring-primary/25
                                                       focus:border-primary transition-all"
                                        />
                                    </div>
                                </label>

                                {/* Dirección */}
                                <label className="flex flex-col gap-1 sm:col-span-2">
                                    <span className="font-sans text-xs font-semibold text-slate-500
                                                     uppercase tracking-wider">
                                        Dirección
                                    </span>
                                    <div className="relative">
                                        <FiMapPin className="absolute left-3 top-1/2 -translate-y-1/2
                                                             text-slate-400 text-sm" />
                                        <input
                                            type="text"
                                            value={direccion}
                                            onChange={e => setDireccion(e.target.value)}
                                            placeholder="Av. Central #123, Ciudad"
                                            className="w-full pl-9 pr-3 h-10 rounded-xl border border-[#dbe6e6]
                                                       font-sans text-sm text-slate-800 placeholder-slate-400
                                                       focus:outline-none focus:ring-2 focus:ring-primary/25
                                                       focus:border-primary transition-all"
                                        />
                                    </div>
                                </label>
                            </div>
                        </div>

                        {/* Etiqueta cuando toggle está OFF */}
                        {!conDatos && (
                            <p className="font-sans text-xs text-slate-400 mt-2">
                                Se registrará como{" "}
                                <span className="font-semibold text-slate-500">Consumidor Final</span>
                            </p>
                        )}
                    </div>

                    {/* ── Sección: Productos ── */}
                    <div className="px-6 py-4 space-y-1">

                        {items.length === 0 ? (
                            <p className="font-sans text-sm text-slate-400 text-center py-4">
                                Sin productos — agrega al menos uno
                            </p>
                        ) : items.map((item, idx) => (
                            <div key={idx}
                                 className="flex items-center gap-3 py-3 border-b border-slate-100
                                            last:border-0 group">
                                <div className="flex-1 min-w-0">
                                    <p className="font-sans font-semibold text-sm text-slate-800 truncate">
                                        {item.nombre}
                                    </p>
                                    <p className="font-sans text-xs text-slate-400">
                                        {formatMoney(item.precio)} c/u
                                    </p>
                                </div>

                                <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-1">
                                    <button onClick={() => cambiarCantidad(idx, -1)}
                                        className="w-7 h-7 flex items-center justify-center rounded-md
                                                   text-slate-600 hover:bg-white hover:text-red-500 transition-all">
                                        <FiMinus className="text-xs" />
                                    </button>
                                    <span className="font-sans font-black text-sm text-slate-800 w-6 text-center">
                                        {item.cantidad}
                                    </span>
                                    <button onClick={() => cambiarCantidad(idx, 1)}
                                        className="w-7 h-7 flex items-center justify-center rounded-md
                                                   text-slate-600 hover:bg-white hover:text-primary transition-all">
                                        <FiPlus className="text-xs" />
                                    </button>
                                </div>

                                <span className="font-sans font-bold text-sm text-slate-800 w-16 text-right">
                                    {formatMoney(item.precio * item.cantidad)}
                                </span>

                                <button onClick={() => eliminarItem(idx)}
                                    className="p-1.5 rounded-lg text-slate-300 hover:text-red-500
                                               hover:bg-red-50 transition-all opacity-0 group-hover:opacity-100">
                                    <FiTrash2 className="text-sm" />
                                </button>
                            </div>
                        ))}

                        {/* Panel agregar producto */}
                        <div className="pt-2">
                            <button
                                onClick={() => { setMostrarCatalogo(v => !v); setBusqProd("") }}
                                className="w-full flex items-center justify-between px-4 py-2.5
                                           rounded-xl border border-dashed border-primary/40 text-primary
                                           font-sans font-semibold text-sm hover:bg-primary/5 transition-all">
                                <span className="flex items-center gap-2">
                                    <FiPlus className="text-base" />
                                    Agregar producto al pedido
                                </span>
                                {mostrarCatalogo
                                    ? <FiChevronUp className="text-base" />
                                    : <FiChevronDown className="text-base" />
                                }
                            </button>

                            {mostrarCatalogo && (
                                <div className="mt-2 rounded-xl border border-[#dbe6e6] overflow-hidden">
                                    <div className="px-3 py-2 border-b border-[#dbe6e6] bg-[#f5f8f8]">
                                        <div className="relative">
                                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2
                                                                 text-slate-400 text-xs" />
                                            <input
                                                type="text"
                                                value={busqProd}
                                                onChange={e => setBusqProd(e.target.value)}
                                                placeholder="Buscar en el menú..."
                                                autoFocus
                                                className="w-full pl-8 pr-3 h-8 rounded-lg border
                                                           border-[#dbe6e6] bg-white font-sans text-xs
                                                           text-slate-800 placeholder-slate-400
                                                           focus:outline-none focus:ring-2
                                                           focus:ring-primary/25 focus:border-primary
                                                           transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="max-h-44 overflow-y-auto divide-y divide-[#dbe6e6]">
                                        {loadingProds ? (
                                            <div className="flex items-center justify-center py-6 gap-2 text-slate-400">
                                                <FiRefreshCw className="animate-spin text-sm" />
                                                <span className="font-sans text-xs">Cargando menú...</span>
                                            </div>
                                        ) : productosFiltrados.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center
                                                            py-6 gap-1 text-slate-400">
                                                <FiCoffee className="text-xl text-slate-200" />
                                                <span className="font-sans text-xs">
                                                    {busqProd ? "Sin resultados" : "Todos los productos ya están en el pedido"}
                                                </span>
                                            </div>
                                        ) : productosFiltrados.map(prod => (
                                            <button key={prod._id}
                                                onClick={() => agregarProducto(prod)}
                                                className="w-full flex items-center justify-between
                                                           px-4 py-2.5 hover:bg-primary/5 transition-colors
                                                           text-left group/prod">
                                                <span className="font-sans font-medium text-sm text-slate-700
                                                                 group-hover/prod:text-primary truncate transition-colors">
                                                    {prod.nombre}
                                                </span>
                                                <span className="font-sans font-bold text-sm text-primary ml-3 shrink-0">
                                                    {formatMoney(prod.precio)}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 bg-[#f5f8f8] border-t border-[#dbe6e6] space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="font-sans font-bold text-slate-800">Total</span>
                        <span className="font-sans text-2xl font-black text-primary">
                            {formatMoney(total)}
                        </span>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600
                                       font-sans font-semibold text-sm hover:bg-slate-50 transition-colors">
                            Cancelar
                        </button>
                        <button
                            onClick={handleGuardar}
                            disabled={guardando || items.length === 0}
                            className="flex-1 py-2.5 rounded-xl bg-primary text-white font-sans
                                       font-semibold text-sm hover:bg-primary/90 transition-colors
                                       disabled:opacity-50 disabled:cursor-not-allowed flex items-center
                                       justify-center gap-2">
                            {guardando
                                ? <><FiRefreshCw className="animate-spin text-sm" /> Guardando...</>
                                : <><FiCheckCircle className="text-sm" /> Guardar cambios</>
                            }
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

ModalEditar.propTypes = {
    pedido:    PropTypes.object,
    onClose:   PropTypes.func.isRequired,
    onGuardar: PropTypes.func.isRequired,
    guardando: PropTypes.bool.isRequired,
}

// ─── Fila de la tabla ────────────────────────────────────────────────────────
function FilaPedido({ pedido, onVer, onEditar, onCobrar, onEliminar }) {
    const antiguo = esAntiguo(pedido.createdAt)

    return (
        <>
            <tr className="group hover:bg-[#f5f8f8] transition-colors border-b border-[#dbe6e6]">
                {/* Número */}
                <td className="px-6 py-5">
                    <span className="font-sans font-semibold text-slate-400 text-sm">
                        #{pedido.numeroPedido}
                    </span>
                </td>

                {/* Cliente */}
                <td className="px-6 py-5">
                    <div className="flex flex-col">
                        <span className="font-sans font-semibold text-sm text-slate-800">
                            {pedido.nombreCliente}
                        </span>
                        {pedido.cedula && (
                            <span className="font-sans text-xs text-slate-400 mt-0.5">
                                ID: {pedido.cedula}
                            </span>
                        )}
                    </div>
                </td>

                {/* Fecha */}
                <td className="px-6 py-5">
                    {antiguo ? (
                        <span className="flex items-center gap-1.5 font-sans text-sm
                                         text-red-500 font-semibold">
                            <FiAlertCircle className="text-base shrink-0" />
                            {formatFecha(pedido.createdAt)}
                        </span>
                    ) : (
                        <span className="font-sans text-sm text-slate-600 flex items-center gap-1.5">
                            <FiClock className="text-slate-400 text-sm shrink-0" />
                            {formatFecha(pedido.createdAt)}
                        </span>
                    )}
                </td>

                {/* Resumen */}
                <td className="px-6 py-5 max-w-xs">
                    <p className="font-sans text-sm text-slate-600 truncate">
                        {resumenItems(pedido.items)}
                    </p>
                </td>

                {/* Total */}
                <td className="px-6 py-5">
                    <span className="font-sans font-black text-base text-primary">
                        {formatMoney(pedido.total)}
                    </span>
                </td>

                {/* Estado */}
                <td className="px-6 py-5">
                    <EstadoBadge estado={pedido.estado} />
                </td>

                {/* Acciones */}
                <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-1.5 flex-wrap">
                        {/* Ver */}
                        <button onClick={() => onVer(pedido)}
                            title="Ver detalle"
                            className="flex items-center gap-1 px-2.5 py-1.5 border border-primary/40
                                       text-primary rounded-lg hover:bg-primary hover:text-white
                                       transition-all text-xs font-sans font-semibold whitespace-nowrap">
                            <FiEye className="text-sm" />
                            <span className="hidden xl:inline">Ver</span>
                        </button>

                        {/* Editar */}
                        <button onClick={() => onEditar(pedido)}
                            title="Editar cantidades"
                            className="flex items-center gap-1 px-2.5 py-1.5 border border-slate-200
                                       text-slate-600 rounded-lg hover:bg-slate-100 transition-all
                                       text-xs font-sans font-semibold whitespace-nowrap">
                            <FiEdit2 className="text-sm" />
                            <span className="hidden xl:inline">Editar</span>
                        </button>

                        {/* Cobrar */}
                        <button onClick={() => onCobrar(pedido)}
                            title="Cobrar pedido"
                            className="flex items-center gap-1 px-2.5 py-1.5 bg-secondary
                                       text-slate-900 rounded-lg hover:bg-yellow-400 transition-all
                                       text-xs font-sans font-bold shadow-sm whitespace-nowrap">
                            <FiDollarSign className="text-sm" />
                            <span className="hidden xl:inline">Cobrar</span>
                        </button>

                        {/* Eliminar */}
                        <button onClick={() => onEliminar(pedido)}
                            title="Eliminar pedido"
                            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50
                                       rounded-lg transition-all">
                            <FiTrash2 className="text-sm" />
                        </button>
                    </div>
                </td>
            </tr>

        </>
    )
}

FilaPedido.propTypes = {
    pedido:    PropTypes.object.isRequired,
    onVer:     PropTypes.func.isRequired,
    onEditar:  PropTypes.func.isRequired,
    onCobrar:  PropTypes.func.isRequired,
    onEliminar:PropTypes.func.isRequired,
}

// ─── Página principal ─────────────────────────────────────────────────────────
export function GestionPedidosPage() {
    // Datos
    const [pedidos,   setPedidos]   = useState([])
    const [loading,   setLoading]   = useState(true)
    const [busqueda,  setBusqueda]  = useState("")

    // Modales
    const [modalDetalle, setModalDetalle] = useState(null)  // pedido o null
    const [modalEditar,  setModalEditar]  = useState(null)  // pedido o null
    const [guardando,    setGuardando]    = useState(false)

    // Confirm modal (cobrar / eliminar)
    const [confirm, setConfirm] = useState({
        open: false, titulo: "", mensaje: "", onConfirm: null,
        danger: true, loading: false
    })

    // Toast
    const [toast, setToast] = useState({ type: "success", message: "" })
    const showToast = (type, message) => setToast({ type, message })

    // ── Cargar pedidos activos ────────────────────────────────────────────
    const cargarPedidos = useCallback(async () => {
        try {
            setLoading(true)
            const data = await pedidosService.getActivos()
            setPedidos(data)
        } catch {
            showToast("error", "No se pudo cargar los pedidos")
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => { cargarPedidos() }, [cargarPedidos])

    // ── Filtro por búsqueda ───────────────────────────────────────────────
    const pedidosFiltrados = pedidos.filter(p => {
        const q = busqueda.toLowerCase()
        return (
            String(p.numeroPedido).includes(q) ||
            p.nombreCliente?.toLowerCase().includes(q) ||
            p.cedula?.includes(q)
        )
    })

    // ── Cobrar pedido ─────────────────────────────────────────────────────
    const handleCobrar = (pedido) => {
        setConfirm({
            open:    true,
            titulo:  `Cobrar pedido #${pedido.numeroPedido}`,
            mensaje: `¿Confirmas que el cliente "${pedido.nombreCliente}" ya pagó ${formatMoney(pedido.total)}? El pedido desaparecerá de esta vista.`,
            danger:  false,
            loading: false,
            onConfirm: async () => {
                setConfirm(p => ({ ...p, loading: true }))
                try {
                    await pedidosService.actualizarEstado(pedido._id, "completado")
                    setPedidos(prev => prev.filter(p => p._id !== pedido._id))
                    showToast("success", `Pedido #${pedido.numeroPedido} cobrado correctamente`)
                } catch {
                    showToast("error", "No se pudo actualizar el estado")
                } finally {
                    setConfirm(p => ({ ...p, open: false, loading: false }))
                }
            }
        })
    }

    // ── Eliminar pedido ───────────────────────────────────────────────────
    const handleEliminar = (pedido) => {
        setConfirm({
            open:    true,
            titulo:  `Eliminar pedido #${pedido.numeroPedido}`,
            mensaje: `Esta acción es irreversible. ¿Deseas eliminar el pedido de "${pedido.nombreCliente}"?`,
            danger:  true,
            loading: false,
            onConfirm: async () => {
                setConfirm(p => ({ ...p, loading: true }))
                try {
                    await pedidosService.eliminar(pedido._id)
                    setPedidos(prev => prev.filter(p => p._id !== pedido._id))
                    showToast("success", `Pedido #${pedido.numeroPedido} eliminado`)
                } catch {
                    showToast("error", "No se pudo eliminar el pedido")
                } finally {
                    setConfirm(p => ({ ...p, open: false, loading: false }))
                }
            }
        })
    }

    // ── Guardar edición (items + datos cliente) ───────────────────────────
    const handleGuardarEdicion = async (pedidoId, items, cliente) => {
        try {
            setGuardando(true)
            const { pedido } = await pedidosService.actualizar(pedidoId, { items, ...cliente })
            setPedidos(prev => prev.map(p => p._id === pedidoId ? pedido : p))
            setModalEditar(null)
            showToast("success", "Pedido actualizado correctamente")
        } catch {
            showToast("error", "No se pudo actualizar el pedido")
        } finally {
            setGuardando(false)
        }
    }

    // ── Estadísticas rápidas de cabecera ──────────────────────────────────
    const totalPendientes  = pedidos.filter(p => p.estado === "pendiente").length
    const totalProcesando  = pedidos.filter(p => p.estado === "procesando").length
    const totalAntiguo     = pedidos.filter(p => esAntiguo(p.createdAt)).length
    const sumaPendiente    = pedidos.reduce((a, p) => a + (p.total ?? 0), 0)

    return (
        <div className="space-y-6">

            {/* Toast */}
            <Toast type={toast.type} message={toast.message}
                   onClose={() => setToast(p => ({ ...p, message: "" }))} />

            {/* Confirm modal */}
            <ConfirmModal
                open={confirm.open}
                title={confirm.titulo}
                message={confirm.mensaje}
                danger={confirm.danger}
                loading={confirm.loading}
                confirmLabel={confirm.danger ? "Eliminar" : "Confirmar cobro"}
                onConfirm={confirm.onConfirm ?? (() => {})}
                onCancel={() => setConfirm(p => ({ ...p, open: false }))}
            />

            {/* Modales */}
            <ModalDetalle pedido={modalDetalle} onClose={() => setModalDetalle(null)} />
            <ModalEditar
                key={modalEditar?._id}
                pedido={modalEditar}
                onClose={() => setModalEditar(null)}
                onGuardar={handleGuardarEdicion}
                guardando={guardando}
            />

            {/* ── Cabecera ── */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                    <h1 className="font-sans text-2xl font-extrabold tracking-tight text-slate-800">
                        Gestión de Pedidos
                    </h1>
                    <p className="font-sans text-sm text-slate-400 mt-1">
                        Pedidos pendientes de cobro — solo activos e en proceso
                    </p>
                </div>

                {/* Buscador */}
                <div className="relative w-full max-w-xs">
                    <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-sm" />
                    <input
                        type="text"
                        value={busqueda}
                        onChange={e => setBusqueda(e.target.value)}
                        placeholder="Nombre, cédula o # pedido..."
                        className="w-full pl-10 pr-4 h-11 rounded-xl border border-[#dbe6e6]
                                   bg-white font-sans text-sm text-slate-800 placeholder-slate-400
                                   focus:outline-none focus:ring-2 focus:ring-primary/25
                                   focus:border-primary transition-all shadow-sm"
                    />
                </div>
            </div>

            {/* ── Tarjetas de estadísticas ── */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                    { label: "Pendientes",  value: totalPendientes,              icon: <FiClock />,        color: "text-amber-500",  bg: "bg-amber-50"  },
                    { label: "Procesando",  value: totalProcesando,              icon: <FiRefreshCw />,    color: "text-primary",    bg: "bg-primary/10"},
                    { label: "Con retraso", value: totalAntiguo,                 icon: <FiAlertCircle />,  color: "text-red-500",    bg: "bg-red-50"    },
                    { label: "Por cobrar",  value: formatMoney(sumaPendiente),   icon: <FiDollarSign />,   color: "text-green-600",  bg: "bg-green-50"  },
                ].map(stat => (
                    <div key={stat.label}
                         className="bg-white rounded-xl border border-[#dbe6e6] px-5 py-4
                                    flex items-center gap-4 shadow-sm">
                        <div className={`w-10 h-10 rounded-xl ${stat.bg} ${stat.color}
                                         flex items-center justify-center text-lg shrink-0`}>
                            {stat.icon}
                        </div>
                        <div>
                            <p className="font-sans font-black text-lg text-slate-800 leading-none">
                                {stat.value}
                            </p>
                            <p className="font-sans text-xs text-slate-400 mt-0.5">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ── Tabla ── */}
            <div className="bg-white rounded-xl border border-[#dbe6e6] shadow-sm overflow-hidden">

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 gap-3">
                        <FiRefreshCw className="text-3xl text-slate-200 animate-spin" />
                        <p className="font-sans text-sm text-slate-400">Cargando pedidos...</p>
                    </div>

                ) : pedidosFiltrados.length === 0 ? (
                    /* Estado vacío */
                    <div className="flex flex-col items-center justify-center py-20 gap-4
                                    border-2 border-dashed border-[#dbe6e6] m-4 rounded-xl">
                        <div className="w-16 h-16 bg-slate-100 rounded-2xl flex items-center
                                        justify-center">
                            <FiShoppingBag className="text-3xl text-slate-300" />
                        </div>
                        <div className="text-center">
                            <p className="font-sans font-bold text-slate-600">
                                {busqueda ? "Sin resultados" : "¡Todo al día!"}
                            </p>
                            <p className="font-sans text-sm text-slate-400 mt-1 max-w-xs">
                                {busqueda
                                    ? "No hay pedidos que coincidan con tu búsqueda"
                                    : "No hay pedidos pendientes de cobro en este momento"
                                }
                            </p>
                        </div>
                        {busqueda && (
                            <button onClick={() => setBusqueda("")}
                                className="font-sans text-sm text-primary hover:underline">
                                Limpiar búsqueda
                            </button>
                        )}
                        <button onClick={cargarPedidos}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-primary
                                       text-white font-sans font-bold text-sm shadow-sm
                                       hover:bg-primary/90 transition-all active:scale-95">
                            <FiRefreshCw className="text-sm" /> Actualizar
                        </button>
                    </div>

                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead className="bg-[#f5f8f8] border-b border-[#dbe6e6]">
                                <tr>
                                    {["#", "Cliente", "Fecha / Hora", "Resumen", "Total", "Estado", "Acciones"].map(h => (
                                        <th key={h} className="px-6 py-4 font-sans text-sm
                                                                font-bold text-primary tracking-wide">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {pedidosFiltrados.map(pedido => (
                                    <FilaPedido
                                        key={pedido._id}
                                        pedido={pedido}
                                        onVer={setModalDetalle}
                                        onEditar={setModalEditar}
                                        onCobrar={handleCobrar}
                                        onEliminar={handleEliminar}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Footer conteo */}
                {!loading && pedidosFiltrados.length > 0 && (
                    <div className="px-6 py-4 border-t border-[#dbe6e6] flex items-center
                                    justify-between">
                        <p className="font-sans text-sm text-slate-500">
                            Mostrando{" "}
                            <span className="font-bold text-slate-700">{pedidosFiltrados.length}</span>
                            {" "}pedido{pedidosFiltrados.length !== 1 ? "s" : ""}
                            {busqueda && " (filtrado)"}
                        </p>
                        <button
                            onClick={cargarPedidos}
                            className="flex items-center gap-1.5 font-sans text-sm text-slate-400
                                       hover:text-primary transition-colors">
                            <FiRefreshCw className="text-sm" /> Actualizar
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default GestionPedidosPage