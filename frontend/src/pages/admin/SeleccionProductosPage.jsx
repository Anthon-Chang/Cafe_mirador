import PropTypes                              from "prop-types"
import { useState, useMemo, useCallback }    from "react"
import { useNavigate, useLocation }          from "react-router-dom"
import {
    FiSearch, FiArrowLeft, FiChevronRight,
    FiShoppingCart, FiCheck, FiCoffee,
    FiRefreshCw, FiAlertCircle, FiPlus, FiMinus
} from "react-icons/fi"
import { useProductos } from "../../hooks/useProductos"
import { formatMoney }  from "../../utils/formatters"

// ─── Íconos de categoría por defecto ─────────────────────────────────────────
const ICONOS_CATEGORIA = {
    "Cafés":           "☕",
    "Bebidas Frías":   "🧃",
    "Repostería":      "🥐",
    "Snacks":          "🍪",
    "Heladería":       "🍦",
    "Tradicionales":   "🍲",
    "Bebidas Calientes":"🫖",
    "default":         "🍽️",
}

const getIcono = (cat) => ICONOS_CATEGORIA[cat] ?? ICONOS_CATEGORIA["default"]

// Paleta de gradientes para las tarjetas de categoría (cíclica)
const GRADIENTES = [
    "from-teal-400/20 to-teal-600/5",
    "from-amber-400/20 to-amber-600/5",
    "from-rose-400/20 to-rose-600/5",
    "from-violet-400/20 to-violet-600/5",
    "from-sky-400/20 to-sky-600/5",
    "from-emerald-400/20 to-emerald-600/5",
    "from-orange-400/20 to-orange-600/5",
]

// ─── Utilidad: ID de item de carrito ─────────────────────────────────────────
const uid = () => Math.random().toString(36).slice(2, 9)

