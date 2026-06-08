import PropTypes                             from "prop-types"
import { useState, useEffect, useCallback } from "react"
import { useNavigate, useLocation }          from "react-router-dom"
import {
    FiUser, FiPlus, FiTrash2, FiShoppingCart,
    FiCheckCircle, FiXCircle, FiRefreshCw,
    FiDollarSign, FiHash, FiPackage, FiMail, FiAlertCircle
} from "react-icons/fi"
import { pedidosService }   from "../../services/pedidosService"
import { apiFetch }         from "../../services/api"
import { formatMoney }      from "../../utils/formatters"
import { Toast }            from "../../components/ui/Toast"

// ─── Íconos inline ──────────────────────────────────────────────────────────
function IconCreditCard() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
             strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
        </svg>
    )
}
function IconBank() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}
             strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
    )
}

const METODOS_PAGO = [
    { id: "efectivo",      label: "Efectivo",  icon: <FiDollarSign className="text-3xl" /> },
    { id: "tarjeta",       label: "Tarjeta",   icon: <IconCreditCard /> },
    { id: "transferencia", label: "Transf.",   icon: <IconBank /> },
]

// ─── Fila de producto (solo cantidad editable) ───────────────────────────────
function FilaProducto({ fila, onCambiarCantidad, onEliminar }) {
    return (
        <tr className="border-b border-[#dbe6e6] hover:bg-[#f5f8f8] transition-colors group">
            <td className="px-4 py-3">
                <span className="font-sans text-sm font-medium text-slate-800">{fila.nombre}</span>
            </td>
            <td className="px-4 py-3 w-28">
                <input
                    type="number"
                    min="1"
                    value={fila.cantidad}
                    onChange={e => onCambiarCantidad(fila.id, Number(e.target.value))}
                    className="w-full rounded-lg border border-[#dbe6e6] bg-white px-3 py-2
                               font-sans text-sm text-slate-800 text-center
                               focus:outline-none focus:ring-2 focus:ring-primary/30
                               focus:border-primary transition-all"
                />
            </td>
            <td className="px-4 py-3 w-36">
                <div className="flex items-center gap-1 font-sans text-sm text-slate-600">
                    <span className="text-slate-400">$</span>
                    <span className="font-medium">{fila.precio.toFixed(2)}</span>
                </div>
            </td>
            <td className="px-4 py-3 w-36 text-right">
                <span className="font-sans font-bold text-sm text-slate-800">
                    {formatMoney(fila.precio * fila.cantidad)}
                </span>
            </td>
            <td className="px-4 py-3 w-16 text-center">
                <button
                    onClick={() => onEliminar(fila.id)}
                    className="text-red-400 hover:text-red-600 transition-colors p-1
                               opacity-60 group-hover:opacity-100"
                >
                    <FiTrash2 className="text-lg" />
                </button>
            </td>
        </tr>
    )
}

FilaProducto.propTypes = {
    fila: PropTypes.shape({
        id:       PropTypes.string.isRequired,
        nombre:   PropTypes.string.isRequired,
        cantidad: PropTypes.number.isRequired,
        precio:   PropTypes.number.isRequired,
    }).isRequired,
    onCambiarCantidad: PropTypes.func.isRequired,
    onEliminar:        PropTypes.func.isRequired,
}

