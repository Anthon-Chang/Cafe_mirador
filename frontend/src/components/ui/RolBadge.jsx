import PropTypes from "prop-types"

const ROL_CONFIG = {
    superadmin:    { label: "Super Admin",    classes: "bg-purple-100 text-purple-700 border-purple-200" },
    administrador: { label: "Administrador",  classes: "bg-primary/10 text-primary border-primary/20"    },
    supervisor:    { label: "Supervisor",     classes: "bg-secondary/20 text-yellow-700 border-secondary/40" },
    trabajador:    { label: "Trabajador",     classes: "bg-slate-100 text-slate-600 border-slate-200"    },
    cliente:       { label: "Cliente",        classes: "bg-green-100 text-green-700 border-green-200"    },
}

export function RolBadge({ rol }) {
    const config = ROL_CONFIG[rol] ?? { label: rol, classes: "bg-slate-100 text-slate-600 border-slate-200" }
    return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-sans font-semibold border ${config.classes}`}>
            {config.label}
        </span>
    )
}

RolBadge.propTypes = {
    rol: PropTypes.string.isRequired,
}