// ─── Tarjeta de Categoría ─────────────────────────────────────────────────────
function CategoriaCard({ nombre, total, gradiente, onClick }) {
    return (
        <button
            onClick={onClick}
            className={`
                group relative overflow-hidden rounded-2xl border border-[#dbe6e6]
                bg-linear-to-br ${gradiente} bg-white
                p-6 text-left transition-all duration-300
                hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-1
                hover:border-primary/40 active:scale-95
            `}
        >
            {/* Ícono grande decorativo */}
            <div className="text-5xl mb-4 select-none transition-transform duration-300
                            group-hover:scale-110 group-hover:-rotate-3">
                {getIcono(nombre)}
            </div>

            <h3 className="font-sans font-extrabold text-lg text-slate-800 leading-tight mb-1">
                {nombre}
            </h3>
            <p className="font-sans text-xs text-slate-400 font-medium">
                {total} {total === 1 ? "producto" : "productos"}
            </p>

            {/* Flecha */}
            <div className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/60
                            flex items-center justify-center border border-[#dbe6e6]
                            group-hover:bg-primary group-hover:border-primary
                            group-hover:text-white text-slate-400 transition-all duration-300">
                <FiChevronRight className="text-sm" />
            </div>

            {/* Línea decorativa inferior */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-primary rounded-full
                            group-hover:w-full transition-all duration-500" />
        </button>
    )
}

CategoriaCard.propTypes = {
    nombre:   PropTypes.string.isRequired,
    total:    PropTypes.number.isRequired,
    gradiente:PropTypes.string.isRequired,
    onClick:  PropTypes.func.isRequired,
}

// ─── Tarjeta de Producto ──────────────────────────────────────────────────────
function ProductoCard({ producto, cantidadEnCarrito, onAgregar, onQuitar }) {
    const enCarrito = cantidadEnCarrito > 0

    return (
        <div className={`
            group relative rounded-2xl border-2 overflow-hidden bg-white
            transition-all duration-300
            ${enCarrito
                ? "border-primary shadow-md shadow-primary/15"
                : "border-[#dbe6e6] hover:border-primary/40 hover:shadow-md"
            }
        `}>
            {/* Imagen */}
            <div className="relative h-44 overflow-hidden bg-slate-100">
                {producto.imagen ? (
                    <img
                        src={producto.imagen}
                        alt={producto.nombre}
                        className="w-full h-full object-cover transition-transform duration-500
                                   group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center">
                        <FiCoffee className="text-4xl text-slate-200" />
                    </div>
                )}

                {/* Badge precio */}
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm
                                px-3 py-1 rounded-full shadow-sm border border-[#dbe6e6]">
                    <span className="font-sans font-black text-sm text-primary">
                        {formatMoney(producto.precio)}
                    </span>
                </div>

                {/* Badge cantidad si está en carrito */}
                {enCarrito && (
                    <div className="absolute top-3 left-3 w-7 h-7 rounded-full bg-primary
                                    flex items-center justify-center shadow-sm">
                        <span className="font-sans font-black text-xs text-white">
                            {cantidadEnCarrito}
                        </span>
                    </div>
                )}
            </div>

            {/* Info */}
            <div className="p-4">
                <h4 className="font-sans font-bold text-sm text-slate-800 leading-tight
                               line-clamp-1 mb-1">
                    {producto.nombre}
                </h4>
                {producto.descripcion && (
                    <p className="font-sans text-xs text-slate-400 line-clamp-2 mb-3 leading-relaxed">
                        {producto.descripcion}
                    </p>
                )}

                {/* Controles */}
                {enCarrito ? (
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-1 bg-slate-100 rounded-xl p-1">
                            <button
                                onClick={() => onQuitar(producto._id)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg
                                           text-slate-600 hover:bg-white hover:text-red-500
                                           transition-all"
                            >
                                <FiMinus className="text-xs" />
                            </button>
                            <span className="font-sans font-black text-sm text-slate-800
                                             w-8 text-center">
                                {cantidadEnCarrito}
                            </span>
                            <button
                                onClick={() => onAgregar(producto)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg
                                           text-slate-600 hover:bg-white hover:text-primary
                                           transition-all"
                            >
                                <FiPlus className="text-xs" />
                            </button>
                        </div>
                        <span className="font-sans font-bold text-sm text-primary">
                            {formatMoney(producto.precio * cantidadEnCarrito)}
                        </span>
                    </div>
                ) : (
                    <button
                        onClick={() => onAgregar(producto)}
                        className="w-full mt-2 flex items-center justify-center gap-2
                                   py-2.5 rounded-xl bg-[#f5f8f8] hover:bg-primary
                                   text-slate-600 hover:text-white font-sans font-bold text-sm
                                   border border-[#dbe6e6] hover:border-primary
                                   transition-all duration-200 active:scale-95"
                    >
                        <FiPlus className="text-sm" />
                        Agregar
                    </button>
                )}
            </div>
        </div>
    )
}

ProductoCard.propTypes = {
    producto: PropTypes.shape({
        _id:         PropTypes.string.isRequired,
        nombre:      PropTypes.string.isRequired,
        precio:      PropTypes.number.isRequired,
        imagen:      PropTypes.string,
        descripcion: PropTypes.string,
    }).isRequired,
    cantidadEnCarrito: PropTypes.number.isRequired,
    onAgregar:         PropTypes.func.isRequired,
    onQuitar:          PropTypes.func.isRequired,
}

// ─── Página principal ─────────────────────────────────────────────────────────
export function SeleccionProductosPage() {
    const navigate  = useNavigate()
    const location  = useLocation()

    // Items previos pasados por state desde VentaPage (si los hay)
    const itemsPrevios = location.state?.itemsActuales ?? []

    // ── Cargar productos del backend ──────────────────────────────────────
    const { productos, loading } = useProductos()

    // ── Estado local ──────────────────────────────────────────────────────
    const [busqueda,          setBusqueda]          = useState("")
    const [categoriaActiva,   setCategoriaActiva]   = useState(null) // null = vista categorías
    const [carrito,           setCarrito]           = useState(() => {
        // Inicializar carrito con los items que ya venían de VentaPage
        return itemsPrevios.reduce((acc, item) => {
            acc[item.productoId] = { ...item }
            return acc
        }, {})
    })

    // ── Derivar categorías únicas dinámicamente ───────────────────────────
    const categorias = useMemo(() => {
        const set = new Set(productos.map(p => p.categoria).filter(Boolean))
        return [...set].sort()
    }, [productos])

    // ── Productos filtrados ───────────────────────────────────────────────
    const productosFiltrados = useMemo(() => {
        return productos.filter(p => {
            const matchBusqueda  = p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                                   p.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
            const matchCategoria = !categoriaActiva || p.categoria === categoriaActiva
            return matchBusqueda && matchCategoria
        })
    }, [productos, busqueda, categoriaActiva])

    // ── Carrito: agregar ──────────────────────────────────────────────────
    const agregar = useCallback((producto) => {
        setCarrito(prev => {
            const existe = prev[producto._id]
            if (existe) {
                return { ...prev, [producto._id]: { ...existe, cantidad: existe.cantidad + 1 } }
            }
            return {
                ...prev,
                [producto._id]: {
                    id:         uid(),
                    productoId: producto._id,
                    nombre:     producto.nombre,
                    precio:     producto.precio,
                    cantidad:   1,
                }
            }
        })
    }, [])

    // ── Carrito: quitar uno ───────────────────────────────────────────────
    const quitar = useCallback((productoId) => {
        setCarrito(prev => {
            const item = prev[productoId]
            if (!item) return prev
            if (item.cantidad <= 1) {
                // eslint-disable-next-line no-unused-vars
                const { [productoId]: _removed, ...resto } = prev
                return resto
            }
            return { ...prev, [productoId]: { ...item, cantidad: item.cantidad - 1 } }
        })
    }, [])

    // ── Totales del carrito ───────────────────────────────────────────────
    const itemsCarrito    = Object.values(carrito)
    const totalItems      = itemsCarrito.reduce((a, i) => a + i.cantidad, 0)
    const totalPrecio     = itemsCarrito.reduce((a, i) => a + i.precio * i.cantidad, 0)

    // ── Confirmar selección y volver a VentaPage ──────────────────────────
    const confirmarSeleccion = () => {
        navigate("/admin/venta", {
            state: { itemsActuales: itemsCarrito }
        })
    }

    // ── Categorías con conteo ─────────────────────────────────────────────
    const categoriaConConteo = useMemo(() => {
        return categorias.map(cat => ({
            nombre: cat,
            total:  productos.filter(p => p.categoria === cat).length,
        }))
    }, [categorias, productos])

    // ── Vista activa ──────────────────────────────────────────────────────
    const vistaBusqueda   = busqueda.trim().length > 0
    const vistaCategorias = !vistaBusqueda && !categoriaActiva

    return (
        <div className="min-h-full flex flex-col -m-6 lg:-m-8">

            {/* ── Header ── */}
            <div className="sticky top-0 z-30 bg-white border-b border-[#dbe6e6] shadow-sm">
                <div className="px-6 lg:px-8 py-4 flex items-center gap-4">

                    {/* Volver */}
                    <button
                        onClick={() => navigate("/admin/venta")}
                        className="p-2 rounded-xl text-slate-400 hover:text-primary
                                   hover:bg-slate-100 transition-colors shrink-0"
                    >
                        <FiArrowLeft className="text-lg" />
                    </button>

                    {/* Breadcrumb + buscador */}
                    <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-3">
                        <div className="shrink-0">
                            {vistaCategorias ? (
                                <h2 className="font-sans font-extrabold text-slate-800 text-lg leading-none">
                                    Selección de Productos
                                </h2>
                            ) : (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={() => { setCategoriaActiva(null); setBusqueda("") }}
                                        className="font-sans text-sm text-slate-400 hover:text-primary
                                                   transition-colors"
                                    >
                                        Categorías
                                    </button>
                                    {categoriaActiva && (
                                        <>
                                            <FiChevronRight className="text-slate-300 text-xs" />
                                            <span className="font-sans font-bold text-sm text-slate-800">
                                                {getIcono(categoriaActiva)} {categoriaActiva}
                                            </span>
                                        </>
                                    )}
                                    {vistaBusqueda && !categoriaActiva && (
                                        <>
                                            <FiChevronRight className="text-slate-300 text-xs" />
                                            <span className="font-sans font-bold text-sm text-slate-800">
                                                Resultados de búsqueda
                                            </span>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Buscador */}
                        <div className="relative flex-1 max-w-md">
                            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2
                                                 text-slate-400 text-sm" />
                            <input
                                type="text"
                                value={busqueda}
                                onChange={e => setBusqueda(e.target.value)}
                                placeholder="Buscar por nombre o descripción..."
                                className="w-full pl-10 pr-4 h-10 rounded-xl border border-[#dbe6e6]
                                           bg-[#f5f8f8] font-sans text-sm text-slate-800
                                           placeholder-slate-400 focus:outline-none focus:ring-2
                                           focus:ring-primary/25 focus:border-primary transition-all"
                            />
                        </div>
                    </div>

                    {/* Botón carrito */}
                    {totalItems > 0 && (
                        <button
                            onClick={confirmarSeleccion}
                            className="shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl
                                       bg-primary text-white font-sans font-bold text-sm
                                       shadow-sm shadow-primary/20 hover:bg-primary/90
                                       active:scale-95 transition-all"
                        >
                            <FiShoppingCart className="text-base" />
                            <span className="hidden sm:inline">Confirmar</span>
                            <span className="bg-white/25 text-white text-xs font-black
                                             px-1.5 py-0.5 rounded-full">
                                {totalItems}
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* ── Contenido principal ── */}
            <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">

                {/* ══════════════════════════════════════════
                    COLUMNA IZQUIERDA — Catálogo
                ══════════════════════════════════════════ */}
                <div className="flex-1 overflow-y-auto px-6 lg:px-8 py-6">

                    {loading ? (
                        /* Loading */
                        <div className="flex flex-col items-center justify-center py-24 gap-4">
                            <FiRefreshCw className="text-3xl text-slate-300 animate-spin" />
                            <p className="font-sans text-sm text-slate-400">Cargando catálogo...</p>
                        </div>

                    ) : vistaCategorias ? (
                        /* ── Vista: Categorías en grid ── */
                        <>
                            <p className="font-sans text-xs font-bold text-slate-400 uppercase
                                          tracking-widest mb-5">
                                {categorias.length} categorías disponibles
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
                                            lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {categoriaConConteo.map((cat, idx) => (
                                    <CategoriaCard
                                        key={cat.nombre}
                                        nombre={cat.nombre}
                                        total={cat.total}
                                        gradiente={GRADIENTES[idx % GRADIENTES.length]}
                                        onClick={() => setCategoriaActiva(cat.nombre)}
                                    />
                                ))}

                                {/* Tarjeta "Ver todos" */}
                                <button
                                    onClick={() => setCategoriaActiva("")}
                                    className="group rounded-2xl border-2 border-dashed border-[#dbe6e6]
                                               p-6 text-left transition-all duration-300
                                               hover:border-primary/40 hover:bg-primary/3
                                               hover:-translate-y-1 active:scale-95"
                                >
                                    <div className="text-5xl mb-4 select-none">🔍</div>
                                    <h3 className="font-sans font-extrabold text-lg text-slate-500
                                                   leading-tight mb-1">
                                        Ver todos
                                    </h3>
                                    <p className="font-sans text-xs text-slate-400 font-medium">
                                        {productos.length} productos
                                    </p>
                                </button>
                            </div>
                        </>

                    ) : productosFiltrados.length === 0 ? (
                        /* Sin resultados */
                        <div className="flex flex-col items-center justify-center py-24 gap-3">
                            <FiAlertCircle className="text-3xl text-slate-200" />
                            <p className="font-sans font-semibold text-slate-400">
                                No se encontraron productos
                            </p>
                            <button
                                onClick={() => { setBusqueda(""); setCategoriaActiva(null) }}
                                className="font-sans text-sm text-primary hover:underline"
                            >
                                Limpiar filtros
                            </button>
                        </div>

                    ) : (
                        /* ── Vista: Grid de productos ── */
                        <>
                            <p className="font-sans text-xs font-bold text-slate-400 uppercase
                                          tracking-widest mb-5">
                                {productosFiltrados.length} productos
                                {categoriaActiva ? ` en ${categoriaActiva}` : ""}
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4
                                            lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {productosFiltrados.map(prod => (
                                    <ProductoCard
                                        key={prod._id}
                                        producto={prod}
                                        cantidadEnCarrito={carrito[prod._id]?.cantidad ?? 0}
                                        onAgregar={agregar}
                                        onQuitar={quitar}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* ══════════════════════════════════════════
                    COLUMNA DERECHA — Resumen del pedido
                ══════════════════════════════════════════ */}
                <div className="w-full lg:w-80 xl:w-96 flex flex-col bg-white
                                border-t lg:border-t-0 lg:border-l border-[#dbe6e6]">

                    <div className="px-6 py-5 border-b border-[#dbe6e6] flex items-center
                                    justify-between">
                        <h3 className="font-sans font-extrabold text-slate-800 flex items-center gap-2">
                            <FiShoppingCart className="text-primary" />
                            Pedido actual
                        </h3>
                        {totalItems > 0 && (
                            <span className="bg-primary text-white text-xs font-sans font-bold
                                             px-2.5 py-1 rounded-full">
                                {totalItems} items
                            </span>
                        )}
                    </div>

                    {/* Lista de items */}
                    <div className="flex-1 overflow-y-auto px-6 py-4">
                        {itemsCarrito.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-3">
                                <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center
                                                justify-center">
                                    <FiShoppingCart className="text-2xl text-slate-300" />
                                </div>
                                <p className="font-sans text-sm text-slate-400 text-center">
                                    Ningún producto seleccionado aún
                                </p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {itemsCarrito.map(item => (
                                    <div key={item.productoId}
                                         className="flex items-center gap-3 py-3 border-b
                                                    border-slate-100 last:border-0">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-sans font-semibold text-sm
                                                           text-slate-800 truncate">
                                                {item.nombre}
                                            </p>
                                            <p className="font-sans text-xs text-slate-400 mt-0.5">
                                                {formatMoney(item.precio)} × {item.cantidad}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                                onClick={() => quitar(item.productoId)}
                                                className="w-6 h-6 rounded-lg bg-slate-100 flex items-center
                                                           justify-center text-slate-500 hover:bg-red-50
                                                           hover:text-red-500 transition-all"
                                            >
                                                <FiMinus className="text-xs" />
                                            </button>
                                            <span className="font-sans font-bold text-sm text-slate-800
                                                             w-5 text-center">
                                                {item.cantidad}
                                            </span>
                                            <button
                                                onClick={() => agregar({ _id: item.productoId, nombre: item.nombre, precio: item.precio })}
                                                className="w-6 h-6 rounded-lg bg-slate-100 flex items-center
                                                           justify-center text-slate-500 hover:bg-primary/10
                                                           hover:text-primary transition-all"
                                            >
                                                <FiPlus className="text-xs" />
                                            </button>
                                        </div>
                                        <span className="font-sans font-bold text-sm text-slate-800
                                                         w-14 text-right shrink-0">
                                            {formatMoney(item.precio * item.cantidad)}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Footer con total y confirmar */}
                    <div className="border-t border-[#dbe6e6] px-6 py-5 space-y-4">
                        {itemsCarrito.length > 0 && (
                            <div className="flex justify-between items-center">
                                <span className="font-sans font-bold text-slate-800">Total</span>
                                <span className="font-sans text-2xl font-black text-primary">
                                    {formatMoney(totalPrecio)}
                                </span>
                            </div>
                        )}

                        <button
                            onClick={confirmarSeleccion}
                            disabled={itemsCarrito.length === 0}
                            className="w-full flex items-center justify-center gap-2 py-3.5
                                       rounded-xl bg-primary text-white font-sans font-bold text-sm
                                       hover:bg-primary/90 transition-all shadow-sm shadow-primary/20
                                       active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed
                                       disabled:active:scale-100"
                        >
                            <FiCheck className="text-base" />
                            Confirmar selección
                        </button>

                        <button
                            onClick={() => navigate("/admin/venta")}
                            className="w-full text-center font-sans text-sm text-slate-400
                                       hover:text-slate-600 transition-colors py-1"
                        >
                            Cancelar y volver
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SeleccionProductosPage