// ─── Página principal ────────────────────────────────────────────────────────
export function VentaPage() {
    const navigate = useNavigate()
    const location = useLocation()

    // Formulario cliente (ningún campo es obligatorio)
    const [nombreCliente, setNombreCliente] = useState("")
    const [cedula,        setCedula]        = useState("")
    const [celular,       setCelular]       = useState("")
    const [direccion,     setDireccion]     = useState("")
    const [email,         setEmail]         = useState("")

    // Autocompletado cédula
    const [buscandoCedula,     setBuscandoCedula]     = useState(false)
    const [cedulaEncontrada,   setCedulaEncontrada]   = useState(false)
    const [cedulaNoEncontrada, setCedulaNoEncontrada] = useState(false)

    // Items del pedido
    const [items, setItems] = useState([])

    useEffect(() => {
        const itemsDesdeSelector = location.state?.itemsActuales
        if (itemsDesdeSelector && itemsDesdeSelector.length > 0) {
            setItems(itemsDesdeSelector)
            window.history.replaceState({}, "")
        }
    }, [location.state])

    // Pago y envío
    const [metodoPago, setMetodoPago] = useState("efectivo")
    const [enviando,   setEnviando]   = useState(false)
    const [toast,      setToast]      = useState({ type: "success", message: "" })

    // ── Autocompletar por cédula ──────────────────────────────────────────
    const buscarClientePorCedula = useCallback(async () => {
        const cedulaTrimmed = cedula.trim()
        if (!cedulaTrimmed) return
        try {
            setBuscandoCedula(true)
            setCedulaEncontrada(false)
            setCedulaNoEncontrada(false)
            const usuario = await apiFetch(`/api/user/buscar/${cedulaTrimmed}`)
            setNombreCliente(`${usuario.nombre} ${usuario.apellido}`)
            setCelular(usuario.celular    ?? "")
            setDireccion(usuario.direccion ?? "")
            setEmail(usuario.email        ?? "")
            setCedulaEncontrada(true)
            setToast({ type: "success", message: `Cliente encontrado: ${usuario.nombre} ${usuario.apellido}` })
        } catch {
            setCedulaNoEncontrada(true)   // ← activa el feedback de no encontrado
        } finally {
            setBuscandoCedula(false)
        }
    }, [cedula])

    const handleCedulaKeyDown = (e) => {
        if (e.key === "Enter") { e.preventDefault(); buscarClientePorCedula() }
    }
    const handleCedulaChange = (e) => {
        setCedula(e.target.value)
        setCedulaEncontrada(false)
        setCedulaNoEncontrada(false)   // resetea al escribir de nuevo
    }

    // ── Manejo de items ───────────────────────────────────────────────────
    const cambiarCantidad = useCallback((itemId, nuevaCantidad) => {
        if (nuevaCantidad < 1) return
        setItems(prev => prev.map(i =>
            i.id === itemId ? { ...i, cantidad: nuevaCantidad } : i
        ))
    }, [])

    const eliminarItem = useCallback((itemId) => {
        setItems(prev => prev.filter(i => i.id !== itemId))
    }, [])

    // ── Total ─────────────────────────────────────────────────────────────
    const total = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0)

    // ── Limpiar ───────────────────────────────────────────────────────────
    const limpiar = () => {
        setNombreCliente("")
        setCedula("")
        setCelular("")
        setDireccion("")
        setEmail("")
        setCedulaEncontrada(false)
        setItems([])
        setMetodoPago("efectivo")
    }

    // ── Registrar pedido ──────────────────────────────────────────────────
    // Los campos del cliente son opcionales: si están vacíos se envía "xxxxxx"
    const registrarPedido = async () => {
        if (items.length === 0) {
            setToast({ type: "error", message: "Agrega al menos un producto al pedido" })
            return
        }
        try {
            setEnviando(true)
            await pedidosService.crear({
                nombreCliente: nombreCliente.trim() || "xxxxxx",
                cedula:        cedula.trim()        || "xxxxxx",
                celular:       celular.trim()        || "xxxxxx",
                direccion:     direccion.trim()      || "xxxxxx",
                email:         email.trim()          || "xxxxxx",
                items: items.map(i => ({
                    producto: i.productoId,
                    nombre:   i.nombre,
                    precio:   i.precio,
                    cantidad: i.cantidad,
                    subtotal: i.precio * i.cantidad,
                })),
                total,
                metodoPago,
            })
            setToast({ type: "success", message: "¡Pedido registrado correctamente!" })
            limpiar()
        } catch (e) {
            setToast({ type: "error", message: e.message || "Error al registrar el pedido" })
        } finally {
            setEnviando(false)
        }
    }

    // ── Navegar al selector ───────────────────────────────────────────────
    const irASeleccion = () => {
        navigate("/admin/venta/productos", {
            state: { itemsActuales: items }
        })
    }

    return (
        <div className="space-y-6">
            <Toast
                type={toast.type}
                message={toast.message}
                onClose={() => setToast(p => ({ ...p, message: "" }))}
            />

            <div className="flex flex-col gap-1">
                <h1 className="font-sans text-2xl font-extrabold tracking-tight text-slate-800">
                    Nueva Venta
                </h1>
                <p className="font-sans text-sm text-slate-400">
                    Registra el cliente y los productos del pedido en un solo paso.
                </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-[#dbe6e6]">
                <div className="p-6 md:p-10 space-y-10">

                    {/* ════ Sección 1: Datos del Cliente ════ */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <FiUser className="text-primary text-xl" />
                            <h2 className="font-sans text-primary text-xl font-extrabold tracking-tight">
                                Datos del Cliente
                            </h2>
                        </div>
                        {/* Aviso: todos los campos son opcionales */}
                        <p className="font-sans text-xs text-slate-400 mb-5 -mt-2">
                            Todos los campos son opcionales. Los que queden vacíos se registrarán automáticamente.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Nombre — ya sin asterisco de requerido */}
                            <label className="flex flex-col gap-1.5">
                                <span className="font-sans text-sm font-semibold text-slate-700 ml-1">
                                    Nombre Completo
                                </span>
                                <div className="relative">
                                    <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="text" value={nombreCliente}
                                        onChange={e => setNombreCliente(e.target.value)}
                                        placeholder="Juan Pérez"
                                        className="w-full pl-11 pr-4 h-13 rounded-xl border border-[#dbe6e6]
                                                   font-sans text-sm text-slate-800 placeholder-slate-400
                                                   focus:outline-none focus:ring-2 focus:ring-primary/25
                                                   focus:border-primary transition-all" />
                                </div>
                            </label>

                            {/* Cédula con autocompletado */}
                            <label className="flex flex-col gap-1.5">
                                <span className="font-sans text-sm font-semibold text-slate-700 ml-1 flex items-center gap-2">
                                    Cédula / ID
                                    {cedulaEncontrada && (
                                        <span className="inline-flex items-center gap-1 text-xs font-sans
                                                         font-semibold text-green-600 bg-green-50
                                                         border border-green-200 px-2 py-0.5 rounded-full">
                                            <FiCheckCircle className="text-xs" /> Cliente registrado
                                        </span>
                                    )}
                                    {cedulaNoEncontrada && (
                                        <span className="inline-flex items-center gap-1 text-xs font-sans
                                                         font-semibold text-red-500 bg-red-50
                                                         border border-red-200 px-2 py-0.5 rounded-full">
                                            <FiAlertCircle className="text-xs" /> Cliente no encontrado
                                        </span>
                                    )}
                                </span>
                                <div className="relative">
                                    <FiHash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="text" value={cedula}
                                        onChange={handleCedulaChange}
                                        onKeyDown={handleCedulaKeyDown}
                                        placeholder="1712345678 — Enter para buscar"
                                        className={`w-full pl-11 pr-11 h-13 rounded-xl border font-sans
                                                   text-sm text-slate-800 placeholder-slate-400
                                                   focus:outline-none focus:ring-2 transition-all
                                                   ${cedulaEncontrada
                                                       ? "border-green-300 focus:ring-green-200 focus:border-green-400"
                                                       : cedulaNoEncontrada
                                                           ? "border-red-300 focus:ring-red-200 focus:border-red-400"
                                                           : "border-[#dbe6e6] focus:ring-primary/25 focus:border-primary"
                                                   }`} />
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
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
                                <p className="font-sans text-xs text-slate-400 ml-1">
                                    Presiona{" "}
                                    <kbd className="px-1.5 py-0.5 rounded bg-slate-100 border
                                                    border-slate-200 font-sans text-xs text-slate-500">
                                        Enter
                                    </kbd>
                                    {" "}para autocompletar si el cliente ya está registrado
                                </p>
                            </label>

                            {/* Celular */}
                            <label className="flex flex-col gap-1.5">
                                <span className="font-sans text-sm font-semibold text-slate-700 ml-1">Celular</span>
                                <div className="relative">
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
                                                 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1
                                                 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0
                                                 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1
                                                 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
                                    </svg>
                                    <input type="tel" value={celular}
                                        onChange={e => setCelular(e.target.value)}
                                        placeholder="+593 99 000 0000"
                                        className="w-full pl-11 pr-4 h-13 rounded-xl border border-[#dbe6e6]
                                                   font-sans text-sm text-slate-800 placeholder-slate-400
                                                   focus:outline-none focus:ring-2 focus:ring-primary/25
                                                   focus:border-primary transition-all" />
                                </div>
                            </label>

                            {/* Email */}
                            <label className="flex flex-col gap-1.5">
                                <span className="font-sans text-sm font-semibold text-slate-700 ml-1">Email</span>
                                <div className="relative">
                                    <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                    <input type="email" value={email}
                                        onChange={e => setEmail(e.target.value)}
                                        placeholder="correo@ejemplo.com"
                                        className="w-full pl-11 pr-4 h-13 rounded-xl border border-[#dbe6e6]
                                                   font-sans text-sm text-slate-800 placeholder-slate-400
                                                   focus:outline-none focus:ring-2 focus:ring-primary/25
                                                   focus:border-primary transition-all" />
                                </div>
                            </label>

                            {/* Dirección */}
                            <label className="flex flex-col gap-1.5">
                                <span className="font-sans text-sm font-semibold text-slate-700 ml-1">
                                    Dirección de Entrega
                                </span>
                                <div className="relative">
                                    <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                                         viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                                        <circle cx="12" cy="10" r="3"/>
                                    </svg>
                                    <input type="text" value={direccion}
                                        onChange={e => setDireccion(e.target.value)}
                                        placeholder="Av. Central #123, Ciudad"
                                        className="w-full pl-11 pr-4 h-13 rounded-xl border border-[#dbe6e6]
                                                   font-sans text-sm text-slate-800 placeholder-slate-400
                                                   focus:outline-none focus:ring-2 focus:ring-primary/25
                                                   focus:border-primary transition-all" />
                                </div>
                            </label>
                        </div>
                    </section>

                    <hr className="border-[#dbe6e6]" />

                    {/* ════ Sección 2: Detalles del Pedido ════ */}
                    <section>
                        <div className="flex items-center gap-2 mb-6">
                            <FiShoppingCart className="text-primary text-xl" />
                            <h2 className="font-sans text-primary text-xl font-extrabold tracking-tight">
                                Detalles del Pedido
                            </h2>
                        </div>

                        {items.length === 0 ? (
                            <div className="rounded-xl border-2 border-dashed border-[#dbe6e6]
                                            bg-[#f5f8f8]/60 py-16 flex flex-col items-center
                                            justify-center gap-3 text-center">
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-1">
                                    <FiPackage className="text-3xl text-slate-300" />
                                </div>
                                <p className="font-sans font-semibold text-slate-400 text-base">
                                    No hay productos en el pedido
                                </p>
                                <p className="font-sans text-sm text-slate-300 max-w-xs">
                                    Usa el botón de abajo para ir al catálogo y seleccionar los productos
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto rounded-xl border border-[#dbe6e6]">
                                <table className="w-full text-left border-collapse">
                                    <thead className="bg-[#f5f8f8] text-slate-700 font-sans">
                                        <tr>
                                            <th className="px-4 py-4 text-sm font-semibold">Producto</th>
                                            <th className="px-4 py-4 text-sm font-semibold w-28">Cantidad</th>
                                            <th className="px-4 py-4 text-sm font-semibold w-36">Precio Unit.</th>
                                            <th className="px-4 py-4 text-sm font-semibold w-36 text-right">Total</th>
                                            <th className="px-4 py-4 w-16"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {items.map(item => (
                                            <FilaProducto
                                                key={item.id}
                                                fila={item}
                                                onCambiarCantidad={cambiarCantidad}
                                                onEliminar={eliminarItem}
                                            />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        <button
                            onClick={irASeleccion}
                            className="mt-4 flex items-center gap-2 px-6 py-3 bg-secondary
                                       hover:bg-yellow-400 text-slate-900 font-sans font-bold text-sm
                                       rounded-xl transition-all shadow-md active:scale-95">
                            <FiPlus className="text-lg" />
                            {items.length > 0 ? "Modificar productos" : "Agregar Producto"}
                        </button>
                    </section>

                    {/* ════ Sección 3: Resumen y Pago ════ */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div>
                            <h3 className="font-sans text-lg font-bold text-slate-800 mb-4">Método de Pago</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {METODOS_PAGO.map(m => (
                                    <button key={m.id} onClick={() => setMetodoPago(m.id)}
                                        className={`flex flex-col items-center justify-center gap-1.5
                                            p-4 rounded-xl border-2 transition-all font-sans text-xs font-bold
                                            ${metodoPago === m.id
                                                ? "border-primary bg-primary/5 text-primary shadow-sm shadow-primary/10"
                                                : "border-transparent bg-[#f5f8f8] text-slate-500 hover:border-slate-300"
                                            }`}>
                                        <span className="text-2xl">{m.icon}</span>
                                        {m.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-[#f5f8f8] p-6 rounded-xl border border-[#dbe6e6]">
                            <h3 className="font-sans text-lg font-bold text-slate-800 mb-4">Resumen de Factura</h3>
                            <div className="space-y-2">
                                {items.map(i => (
                                    <div key={i.id} className="flex justify-between font-sans text-sm text-slate-500">
                                        <span className="truncate max-w-[60%]">
                                            {i.nombre}
                                            <span className="text-slate-400 ml-1">×{i.cantidad}</span>
                                        </span>
                                        <span className="font-medium text-slate-700">
                                            {formatMoney(i.precio * i.cantidad)}
                                        </span>
                                    </div>
                                ))}
                                {items.length > 0 ? (
                                    <div className="pt-3 border-t border-[#dbe6e6] flex justify-between items-end">
                                        <span className="font-sans text-xl font-bold text-slate-800">Total</span>
                                        <span className="font-sans text-3xl font-black text-primary">
                                            {formatMoney(total)}
                                        </span>
                                    </div>
                                ) : (
                                    <p className="font-sans text-sm text-slate-400 text-center py-4">
                                        Sin productos aún
                                    </p>
                                )}
                            </div>
                        </div>
                    </section>
                </div>

                {/* Footer */}
                <div className="bg-[#f5f8f8]/50 px-6 md:px-10 py-5 border-t border-[#dbe6e6]
                                flex flex-col sm:flex-row justify-between items-center gap-4">
                    <button
                        onClick={() => { limpiar(); navigate(-1) }}
                        className="font-sans text-sm font-medium text-slate-400
                                   hover:text-slate-700 hover:underline transition-colors order-2 sm:order-1">
                        <FiXCircle className="inline mr-1.5 text-base" />
                        Cancelar y limpiar
                    </button>
                    <button
                        onClick={registrarPedido}
                        disabled={enviando}
                        className="w-full sm:w-auto flex items-center justify-center gap-3
                                   px-10 py-4 bg-primary hover:bg-primary/90 text-white
                                   font-sans text-lg font-bold rounded-xl transition-all
                                   shadow-lg hover:shadow-primary/30 active:scale-95
                                   disabled:opacity-50 disabled:cursor-not-allowed
                                   disabled:active:scale-100 order-1 sm:order-2">
                        {enviando
                            ? <FiRefreshCw className="text-xl animate-spin" />
                            : <FiCheckCircle className="text-xl" />
                        }
                        {enviando ? "Registrando..." : "Registrar Pedido"}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default VentaPage