import PropTypes from "prop-types"
import { FiEdit2, FiTrash2, FiRefreshCw, FiPower, FiRepeat, FiDollarSign } from "react-icons/fi"
import { formatMoney, formatFecha } from "../../utils/formatters"

const HEADERS = ["Concepto", "Categoría", "Tipo", "Monto", "Fecha", "Estado", "Acciones"]

function EmptyState() {
    return (
        <div className="p-12 text-center">
            <FiDollarSign className="text-4xl text-slate-300 mx-auto mb-3" />
            <p className="font-sans font-semibold text-slate-600">Sin gastos en este filtro</p>
            <p className="text-sm font-sans text-slate-400 mt-1">
                Los gastos ocasionales de meses anteriores se ocultan automáticamente aquí.
            </p>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="p-12 text-center">
            <FiRefreshCw className="text-2xl text-slate-400 animate-spin mx-auto mb-2" />
            <p className="text-sm font-sans text-slate-500">Cargando gastos...</p>
        </div>
    )
}

// Placeholder invisible con el mismo tamaño que un botón de acción (p-1.5 + ícono text-sm)
function AccionSpacer() {
    return <span className="w-7.5 h-7.5 shrink-0" aria-hidden="true" />
}

export function GastosTable({ gastos, loading, guardando, onEdit, onToggle, onDelete }) {
    if (loading)        return <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden"><LoadingState /></div>
    if (!gastos.length) return <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden"><EmptyState /></div>

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            {HEADERS.map(h => (
                                <th key={h} className="px-6 py-4 text-xs font-sans font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">{h}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {gastos.map(g => (
                            <tr key={g._id} className="hover:bg-slate-50/50 transition-colors">
                                <td className="px-6 py-4 text-sm font-sans font-semibold text-slate-800">{g.concepto}</td>
                                <td className="px-6 py-4 text-sm font-sans text-slate-500">{g.categoria}</td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold border ${
                                        g.tipo === "fijo"
                                            ? "bg-primary/10 text-primary border-primary/20"
                                            : "bg-slate-100 text-slate-600 border-slate-200"
                                    }`}>
                                        {g.tipo === "fijo" && <FiRepeat className="text-xs" />}
                                        {g.tipo === "fijo" ? "Fijo" : "Ocasional"}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm font-sans font-bold text-slate-800">{formatMoney(g.monto)}</td>
                                <td className="px-6 py-4 text-sm font-sans text-slate-400">
                                    {g.tipo === "fijo" ? `Día ${new Date(g.fechaInicio).getUTCDate()} de cada mes` : formatFecha(g.fechaInicio)}
                                </td>
                                <td className="px-6 py-4">
                                    {g.tipo === "fijo" ? (
                                        <span className={`text-xs font-sans font-semibold px-2.5 py-1 rounded-full border ${
                                            g.activo
                                                ? "bg-green-50 text-green-600 border-green-200"
                                                : "bg-slate-100 text-slate-400 border-slate-200"
                                        }`}>
                                            {g.activo ? "Activo" : "Desactivado"}
                                        </span>
                                    ) : (
                                        <span className="text-xs font-sans text-slate-300">—</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-1.5">
                                        {g.tipo === "fijo" ? (
                                            <button type="button" onClick={() => onToggle(g)} disabled={guardando}
                                                title={g.activo ? "Desactivar" : "Reactivar"}
                                                className={`p-1.5 w-7.5 h-7.5 flex items-center justify-center rounded-lg transition-colors disabled:opacity-50 ${
                                                    g.activo
                                                        ? "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20"
                                                        : "bg-green-500/10 text-green-600 hover:bg-green-500/20"
                                                }`}>
                                                <FiPower className="text-sm" />
                                            </button>
                                        ) : (
                                            <AccionSpacer />
                                        )}
                                        <button type="button" onClick={() => onEdit(g)} disabled={guardando}
                                            className="p-1.5 w-7.5 h-7.5 flex items-center justify-center rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50">
                                            <FiEdit2 className="text-sm" />
                                        </button>
                                        <button type="button" onClick={() => onDelete(g)} disabled={guardando}
                                            className="p-1.5 w-7.5 h-7.5 flex items-center justify-center rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50">
                                            <FiTrash2 className="text-sm" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

GastosTable.propTypes = {
    gastos:    PropTypes.array.isRequired,
    loading:   PropTypes.bool.isRequired,
    guardando: PropTypes.bool,
    onEdit:    PropTypes.func.isRequired,
    onToggle:  PropTypes.func.isRequired,
    onDelete:  PropTypes.func.isRequired,
}