import PropTypes from "prop-types"
import {
    FiEdit2, FiTrash2, FiArrowUp, FiArrowDown,
    FiRefreshCw, FiUsers
} from "react-icons/fi"
import { RolBadge } from "../ui/RolBadge"
import { nombreCompleto } from "../../utils/formatters"

const HEADERS = ["Trabajador", "Email", "Rol", "Cédula", "Celular", "Acciones"]

function EmptyState() {
    return (
        <div className="p-12 text-center">
            <FiUsers className="text-4xl text-slate-300 mx-auto mb-3" />
            <p className="font-sans font-semibold text-slate-600">Sin trabajadores</p>
            <p className="text-sm font-sans text-slate-400 mt-1">
                Registra el primer miembro del equipo.
            </p>
        </div>
    )
}

function LoadingState() {
    return (
        <div className="p-12 text-center">
            <FiRefreshCw className="text-2xl text-slate-400 animate-spin mx-auto mb-2" />
            <p className="text-sm font-sans text-slate-500">Cargando trabajadores...</p>
        </div>
    )
}

const ROLES_JERARQUIA = ["trabajador", "supervisor", "administrador"]

export function StaffTable({ staff, loading, guardando, onEdit, onDelete, onAscender, onDescender }) {
    if (loading) return <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden"><LoadingState /></div>
    if (!staff.length) return <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden"><EmptyState /></div>

    return (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-50 border-b border-slate-200">
                            {HEADERS.map(h => (
                                <th key={h} className="px-6 py-4 text-xs font-sans font-bold text-slate-500 uppercase tracking-widest whitespace-nowrap">
                                    {h}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {staff.map((u) => {
                            const rolIdx = ROLES_JERARQUIA.indexOf(u.rol)
                            const puedeAscender  = rolIdx < ROLES_JERARQUIA.length - 1
                            const puedeDescender = rolIdx > 0
                            const enCambio = guardando

                            return (
                                <tr key={u._id ?? u.email} className="hover:bg-slate-50/50 transition-colors">
                                    {/* Nombre */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                                                <span className="text-xs font-sans font-bold text-primary">
                                                    {(u.nombre?.[0] ?? "?").toUpperCase()}
                                                </span>
                                            </div>
                                            <div>
                                                <p className="text-sm font-sans font-semibold text-slate-800">
                                                    {nombreCompleto(u)}
                                                </p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="px-6 py-4 text-sm font-sans text-slate-500">
                                        {u.email}
                                    </td>

                                    {/* Rol */}
                                    <td className="px-6 py-4">
                                        <RolBadge rol={u.rol} />
                                    </td>

                                    {/* Cédula */}
                                    <td className="px-6 py-4 text-sm font-sans text-slate-400">
                                        {u.cedula ?? "—"}
                                    </td>

                                    {/* Celular */}
                                    <td className="px-6 py-4 text-sm font-sans text-slate-400">
                                        {u.celular ?? "—"}
                                    </td>

                                    {/* Acciones */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">
                                            {/* Ascender */}
                                            <button
                                                onClick={() => onAscender(u)}
                                                disabled={!puedeAscender || enCambio}
                                                title="Ascender rol"
                                                className="p-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <FiArrowUp className="text-sm" />
                                            </button>

                                            {/* Descender */}
                                            <button
                                                onClick={() => onDescender(u)}
                                                disabled={!puedeDescender || enCambio}
                                                title="Descender rol"
                                                className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                            >
                                                <FiArrowDown className="text-sm" />
                                            </button>

                                            {/* Editar */}
                                            <button
                                                onClick={() => onEdit(u)}
                                                disabled={enCambio}
                                                title="Editar"
                                                className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50"
                                            >
                                                <FiEdit2 className="text-sm" />
                                            </button>

                                            {/* Eliminar */}
                                            <button
                                                onClick={() => onDelete(u)}
                                                disabled={enCambio}
                                                title="Eliminar"
                                                className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                                            >
                                                <FiTrash2 className="text-sm" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

StaffTable.propTypes = {
    staff:       PropTypes.array.isRequired,
    loading:     PropTypes.bool.isRequired,
    guardando:   PropTypes.bool,
    onEdit:      PropTypes.func.isRequired,
    onDelete:    PropTypes.func.isRequired,
    onAscender:  PropTypes.func.isRequired,
    onDescender: PropTypes.func.isRequired,
}