import { useState, useCallback } from "react"
import {
    FiPlus, FiSearch, FiBookOpen, FiUsers,
    FiRefreshCw, FiGrid, FiList
} from "react-icons/fi"

// Hooks
import { useProductos } from "../../hooks/useProductos"
import { useStaff }     from "../../hooks/useStaff"

// Componentes de menú
import { ProductoCard } from "../../components/menu/ProductoCard"
import { ProductoForm } from "../../components/menu/ProductoForm"
import { StaffTable }   from "../../components/menu/StaffTable"
import { StaffForm }    from "../../components/menu/StaffForm"

// Componentes UI
import { ConfirmModal } from "../../components/ui/ConfirmModal"
import { Toast }        from "../../components/ui/Toast"

// ────────────────────────────────────────────────────────────────────
// TABS
// ────────────────────────────────────────────────────────────────────
const TABS = [
    { key: "productos", label: "Menú & Productos", icon: <FiBookOpen /> },
    { key: "staff",     label: "Trabajadores",     icon: <FiUsers />   },
]

// ────────────────────────────────────────────────────────────────────
// PÁGINA PRINCIPAL
// ────────────────────────────────────────────────────────────────────
export function MenuManagerPage() {
    const [tab, setTab] = useState("productos")

    // ── Productos ────────────────────────────────────────────────
    const {
        productos, loading: loadProd, guardando: guardProd,
        error: errProd, success: okProd,
        crearProducto, actualizarProducto, eliminarProducto,
        clearMessages: clearProd,
    } = useProductos()

    // ── Staff ────────────────────────────────────────────────────
    const {
        staff, loading: loadStaff, guardando: guardStaff,
        error: errStaff, success: okStaff,
        crearStaff, editarStaff, ascenderRol, descenderRol, eliminarStaff,
        clearMessages: clearStaff,
    } = useStaff()

    // ── Estado modales/formularios ───────────────────────────────
    const [productoForm, setProductoForm] = useState({ open: false, data: null })
    const [staffForm,    setStaffForm]    = useState({ open: false, data: null })
    const [confirm,      setConfirm]      = useState({ open: false, action: null, item: null, title: "", msg: "" })

    // ── Búsqueda y filtros ───────────────────────────────────────
    const [searchProducto, setSearchProducto] = useState("")
    const [filterCategoria, setFilterCategoria] = useState("todas")
    const [searchStaff, setSearchStaff]       = useState("")
    const [vistaGrid, setVistaGrid]           = useState(true)

    // ── Helpers de confirmación ──────────────────────────────────
    const pedir = useCallback((action, item, title, msg) => {
        setConfirm({ open: true, action, item, title, msg })
    }, [])

    const ejecutarConfirm = useCallback(async () => {
        const { action, item } = confirm
        if (action === "deleteProducto") await eliminarProducto(item._id)
        if (action === "deleteStaff")    await eliminarStaff(item._id)
        if (action === "ascender")       await ascenderRol(item)
        if (action === "descender")      await descenderRol(item)
        setConfirm(c => ({ ...c, open: false }))
    }, [confirm, eliminarProducto, eliminarStaff, ascenderRol, descenderRol])

    // ── Submit producto ──────────────────────────────────────────
    const handleProductoSubmit = useCallback(async (datos) => {
        const { data } = productoForm
        const res = data
            ? await actualizarProducto(data._id, datos)
            : await crearProducto(datos)
        if (res.ok) setProductoForm({ open: false, data: null })
    }, [productoForm, actualizarProducto, crearProducto])

    // ── Submit staff ─────────────────────────────────────────────
    const handleStaffSubmit = useCallback(async (datos) => {
        const { data } = staffForm
        const res = data
            ? await editarStaff(data._id, datos)
            : await crearStaff(datos)
        if (res.ok) setStaffForm({ open: false, data: null })
    }, [staffForm, editarStaff, crearStaff])

    // ── Filtrado de productos ────────────────────────────────────
    const categorias = ["todas", ...new Set(productos.map(p => p.categoria).filter(Boolean))]
    const productosFiltrados = productos.filter(p => {
        const matchSearch = p.nombre.toLowerCase().includes(searchProducto.toLowerCase())
        const matchCat    = filterCategoria === "todas" || p.categoria === filterCategoria
        return matchSearch && matchCat
    })

    // ── Filtrado de staff ────────────────────────────────────────
    const staffFiltrado = staff.filter(u => {
        const full = `${u.nombre} ${u.apellido} ${u.email}`.toLowerCase()
        return full.includes(searchStaff.toLowerCase())
    })

    // ── Toast activo ─────────────────────────────────────────────
    const toastMsg     = okProd || okStaff || errProd || errStaff
    const toastType    = (okProd || okStaff) ? "success" : "error"
    const handleToastClose = () => { clearProd(); clearStaff() }

    // ────────────────────────────────────────────────────────────────
    return (
        <div className="space-y-6">

            {/* ── Tabs ───────────────────────────────────────────── */}
            <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-xl w-fit">
                {TABS.map(t => (
                    <button
                        key={t.key}
                        onClick={() => setTab(t.key)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-sans font-semibold transition-all ${
                            tab === t.key
                                ? "bg-primary text-white shadow-sm"
                                : "text-slate-500 hover:text-slate-800"
                        }`}
                    >
                        <span>{t.icon}</span>
                        {t.label}
                    </button>
                ))}
            </div>

            {/* ══════════════════════════════════════════════════════
                TAB: PRODUCTOS
            ══════════════════════════════════════════════════════ */}
            {tab === "productos" && (
                <div className="space-y-5">
                    {/* Barra de herramientas */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        {/* Búsqueda */}
                        <div className="relative flex-1 max-w-xs">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={searchProducto}
                                onChange={e => setSearchProducto(e.target.value)}
                                placeholder="Buscar producto..."
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 font-sans text-sm text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                            />
                        </div>

                        {/* Filtro categoría */}
                        <select
                            value={filterCategoria}
                            onChange={e => setFilterCategoria(e.target.value)}
                            className="px-3.5 py-2.5 rounded-xl border border-slate-200 font-sans text-sm text-slate-600 bg-white outline-none focus:border-primary focus:ring-2 focus:ring-primary/10"
                        >
                            {categorias.map(c => (
                                <option key={c} value={c}>
                                    {c === "todas" ? "Todas las categorías" : c}
                                </option>
                            ))}
                        </select>

                        {/* Vista Grid / Lista */}
                        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1">
                            <button
                                onClick={() => setVistaGrid(true)}
                                className={`p-1.5 rounded-lg transition-colors ${vistaGrid ? "bg-primary text-white" : "text-slate-400"}`}
                            >
                                <FiGrid className="text-sm" />
                            </button>
                            <button
                                onClick={() => setVistaGrid(false)}
                                className={`p-1.5 rounded-lg transition-colors ${!vistaGrid ? "bg-primary text-white" : "text-slate-400"}`}
                            >
                                <FiList className="text-sm" />
                            </button>
                        </div>

                        {/* Botón nuevo */}
                        <button
                            onClick={() => setProductoForm({ open: true, data: null })}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-sans font-semibold text-sm hover:bg-primary/90 transition-colors shrink-0"
                        >
                            <FiPlus />
                            Nuevo Producto
                        </button>
                    </div>

                    {/* Contador */}
                    <div className="flex items-center gap-2">
                        <h3 className="font-sans font-extrabold text-slate-700 text-sm">
                            Productos del menú
                        </h3>
                        <span className="bg-primary text-white text-xs font-sans font-bold px-2 py-0.5 rounded-full">
                            {productosFiltrados.length}
                        </span>
                    </div>

                    {/* Loading */}
                    {loadProd ? (
                        <div className="flex items-center justify-center py-20">
                            <FiRefreshCw className="text-2xl text-slate-400 animate-spin mr-3" />
                            <span className="font-sans text-slate-500">Cargando productos...</span>
                        </div>
                    ) : productosFiltrados.length === 0 ? (
                        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
                            <FiBookOpen className="text-4xl text-slate-300 mx-auto mb-3" />
                            <p className="font-sans font-semibold text-slate-600">Sin productos</p>
                            <p className="text-sm font-sans text-slate-400 mt-1">
                                {searchProducto || filterCategoria !== "todas"
                                    ? "No hay productos que coincidan con el filtro."
                                    : "Agrega el primer producto al menú."}
                            </p>
                        </div>
                    ) : vistaGrid ? (
                        /* Vista grid */
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {productosFiltrados.map(p => (
                                <ProductoCard
                                    key={p._id}
                                    producto={p}
                                    onEdit={(prod) => setProductoForm({ open: true, data: prod })}
                                    onDelete={(prod) => pedir(
                                        "deleteProducto", prod,
                                        "¿Eliminar producto?",
                                        `Se eliminará "${prod.nombre}" de forma permanente. Esta acción no se puede deshacer.`
                                    )}
                                />
                            ))}
                        </div>
                    ) : (
                        /* Vista lista */
                        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-slate-50 border-b border-slate-200">
                                            {["Producto", "Categoría", "Precio", "Estado", "Acciones"].map(h => (
                                                <th key={h} className="px-6 py-4 text-xs font-sans font-bold text-slate-500 uppercase tracking-widest">{h}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {productosFiltrados.map(p => (
                                            <tr key={p._id} className="hover:bg-slate-50/50 transition-colors">
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center gap-3">
                                                        {p.imagen
                                                            ? <img src={p.imagen} alt={p.nombre} className="w-10 h-10 rounded-xl object-cover" />
                                                            : <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300"><FiBookOpen /></div>
                                                        }
                                                        <div>
                                                            <p className="text-sm font-sans font-semibold text-slate-800">{p.nombre}</p>
                                                            {p.descripcion && <p className="text-xs font-sans text-slate-400 line-clamp-1">{p.descripcion}</p>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-3 text-sm font-sans text-slate-500">{p.categoria ?? "—"}</td>
                                                <td className="px-6 py-3 text-sm font-sans font-bold text-primary">
                                                    ${Number(p.precio).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-3">
                                                    <span className={`text-xs font-sans font-semibold px-2.5 py-1 rounded-full border ${
                                                        p.disponible !== false
                                                            ? "bg-green-50 text-green-600 border-green-200"
                                                            : "bg-red-50 text-red-500 border-red-200"
                                                    }`}>
                                                        {p.disponible !== false ? "Disponible" : "No disponible"}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => setProductoForm({ open: true, data: p })}
                                                            className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                                                        ><FiSearch className="text-sm" /></button>
                                                        <button
                                                            onClick={() => pedir("deleteProducto", p, "¿Eliminar producto?", `Se eliminará "${p.nombre}" de forma permanente.`)}
                                                            className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
                                                        ><FiUsers className="text-sm" /></button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* ══════════════════════════════════════════════════════
                TAB: TRABAJADORES
            ══════════════════════════════════════════════════════ */}
            {tab === "staff" && (
                <div className="space-y-5">
                    {/* Barra de herramientas */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                        <div className="relative flex-1 max-w-xs">
                            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                value={searchStaff}
                                onChange={e => setSearchStaff(e.target.value)}
                                placeholder="Buscar trabajador..."
                                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 font-sans text-sm text-slate-800 outline-none focus:border-primary focus:ring-2 focus:ring-primary/10 bg-white"
                            />
                        </div>

                        <button
                            onClick={() => setStaffForm({ open: true, data: null })}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white font-sans font-semibold text-sm hover:bg-primary/90 transition-colors shrink-0"
                        >
                            <FiPlus />
                            Registrar Trabajador
                        </button>
                    </div>

                    {/* Contador */}
                    <div className="flex items-center gap-2">
                        <h3 className="font-sans font-extrabold text-slate-700 text-sm">
                            Equipo de trabajo
                        </h3>
                        <span className="bg-primary text-white text-xs font-sans font-bold px-2 py-0.5 rounded-full">
                            {staffFiltrado.length}
                        </span>
                    </div>

                    {/* Info de roles */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {[
                            { rol: "trabajador",    label: "Trabajadores",   color: "slate" },
                            { rol: "supervisor",    label: "Supervisores",   color: "yellow" },
                            { rol: "administrador", label: "Administradores", color: "teal" },
                        ].map(({ rol, label, color }) => {
                            const count = staff.filter(u => u.rol === rol).length
                            return (
                                <div key={rol} className="bg-white rounded-xl border border-slate-200 px-4 py-3 flex items-center gap-3">
                                    <div className={`w-2 h-8 rounded-full ${
                                        color === "teal"   ? "bg-primary"          :
                                        color === "yellow" ? "bg-secondary"        :
                                        "bg-slate-300"
                                    }`} />
                                    <div>
                                        <p className="text-lg font-sans font-extrabold text-slate-800">{count}</p>
                                        <p className="text-xs font-sans text-slate-500">{label}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>

                    {/* Tabla */}
                    <StaffTable
                        staff={staffFiltrado}
                        loading={loadStaff}
                        guardando={guardStaff}
                        onEdit={(u) => setStaffForm({ open: true, data: u })}
                        onDelete={(u) => pedir(
                            "deleteStaff", u,
                            "¿Eliminar trabajador?",
                            `Se eliminará a ${u.nombre} ${u.apellido} del sistema. Esta acción no se puede deshacer.`
                        )}
                        onAscender={(u) => pedir(
                            "ascender", u,
                            "¿Ascender trabajador?",
                            `Se cambiará el rol de ${u.nombre} al siguiente nivel de la jerarquía.`
                        )}
                        onDescender={(u) => pedir(
                            "descender", u,
                            "¿Descender trabajador?",
                            `Se reducirá el rol de ${u.nombre} al nivel anterior de la jerarquía.`
                        )}
                    />
                </div>
            )}

            {/* ── Modales ──────────────────────────────────────────── */}
            <ProductoForm
                open={productoForm.open}
                producto={productoForm.data}
                guardando={guardProd}
                onClose={() => setProductoForm({ open: false, data: null })}
                onSubmit={handleProductoSubmit}
            />

            <StaffForm
                open={staffForm.open}
                staff={staffForm.data}
                guardando={guardStaff}
                onClose={() => setStaffForm({ open: false, data: null })}
                onSubmit={handleStaffSubmit}
            />

            <ConfirmModal
                open={confirm.open}
                title={confirm.title}
                message={confirm.msg}
                danger={confirm.action === "deleteProducto" || confirm.action === "deleteStaff"}
                confirmLabel={
                    confirm.action === "deleteProducto" || confirm.action === "deleteStaff" ? "Sí, eliminar" :
                    confirm.action === "ascender" ? "Sí, ascender" : "Sí, descender"
                }
                loading={guardProd || guardStaff}
                onConfirm={ejecutarConfirm}
                onCancel={() => setConfirm(c => ({ ...c, open: false }))}
            />

            {/* ── Toast ────────────────────────────────────────────── */}
            <Toast
                type={toastType}
                message={toastMsg}
                onClose={handleToastClose}
            />
        </div>
    )
}

export default MenuManagerPage