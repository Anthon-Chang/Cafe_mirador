import PropTypes from "prop-types"
import { FiEdit2, FiTrash2, FiArrowUp, FiArrowDown, FiRefreshCw, FiUsers } from "react-icons/fi"
import { RolesBadges } from "../ui/RolBadge"
import { nombreCompleto } from "../../utils/formatters"

const HEADERS = ["Trabajador", "Email", "Roles", "Cédula", "Celular", "Acciones"]
const JERARQUIA = ["cliente", "trabajador", "supervisor", "administrador", "superadmin"]
const ROLES_STAFF = ["trabajador", "supervisor", "administrador"]

function EmptyState() {
    return (
        <div className="p-12 text-center">
            <FiUsers className="text-4xl text-slate-300 mx-auto mb-3" />
            <p className="font-sans font-semibold text-slate-600">Sin trabajadores</p>
            <p className="text-sm font-sans text-slate-400 mt-1">Registra el primer miembro del equipo.</p>
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

/** Rol de staff más alto del usuario */
const rolStaffDominante = (roles = []) => {
    const staffRoles = roles.filter(r => ROLES_STAFF.includes(r))
    return [...staffRoles].sort((a, b) => JERARQUIA.indexOf(b) - JERARQUIA.indexOf(a))[0] ?? "trabajador"
}

export function StaffTable({ staff, loading, guardando, onEdit, onDelete, onAscender, onDescender }) {
    if (loading)       return <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden"><LoadingState /></div>
    if (!staff.length) return <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden"><EmptyState /></div>

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
                        {staff.map((u) => {
                            const roles          = u.roles ?? [u.rol]
                            const rolesStaff     = roles.filter(r => ROLES_STAFF.includes(r))
                            const rolActual      = rolStaffDominante(roles)
                            const idxStaff       = ROLES_STAFF.indexOf(rolActual)
                            const puedeAscender  = idxStaff < ROLES_STAFF.length - 1
                            const puedeDescender = idxStaff > 0

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
                                                <p className="text-sm font-sans font-semibold text-slate-800">{nombreCompleto(u)}</p>
                                            </div>
                                        </div>
                                    </td>

                                    {/* Email */}
                                    <td className="px-6 py-4 text-sm font-sans text-slate-500">{u.email}</td>

                                    {/* Roles (solo roles de staff, sin cliente) */}
                                    <td className="px-6 py-4">
                                        <RolesBadges roles={rolesStaff.length ? rolesStaff : roles.filter(r => r !== "cliente")} />
                                    </td>

                                    {/* Cédula */}
                                    <td className="px-6 py-4 text-sm font-sans text-slate-400">{u.cedula ?? "—"}</td>

                                    {/* Celular */}
                                    <td className="px-6 py-4 text-sm font-sans text-slate-400">{u.celular ?? "—"}</td>

                                    {/* Acciones */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5">

                                            {/* Ascender */}
                                            <div className="relative group/asc">
                                                <button type="button" onClick={() => onAscender(u)}
                                                    disabled={!puedeAscender || guardando}
                                                    className="p-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                                    <FiArrowUp className="text-sm" />
                                                </button>
                                                <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[10px] font-sans font-semibold text-white opacity-0 group-hover/asc:opacity-100 transition-opacity shadow-lg z-10">
                                                    Ascender rol
                                                </span>
                                            </div>

                                            {/* Descender */}
                                            <div className="relative group/desc">
                                                <button type="button" onClick={() => onDescender(u)}
                                                    disabled={!puedeDescender || guardando}
                                                    className="p-1.5 rounded-lg bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                                                    <FiArrowDown className="text-sm" />
                                                </button>
                                                <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[10px] font-sans font-semibold text-white opacity-0 group-hover/desc:opacity-100 transition-opacity shadow-lg z-10">
                                                    Descender rol
                                                </span>
                                            </div>

                                            {/* Editar */}
                                            <div className="relative group/edit">
                                                <button type="button" onClick={() => onEdit(u)}
                                                    disabled={guardando}
                                                    className="p-1.5 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors disabled:opacity-50">
                                                    <FiEdit2 className="text-sm" />
                                                </button>
                                                <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[10px] font-sans font-semibold text-white opacity-0 group-hover/edit:opacity-100 transition-opacity shadow-lg z-10">
                                                    Editar
                                                </span>
                                            </div>

                                            {/* Eliminar */}
                                            <div className="relative group/del">
                                                <button type="button" onClick={() => onDelete(u)}
                                                    disabled={guardando}
                                                    className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors disabled:opacity-50">
                                                    <FiTrash2 className="text-sm" />
                                                </button>
                                                <span className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 whitespace-nowrap rounded-md bg-slate-800 px-2 py-1 text-[10px] font-sans font-semibold text-white opacity-0 group-hover/del:opacity-100 transition-opacity shadow-lg z-10">
                                                    {/* Si tiene rol de cliente avisamos que solo se quitan roles de staff */}
                                                    {roles.includes("cliente") ? "Quitar rol staff" : "Eliminar"}
                                                </span>
                                            </div>

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